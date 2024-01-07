# build environment
FROM node:21.5-alpine3.18 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
COPY webpack.config.js ./
COPY .babelrc ./

RUN npm --no-audit --no-fund ci

COPY . ./

RUN npm run build


# production environment
FROM nginx:1.25-alpine
RUN apk add --no-cache jq

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
ENV INDEX /usr/share/nginx/html/index.html

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
