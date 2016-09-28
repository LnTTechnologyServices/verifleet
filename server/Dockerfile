from ubuntu:16.04

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    nodejs \
    npm \
    postgresql && \ 
    mkdir -p /app

WORKDIR /app

RUN chmod -R 777 /app /usr/bin

EXPOSE 3000
ENV PORT 3000

RUN ln -s `which nodejs` /usr/bin/node

COPY package.json /app/package.json
RUN npm install

COPY . /app

RUN chmod -R 777 /app /usr/bin

CMD ["/app/bin/www"]
