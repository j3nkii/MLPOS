variable "region" {
    description = "AWS region"
    type        = string
    default     = "us-east-2"
}

variable "environment" {
    description = "production"
    type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}