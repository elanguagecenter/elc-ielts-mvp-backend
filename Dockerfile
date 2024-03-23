FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY dist/ ./src
COPY prisma/ ./prisma
COPY src/apiDocs/ ./src/apiDocs

RUN npm install --only=production
RUN npm install -g prisma
RUN prisma generate

EXPOSE 8000

CMD ["node", "src/Index.js"]