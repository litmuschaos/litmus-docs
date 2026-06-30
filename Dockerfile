FROM node:14.15.0 AS build-env

WORKDIR /app/website

EXPOSE 3000 35729
COPY . /app/
RUN yarn install --frozen-lockfile
RUN yarn build
CMD ["yarn", "start"]

FROM nginx:1.13-alpine
COPY --from=build-env /app/website/build/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
