##################################################################### TERRAFORM
##################################################################### TERRAFORM
##################################################################### TERRAFORM
##################################################################### TERRAFORM

terraform {
    backend "s3" {
        bucket         = "mplos-terraform-bucket"
        key            = "pos-system/terraform.tfstate"
        region         = "us-east-2"
        dynamodb_table = "terraform-lock-table"
        encrypt        = true
    }
    required_providers {
        aws ={
            source  = "hashicorp/aws"
            version = "~> 6.0"
        }
    }
}

provider "aws" {
    region = var.region
}

##################################################################### S3 BUCKET
##################################################################### S3 BUCKET
##################################################################### S3 BUCKET
##################################################################### S3 BUCKET

resource "aws_s3_bucket" "mlpos_static_bucket" {
    bucket = "mlpos-frontend"
    force_destroy = true
    tags = {
        Name        = "MPLOS Bucket"
        Environment = "main"
    }
}

resource "aws_s3_bucket_public_access_block" "mlpos_static_bucket" {
    bucket = aws_s3_bucket.mlpos_static_bucket.id
    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "mlpos_static_bucket" {
    bucket = aws_s3_bucket.mlpos_static_bucket.id
    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Sid = "AllowCloudFrontServicePrincipal"
                Effect = "Allow"
                Principal = {
                    Service = "cloudfront.amazonaws.com"
                }
                Action = "s3:GetObject"
                Resource = "${aws_s3_bucket.mlpos_static_bucket.arn}/*"
                Condition = {
                    StringEquals = {
                        "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
                    }
                }
            }
        ]
    })
}

##################################################################### LAMBDA
##################################################################### LAMBDA
##################################################################### LAMBDA
##################################################################### LAMBDA

resource "aws_lambda_function" "express_app" {
    filename = "lambda.zip"
    function_name = "mlpos-backend"
    role = aws_iam_role.lambda_exec.arn
    handler = "lambda.handler"
    runtime = "nodejs22.x"
    timeout = 30
    vpc_config {
      subnet_ids         = data.aws_subnets.default.ids
      security_group_ids = [aws_security_group.lambda_sg.id]
    }
    environment {
        variables = {
            NODE_ENV    = "production"
            DB_HOST     = aws_db_instance.mlpos_db.address
            DB_PORT     = "5432"
            DB_NAME     = aws_db_instance.mlpos_db.db_name
            DB_USER     = aws_db_instance.mlpos_db.username
            DB_PASSWORD = aws_db_instance.mlpos_db.password
        }
    }
}

resource "aws_lambda_function_url" "express_app" {
    function_name = aws_lambda_function.express_app.function_name
    authorization_type = "NONE"
}

resource "aws_iam_role" "lambda_exec" {
    name = "lambda-exec-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = "lambda.amazonaws.com"
                }
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "labda_basic" {
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    role = aws_iam_role.lambda_exec.name
}

resource "aws_iam_role_policy" "lambda_rds_policy" {
  name = "lambda-rds-access"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBClusters"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:AssignPrivateIpAddresses",
          "ec2:UnassignPrivateIpAddresses"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_cognito_policy" {
  name = "lambda-cognito-access"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminDeleteUser",
          "cognito-idp:AdminUpdateUserAttributes",
          "cognito-idp:ListUsers"
        ]
        Resource = aws_cognito_user_pool.user_pool.arn
      }
    ]
  })
}

# Get default VPC subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

##################################################################### CLOUDFRONT
##################################################################### CLOUDFRONT
##################################################################### CLOUDFRONT
##################################################################### CLOUDFRONT

