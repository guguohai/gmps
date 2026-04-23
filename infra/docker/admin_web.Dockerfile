FROM node:20-alpine

WORKDIR /app

COPY apps/admin_web/package*.json /app/
RUN npm ci

COPY apps/admin_web/ /app/

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
