FROM node:alpine

# make a directory for the application, otherwise files will be copied to the root folder
RUN mkdir -p /var/opt/employee-microservice-node
WORKDIR /var/opt/employee-microservice-node

COPY package.json package.json
RUN npm install --production --quiet

# Add source files
COPY . .

ENV PORT 8000
EXPOSE 8000

# Silent start because we want to have our log format as the first log
CMD ["npm", "start", "-s"]
