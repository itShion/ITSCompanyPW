FROM node:20-alpine

RUN npm install -g @angular/cli@17

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps
RUN npm install zone.js --legacy-peer-deps
COPY .. .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--proxy-config", "proxy.conf.json", "--poll", "2000"]
