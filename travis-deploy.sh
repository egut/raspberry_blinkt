#!/bin/bash
set -e

docker tag blinkt egut/blinkt:linux-$ARCH-$TRAVIS_TAG
docker push egut/blinkt:linux-$ARCH-$TRAVIS_TAG

if [ $ARCH == "amd64" ]; then
  set +e
  echo "Waiting for other images egut/blinkt:linux-arm-$TRAVIS_TAG"
  until docker run --rm stefanscherer/winspector egut/blinkt:linux-arm-$TRAVIS_TAG
  do
    sleep 15
    echo "Try again"
  done
  until docker run --rm stefanscherer/winspector egut/blinkt:linux-arm64-$TRAVIS_TAG
  do
    sleep 15
    echo "Try again"
  done
  set -e

  echo "Downloading manifest-tool"
  wget https://github.com/estesp/manifest-tool/releases/download/v0.4.0/manifest-tool-linux-amd64
  mv manifest-tool-linux-amd64 manifest-tool
  chmod +x manifest-tool
  ./manifest-tool

  echo "Pushing manifest egut/blinkt:$TRAVIS_TAG"
  ./manifest-tool push from-args \
    --platforms linux/amd64,linux/arm,linux/arm64 \
    --template egut/blinkt:OS-ARCH-$TRAVIS_TAG \
    --target egut/blinkt:$TRAVIS_TAG

  echo "Pushing manifest egut/blinkt:latest"
  ./manifest-tool push from-args \
    --platforms linux/amd64,linux/arm,linux/arm64 \
    --template egut/blinkt:OS-ARCH-$TRAVIS_TAG \
    --target egut/blinkt:latest
fi
