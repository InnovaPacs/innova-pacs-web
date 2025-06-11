FROM node:18 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build -- --output-path=./dist/out/browser --base-href=/innova-pacs/ --configuration=dev


FROM nginx:alpine
COPY --from=build-stage /app/dist/out/browser /usr/share/nginx/html/innova-pacs
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
