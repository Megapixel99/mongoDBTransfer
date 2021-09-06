FROM node:14

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "index.js"]
