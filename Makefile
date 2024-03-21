app\:run:
	docker-compose -f docker/local/docker-compose.yml --project-name config --project-directory . --env-file ./.env up -d --build

app\:logs:
	docker-compose -f docker/local/docker-compose.yml --project-name config --project-directory . --env-file ./.env logs -f configuration-api

app\:sh:
	docker-compose -f docker/local/docker-compose.yml --project-name config --project-directory . --env-file ./.env exec configuration-api sh

