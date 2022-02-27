FROM node:12-alpine as build

WORKDIR /usr/share/api

COPY dist package.json ./

RUN npm install --production

FROM node:12-alpine

WORKDIR /usr/share/api

COPY --from=build /usr/share/api .

EXPOSE 8000

CMD ["node", "main.js"]
