FROM node:20-alpine3.20 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

COPY .env .env

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine3.20

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules


EXPOSE 8080

CMD ["npm", "run", "start"]