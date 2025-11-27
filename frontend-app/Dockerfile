FROM node:24.11.0

WORKDIR /usr/src/frontend-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start:prod"]