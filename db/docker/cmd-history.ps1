# Clean postgres db - alternatively, `docker-compose up` from project root
docker run --name postgres-local -e POSTGRES_USER=jl-user -e POSTGRES_PASSWORD=jl-pass -e POSTGRES_DB=preppintel -p 5432:5432 -d postgres

# Extract existing models
npx sequelize-auto -o "./models" -d preppintel -h localhost -u jl-user -p 5432 -x jl-pass -e postgresstart models2

# Generate migration from extracted models
npx sequelize-mig migration:make --modp models

# Run migrations to generate db
npx sequelize db:migrate

# Shutodwn and remove running docker-compose containers
docker-compose down

# Remove volume (critical for db auth issues when postgres backend credentials change)
docker volume rm recruitment-portal_postgres-data
docker volume rm prep-intel_postgres-data
docker volume rm db_postgres-data

#Single line
docker-compose down; docker volume rm prep-intel_postgres-data

# Build local docker image and push to private ECR (jlewin)
docker build -t dev_prep_intel .
docker tag dev_prep_intel:latest 381492089569.dkr.ecr.us-east-1.amazonaws.com/dev_prep_intel:latest
docker push 381492089569.dkr.ecr.us-east-1.amazonaws.com/dev_prep_intel:latest

# Auth aws with given creds
aws configure

# Auth docker for ECR push
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 381492089569.dkr.ecr.us-east-1.amazonaws.com

# **** Misc ****
#
# Docker container for npm/sequelize-mig debugging
docker run -it --rm -v %cd%:/app -w /app node:alpine sh

# Manually generate migration from template, for new db mutation
npx sequelize-cli migration:generate --name migration-example

#switch to env for local dev
mklink .env .env.localdb

# Infer models from latest db
npx sequelize-auto -o "./models" --caseModel p --caseFile p --useDefine -c .\config\config-prod.js --noIndexes

# Generate migrations from these models
npx sequelize-mig migration:make --modp models
