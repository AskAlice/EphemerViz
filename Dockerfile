FROM node:16.19.0-alpine3.17
EXPOSE 5555

# Ideally the built image would be small and not require these dependencies, but
# I'm on a bit of a time crunch so this will do for now.
RUN apk update && apk add python3 make g++

RUN mkdir /app && chown -R node:node /app

COPY package.json /app/
COPY package-lock.json /app/

RUN mkdir /app/server/
COPY server/package.json /app/server/package.json

RUN ls /app

RUN cd /app && CI=true npm i --omit=dev --frozen-lockfile

USER node
WORKDIR /app/server

COPY --chown=node:node ./server /app/server

RUN npm run build

CMD [ "npm", "run" ,"start" ]
