#! /bin/bash

docker exec -it supanotes-api-1 npm run bundle:client && heroku container:push web -a supanotes && heroku container:release web -a supanotes