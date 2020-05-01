FROM ubuntu:16.04

# Install Node
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash \
    && apt-get install nodejs -yq

# Copy sources
COPY app app
WORKDIR app

# Install dependencies and make necessary dirs
RUN npm ci --only=production && mkdir data

EXPOSE 3000
ENTRYPOINT [ "node", "app.js"]
