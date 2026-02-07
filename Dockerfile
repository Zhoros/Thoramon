FROM alpine:latest

RUN apk add --no-cache git nodejs npm

WORKDIR /app

COPY . /app

RUN npm install omit --save-dev

WORKDIR svelte

RUN npm install

RUN npm run build

WORKDIR /app

RUN npm run build

CMD ["npm", "run", "start"]
