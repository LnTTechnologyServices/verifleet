FROM ubuntu:16.04

RUN apt-get update && apt-get install --no-install-recommends -y \
    nodejs \
    git \
    npm \
    bzip2

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm install -g gulp phantomjs2 nodemon

#RUN pip install exosite

RUN mkdir -p /app/web /app/cards

COPY ./web/package.json /app/web
COPY ./cards/package.json /app/cards
RUN cd /app/web && npm install
RUN cd /app/cards && npm install
RUN cd /app/web && npm link /app/cards
RUN cd /app/web && npm install babel-register babel-preset-es2015

#RUN chmod +x /app/web/client/app/app.js
# Run app using nodemon
CMD ["/app/web","gulp", "watch"]
#RUN chmod +x /app/deploy.sh
#RUN cd /app && /app/deploy.sh
#RUN cd /app/web && gulp watch
