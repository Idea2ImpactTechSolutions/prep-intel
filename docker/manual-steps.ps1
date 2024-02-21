; Clean postgres db
docker run --name postgres-local -e POSTGRES_USER=jl-user -e POSTGRES_PASSWORD=jl-pass -e POSTGRES_DB=preppintel -p 5432:5432 -d postgres

; Extract models
npx sequelize-auto -o "./models" -d preppintel -h localhost -u jl-user -p 5432 -x jl-pass -e postgresstart models2

; Generate migrations
npx sequelize-mig migration:make --modp models

; Docker container for npm/sequelize-mig debugging
docker run -it --rm -v %cd%:/app -w /app node:alpine sh

#npx sequelize-cli migration:generate --name migration-example
; Run migrations to generate db
npx sequelize db:migrate

docker stop postgres-local

docker rm postgres-local
