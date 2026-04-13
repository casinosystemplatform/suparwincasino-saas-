FROM node:18

WORKDIR /engine

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
