FROM node:18 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build --base-href=/med-iq/ --configuration=dev

FROM nginx:alpine
COPY --from=build-stage /app/dist/med-iq/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf