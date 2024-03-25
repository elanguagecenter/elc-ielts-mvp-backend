FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY dist/ ./src
COPY prisma/ ./prisma
COPY src/apiDocs/ ./src/apiDocs

RUN mkdir media
RUN mkdir media/output
RUN chmod a+rw -R media/output

RUN npm install --only=production
RUN npm install -g prisma
RUN prisma generate

EXPOSE 8000 8001

CMD ["node", "src/Index.js"]