resource "aws_cloudfront_distribution" "main" {
    enabled = true
    default_root_object = "index.html"
    price_class = "PriceClass_100"
    origin {
        domain_name = aws_s3_bucket.mlpos_static_bucket.bucket_regional_domain_name
        origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
        origin_id = "s3-origin"
     }
    origin {
        domain_name = trimsuffix(replace(aws_lambda_function_url.express_app.function_url, "https://", ""), "/")
        origin_id = "express-origin"
        custom_origin_config {
            http_port = 80
            https_port = 443
            origin_protocol_policy = "https-only"
            origin_ssl_protocols = [ "TLSv1.2" ]
        }
    }
    ordered_cache_behavior {
        path_pattern = "/api/*"
        target_origin_id = "express-origin"
        viewer_protocol_policy = "redirect-to-https"
        allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
        cached_methods = ["GET", "HEAD"]
        forwarded_values {
            query_string = true
            headers = ["Authorization", "Content-Type"]
            cookies {
                forward = "all"
            }
        }
        min_ttl = 0
        default_ttl = 0
        max_ttl = 0
    }
    default_cache_behavior {
        target_origin_id = "s3-origin"
        viewer_protocol_policy = "redirect-to-https"
        allowed_methods = [ "GET", "HEAD", "OPTIONS" ]
        cached_methods = [ "GET", "HEAD" ]
        forwarded_values {
            query_string = false
            cookies {
                forward = "none"
            }
        }
        min_ttl = 0
        default_ttl = 3600
        max_ttl = 86400
    }
    restrictions {
        geo_restriction {
            restriction_type = "whitelist"
            locations = [ "US", "CA" ]
        }
    }
    viewer_certificate {
        cloudfront_default_certificate = true
    }
}

resource "aws_cloudfront_origin_access_control" "s3_oac" {
    name                              = "s3-oac"
    origin_access_control_origin_type = "s3"
    signing_behavior                  = "always"
    signing_protocol                  = "sigv4"
}

######################################################################## RDS
######################################################################## RDS
######################################################################## RDS
######################################################################## RDS

resource "aws_security_group" "rds_sg" {
  name        = "mlpos-rds-sg"
  description = "Allow Lambda to access RDS"
  vpc_id      = data.aws_vpc.default.id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]
  }
#   TODO REMOVE IN PRODUCTION
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "lambda_sg" {
  name        = "mlpos-lambda-sg"
  description = "Allow Lambda to connect to RDS"
  vpc_id      = data.aws_vpc.default.id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "mlpos_db" {
  allocated_storage      = 20
  db_name                = "mlposdb"
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t3.micro"
  username               = "mlpos"
  password               = var.db_password
  parameter_group_name   = "default.postgres16"
  skip_final_snapshot    = true
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  tags = {
    Name        = "MLPOS Database"
    Environment = "main"
  }
}

#################################################################### COGNITO
#################################################################### COGNITO
#################################################################### COGNITO
#################################################################### COGNITO

# The user pool - where users live
resource "aws_cognito_user_pool" "user_pool" {
  name = "mlpos-user-pool"
  # Users sign in with email
  username_attributes = ["email"]
  # Auto-verify emails
  auto_verified_attributes = ["email"]

  # Basic password rules
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_uppercase = true
  }
}
# The app client - your frontend uses this to talk to Cognito
resource "aws_cognito_user_pool_client" "app_client" {
  name         = "mlpos-app-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  # How long tokens last
  access_token_validity  = 1  # 1 hour
  id_token_validity      = 1  # 1 hour  
  refresh_token_validity = 30 # 30 days
  # Allow password login
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
  # No secret needed for frontend apps
  generate_secret = false
}

##################################################################### OUTPUT
##################################################################### OUTPUT
##################################################################### OUTPUT
##################################################################### OUTPUT

output "cloudfront_url" {
    value = aws_cloudfront_distribution.main.domain_name
}

output "lambda_function_url" {
    value = aws_lambda_function_url.express_app.function_url
}

output "s3_bucket_name" {
    value = aws_s3_bucket.mlpos_static_bucket.id
}

output "cloudfront_distribution_id" {
    value = aws_cloudfront_distribution.main.id
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "cognito_app_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}