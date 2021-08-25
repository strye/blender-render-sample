# FROM amazon/aws-lambda-nodejs:14
#FROM headless-xvfb
FROM node:14-slim


# update and add all the steps for running with xvfb
# RUN apt-get update && apt-get install -y curl x11vnc xvfb chromium wget

RUN apt-get update \
    && apt-get install -y wget gnupg x11vnc xvfb \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install puppeteer so it's available in the container.
RUN npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules



# Cd into /app
WORKDIR /app

# Copy package.json into app folder
COPY package.json /app
COPY package-lock.json /app

# Install dependencies
RUN npm install

RUN chown -R pptruser:pptruser /app

# Finally copy the build application
COPY puppeteer-runner.js /app
COPY server.js /app

COPY dist /app/dist

# Start server on port 3000∂
# EXPOSE 3000:3001
# ENV PORT=3001

# Run everything after as non-privileged user.
USER pptruser

# Start script 
CMD npm start
# CMD Xvfb :99 -screen 0 1024x768x16 & npm start
# CMD npm start
