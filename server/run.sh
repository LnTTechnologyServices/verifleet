#!/bin/bash
# have nodemon only watch changes to *.ts files and then transpile ts
PORT=3002 nodemon --exec "./transpile.sh && ./bin/www" --ignore ./web -e ts
