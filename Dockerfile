FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN apk add --no-cache make gcc g++ python3 && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python3
EXPOSE 5000
CMD ["npm", "start"]