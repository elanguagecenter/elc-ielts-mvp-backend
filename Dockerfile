FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY dist/ .
COPY prisma/ ./prisma

RUN npm install --only=production
RUN npm install -g prisma
RUN prisma generate

EXPOSE 8000

CMD ["node", "Index.js"]