FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]

# For testing app in backend folder ./backend

# build
# docker build . -t node-backend-iptc-app

# run
# docker run -p 8082:8080 -d node-backend-iptc-app
