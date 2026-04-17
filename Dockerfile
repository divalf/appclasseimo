FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 3000

 volume /app/db
