
# Setup Node
FROM node:18-alpine as build

# Dependency and Build
WORKDIR /app
COPY package*.json ./
RUN npm install


COPY . .

# Create JS Build
# Run num run Build

EXPOSE 3000

CMD [ "node" ,"index.js" ]
