FROM node:14.15.0 AS build-env

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./website /app/website
RUN npm install
RUN npm run build
CMD ["npm", "start"]

FROM nginx:1.13-alpine
COPY --from=build-env /app/website/build/litmus/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
