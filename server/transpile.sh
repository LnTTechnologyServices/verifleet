#!/bin/bash
./node_modules/.bin/tsc --sourcemap --module commonjs ./bin/www.ts ./definitions/model_*.ts
