#! /bin/bash

docker exec -it -e PGPASSWORD=supanotes supanotes-postgres-1 psql -U supanotes
