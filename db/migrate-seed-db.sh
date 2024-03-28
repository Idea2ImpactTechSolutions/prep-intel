#!/bin/sh

# Migrations
>&2 echo "Postgres is up - starting migrations..."
npx sequelize db:migrate

>&2 echo "Postgres is up - seeding..."
npx sequelize db:seed:all

#tail -f /dev/null