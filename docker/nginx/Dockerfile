FROM nginx:1.27-alpine
COPY ./docker/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/share/nginx/html && mkdir -p /etc/nginx/certs
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]