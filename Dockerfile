FROM node:8.11.4 AS build-env

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./docs /app/docs
COPY ./website /app/website
RUN yarn install
RUN yarn build
CMD ["yarn", "start"]

FROM nginx:1.13-alpine
COPY --from=build-env /app/website/build/litmus/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
