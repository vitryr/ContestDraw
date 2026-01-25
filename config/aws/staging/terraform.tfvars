# Staging Environment Variables

environment = "staging"
aws_region  = "eu-west-1"

# VPC
vpc_cidr = "10.1.0.0/16"

# RDS
db_instance_class    = "db.t3.small"
db_allocated_storage = 50

# Alert Email
alert_email = "staging-alerts@contestdraw.com"

# Geo Blocking (minimal for staging)
blocked_countries = []
