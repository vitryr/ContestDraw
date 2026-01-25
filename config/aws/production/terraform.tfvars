# Production Environment Variables

environment = "production"
aws_region  = "eu-west-1"

# VPC
vpc_cidr = "10.2.0.0/16"

# RDS
db_instance_class    = "db.r6g.large"
db_allocated_storage = 200

# Alert Email
alert_email = "alerts@contestdraw.com"

# Geo Blocking (if needed)
blocked_countries = []
