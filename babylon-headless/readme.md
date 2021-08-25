


# Docker Notes
## Build base image with xvfb
docker build --no-cache -t headless-xvfb -f headless-xvfb/Dockerfile .

### Run dev with local source
docker run --rm -it --name headless-xvfb -v %cd%:/app headless-xvfb

docker logs <container id>


## Build headless container image
docker build --no-cache -t headless-container -f headless-container/Dockerfile .
docker build -t headless-container -f headless-container/Dockerfile .


### Run in windows cmd
docker run --rm -it --name headless-container -v %cd%/images:/app/images headless-container

### Run in powershell or linux
docker run --rm -it --name headless-container -v ${PWD}/images:/app/images headless-container


## Build headless lambda image
