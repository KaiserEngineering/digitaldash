FROM python:3.7.7-stretch

WORKDIR /app
ADD . /app

RUN /bin/bash -c 'apt-get update -qy && apt-get upgrade -y'
RUN /bin/bash -c 'apt-get install -y curl xvfb xsel libmtdev1 build-essential ffmpeg libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev libportmidi-dev libswscale-dev libavformat-dev libavcodec-dev zlib1g-dev'

CMD ["python3"]
