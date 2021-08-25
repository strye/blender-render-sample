# FROM amazon/aws-lambda-nodejs:14
FROM node:14

# update and add all the steps for running with xvfb
RUN apt-get update && apt-get install -y curl x11vnc xvfb chromium wget
# x11vnc x11-xkb-utils x11-apps

# ADD headless-xvfb/xvfb-chromium /usr/bin/xvfb-chromium
# RUN ln -s /usr/bin/xvfb-chromium /usr/bin/google-chrome
# RUN ln -s /usr/bin/xvfb-chromium /usr/bin/chromium-browser

# Set the Chrome repo.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list# Install Chrome.
RUN apt-get update && apt-get -y install google-chrome-stable







WORKDIR /app

CMD npm start