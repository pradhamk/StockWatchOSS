FROM node:18-alpine3.15
WORKDIR /bot
COPY . .
RUN rm -rf node_modules/ deploy.sh
RUN npm ci --only=production
CMD ["npm","start"]