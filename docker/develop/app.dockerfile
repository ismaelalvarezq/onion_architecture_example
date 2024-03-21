FROM node:16-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --silent

COPY .env ./
COPY . .

RUN npx prisma generate

EXPOSE ${PORT_APP}

CMD [ "node", "src/server.js" ]
