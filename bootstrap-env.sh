#!/bin/bash

echo "🔐 Fetching secrets from AWS SSM Parameter Store..."

# Export secrets from SSM (with decryption)
export PORT=$(aws ssm get-parameter --name "/myapp/PORT" --with-decryption --query "Parameter.Value" --output text)
export MONGO_URI=$(aws ssm get-parameter --name "/myapp/MONGO_URI" --with-decryption --query "Parameter.Value" --output text)
export JWT_SECRET=$(aws ssm get-parameter --name "/myapp/JWT_SECRET" --with-decryption --query "Parameter.Value" --output text)
export ACCESS_TOKEN_SECRET=$(aws ssm get-parameter --name "/myapp/ACCESS_TOKEN_SECRET" --with-decryption --query "Parameter.Value" --output text)
export REFRESH_TOKEN_SECRET=$(aws ssm get-parameter --name "/myapp/REFRESH_TOKEN_SECRET" --with-decryption --query "Parameter.Value" --output text)
export EMAIL_USERNAME=$(aws ssm get-parameter --name "/myapp/EMAIL_USERNAME" --with-decryption --query "Parameter.Value" --output text)
export EMAIL_PASSWORD=$(aws ssm get-parameter --name "/myapp/EMAIL_PASSWORD" --with-decryption --query "Parameter.Value" --output text)
export EMAIL_USER=$(aws ssm get-parameter --name "/myapp/EMAIL_USER" --with-decryption --query "Parameter.Value" --output text)
export EMAIL_PASS=$(aws ssm get-parameter --name "/myapp/EMAIL_PASS" --with-decryption --query "Parameter.Value" --output text)
export EMAIL_CLIENT_ID=$(aws ssm get-parameter --name "/myapp/EMAIL_CLIENT_ID" --with-decryption --query "Parameter.Value" --output text)
export EMAIL_CLIENT_SECRET=$(aws ssm get-parameter --name "/myapp/EMAIL_CLIENT_SECRET" --with-decryption --query "Parameter.Value" --output text)
export EMAIL_REFRESH_TOKEN=$(aws ssm get-parameter --name "/myapp/EMAIL_REFRESH_TOKEN" --with-decryption --query "Parameter.Value" --output text)
export REDIS_PASSWORD=$(aws ssm get-parameter --name "/myapp/REDIS_PASSWORD" --with-decryption --query "Parameter.Value" --output text)
export REDIS_USERNAME=$(aws ssm get-parameter --name "/myapp/REDIS_USERNAME" --with-decryption --query "Parameter.Value" --output text)
export REDIS_HOST=$(aws ssm get-parameter --name "/myapp/REDIS_HOST" --with-decryption --query "Parameter.Value" --output text)
export REDIS_PORT=$(aws ssm get-parameter --name "/myapp/REDIS_PORT" --with-decryption --query "Parameter.Value" --output text)

echo "✅ Secrets loaded. Starting app..."

# Run Docker Compose
docker-compose up --build -d
