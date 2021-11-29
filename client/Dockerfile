FROM node:12.4.0-alpine as build

WORKDIR /app


COPY . /app

ARG REACT_APP_API=http://localhost/api
ARG REACT_APP_URL=http://localhost


RUN npm install

RUN npm run build

FROM nginx:1.17.0-alpine

COPY --from=build /app/build /var/www

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]