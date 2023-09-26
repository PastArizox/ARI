FROM alpine:latest

# Install packages
RUN apk update && \
    apk add git && \
    apk add nodejs && \
    apk add npm

# Copy repo
COPY ./ARI /ARI

WORKDIR /ARI

# Clean
RUN rm -rf .git

# Install node modules
RUN npm i

# Copy the secrets in the right folder
ARG secrets_path
COPY $secrets_path /ARI/src/secrets.json

# Deploy commands (optional)
# RUN npm run clear
# RUN npm run deploy

# Run the project
CMD ["npm", "start"]