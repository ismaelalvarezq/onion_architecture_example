FROM node:16-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --silent
RUN npm install -g nodemon --silent

COPY .env ./
COPY . .

RUN npx prisma generate

EXPOSE ${PORT_APP}

CMD [ "nodemon", "src/server.js" ]
