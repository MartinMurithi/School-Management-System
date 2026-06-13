#!/bin/bash

docker run --rm -it \
  --network compose_school-system-net \
  -v $(pwd)/database/migrations:/migrations \
  migrate/migrate \
  -path=/migrations \
  -database "postgres://postgres:martin321!@school-system-db:5432/school_system?sslmode=disable" \
  up