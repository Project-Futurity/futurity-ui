FROM node:15-alpine as builder
WORKDIR /app
COPY ./futurity .
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm i && npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY nginx.conf nginx.conf.template
COPY --from=builder /app/dist/futurity .

ENTRYPOINT ["/bin/sh" , "-c" , "envsubst '${API_GATEWAY}' '${TELEGRAM_BOT_URL}' < ./nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]