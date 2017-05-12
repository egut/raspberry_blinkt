#!/bin/bash
set -e

docker tag blinkt egut/blinkt:lastest
docker push egut/blinkt:lastest

