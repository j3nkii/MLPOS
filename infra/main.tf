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
    bucket = "mlpos-bucket"
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
    function_name = "express-app"
    role = aws_iam_role.lambda_exec.arn
    handler = "index.handler"
    runtime = "nodejs20.x"
    timeout = 30
    environment {
        variables = {
            NODE_ENV = "hello world"
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

##################################################################### OUTPUT
##################################################################### OUTPUT
##################################################################### OUTPUT
##################################################################### OUTPUT

resource "aws_cloudfront_origin_access_identity" "oai" {
    comment = "OAI for my website"
}

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
