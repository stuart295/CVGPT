# Dockerfile
FROM node:18 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve the Angular app using Nginx
FROM nginx:1.21.3-alpine as production-stage

COPY --from=build-stage /app/dist/frontend/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
