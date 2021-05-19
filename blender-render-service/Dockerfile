FROM nytimes/blender:latest
USER root
WORKDIR /home/app
COPY . .
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
CMD ["node", "server.js"]
