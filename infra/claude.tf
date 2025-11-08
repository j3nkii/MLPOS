# S3 bucket for static content
# resource "aws_s3_bucket" "static_content" {
#   bucket = "your-static-content-bucket-name"
# }

# resource "aws_s3_bucket_public_access_block" "static_content" {
#   bucket = aws_s3_bucket.static_content.id

#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
# }


# S3 bucket policy to allow CloudFront access
# resource "aws_s3_bucket_policy" "static_content" {
#   bucket = aws_s3_bucket.static_content.id

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid    = "AllowCloudFrontServicePrincipal"
#         Effect = "Allow"
#         Principal = {
#           Service = "cloudfront.amazonaws.com"
#         }
#         Action   = "s3:GetObject"
#         Resource = "${aws_s3_bucket.static_content.arn}/*"
#         Condition = {
#           StringEquals = {
#             "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
#           }
#         }
#       }
#     ]
#   })
# }

# # Lambda function for Express app
# resource "aws_lambda_function" "express_app" {
#   filename      = "lambda.zip"  # Your deployment package
#   function_name = "express-app"
#   role          = aws_iam_role.lambda_exec.arn
#   handler       = "index.handler"
#   runtime       = "nodejs20.x"
#   timeout       = 30

#   environment {
#     variables = {
#       NODE_ENV = "production"
#     }
#   }
# }

# # Lambda Function URL
# resource "aws_lambda_function_url" "express_app" {
#   function_name      = aws_lambda_function.express_app.function_name
#   authorization_type = "NONE"
# }

# # IAM role for Lambda
# resource "aws_iam_role" "lambda_exec" {
#   name = "lambda-exec-role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
# #     Statement = [
# #       {
# #         Action = "sts:AssumeRole"
# #         Effect = "Allow"
# #         Principal = {
# #           Service = "lambda.amazonaws.com"
# #         }
# #       }
# #     ]
# #   })
# # }

# # resource "aws_iam_role_policy_attachment" "lambda_basic" {
# #   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# #   role       = aws_iam_role.lambda_exec.name
# # }











# # CloudFront Distribution
# resource "aws_cloudfront_distribution" "main" {
#   enabled             = true
#   default_root_object = "index.html"
#   price_class         = "PriceClass_100"

#   # S3 origin for static content
#   origin {
#     domain_name              = aws_s3_bucket.static_content.bucket_regional_domain_name
#     origin_id                = "S3-static-content"
#     origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
#   }

#   # Lambda Function URL origin for API
#   origin {
#     domain_name = replace(aws_lambda_function_url.express_app.function_url, "https://", "")
#     origin_id   = "Lambda-express-app"

#     custom_origin_config {
#       http_port              = 80
#       https_port             = 443
#       origin_protocol_policy = "https-only"
#       origin_ssl_protocols   = ["TLSv1.2"]
#     }
#   }

#   # Default behavior - serve from S3
#   default_cache_behavior {
#     target_origin_id       = "S3-static-content"
#     viewer_protocol_policy = "redirect-to-https"
#     allowed_methods        = ["GET", "HEAD", "OPTIONS"]
#     cached_methods         = ["GET", "HEAD"]

#     forwarded_values {
#       query_string = false
#       cookies {
#         forward = "none"
#       }
#     }

#     min_ttl     = 0
#     default_ttl = 3600
#     max_ttl     = 86400
#   }

#   # API behavior - route to Lambda
#   ordered_cache_behavior {
#     path_pattern           = "/api/*"
#     target_origin_id       = "Lambda-express-app"
#     viewer_protocol_policy = "redirect-to-https"
#     allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
#     cached_methods         = ["GET", "HEAD"]

#     forwarded_values {
#       query_string = true
#       headers      = ["Accept", "Content-Type", "Authorization"]
#       cookies {
#         forward = "all"
#       }
#     }

#     min_ttl     = 0
#     default_ttl = 0
#     max_ttl     = 0
#   }

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   viewer_certificate {
#     cloudfront_default_certificate = true
#   }
# }










# # CloudFront Origin Access Control for S3
# resource "aws_cloudfront_origin_access_control" "s3_oac" {
#   name                              = "s3-oac"
#   origin_access_control_origin_type = "s3"
#   signing_behavior                  = "always"
#   signing_protocol                  = "sigv4"
# }




# # Output the CloudFront domain
# output "cloudfront_domain" {
#   value = aws_cloudfront_distribution.main.domain_name
# }

# output "lambda_function_url" {
#   value = aws_lambda_function_url.express_app.function_url
# }