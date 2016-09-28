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

RUN setup.sh

RUN echo "{ \"token\": \"$TSD_GITHUB_TOKEN\" }" >> /app/.tsdrct
RUN cd /app && ./node_modules/.bin/tsd rate

RUN install_typings.sh
RUN transpile.sh

RUN chmod -R 777 /app /usr/bin
RUN run.sh

#CMD ["run", "run"]

