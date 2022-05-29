FROM node:15-alpine as builder
WORKDIR /app
COPY ./futurity .
RUN npm i && npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY nginx.conf nginx.conf.template
COPY --from=builder /app/dist/futurity .

ENTRYPOINT ["/bin/sh" , "-c" , "envsubst '${API_GATEWAY}' < ./nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]