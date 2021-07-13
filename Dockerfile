# author: antonino bertulla <abertulla@gmail.com>

# ################
# Builder stage. #
# ################
# It will build: dev-dependencies, rust binary, Ts deps and Js
FROM node:16-alpine AS builder

WORKDIR /usr/src/app

# Add dependecies for rust, neon and node-gyp
RUN apk add --no-cache g++ make python3 curl bash

# Get Rust
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y --profile minimal
ENV PATH="/root/.cargo/bin:${PATH}"
# install neon
RUN npm install --global neon-cli

# USER node
# TODO: consider --chown=node:node
COPY ./pkg ./pkg
# compile for musl arch, see: https://github.com/rust-lang/cargo/issues/7154
WORKDIR /usr/src/app/pkg/zalgo-captcha
ENV RUSTFLAGS="-C target-feature=-crt-static"
# RUN npm config set unsafe-perm true
# RUN npm -g config set user root
# RUN npm install && neon build --release

RUN npm install && npm run build -- --release

# Copy App files
WORKDIR /usr/src/app
# TODO: consider --chown=node:node
COPY package*.json jest.config.js tsconfig.json ./
COPY ./src ./src
COPY ./types ./types
COPY ./tests ./tests

# Install all dependecies, perform tests and generate Js files
RUN npm cit --quiet && npm run build

# ################# #
# Production stage. #
# ################# #
# It will take Js and native files from "builder" stage, and also install the production packages only
FROM node:16-alpine

# Fix for Error: Error loading shared library ld-linux-x86-64.so.2: No such file or directory (needed by /app/pkg/zalgo-captcha/native/index.node)
RUN apk add --no-cache libc6-compat dumb-init
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

WORKDIR /app
ENV NODE_ENV=production

# TODO: consider --chown=node:node
COPY package*.json ./

# TODO: Pick only the bare minimum from native package
# COPY --chown=node:node --from=builder /usr/src/app/pkg/zalgo-captcha/native/index.node ./pkg/zalgo-captcha/native/index.node
# COPY --chown=node:node --from=builder /usr/src/app/pkg/zalgo-captcha/package.json ./pkg/zalgo-captcha/package.json
# COPY --chown=node:node --from=builder /usr/src/app/pkg/zalgo-captcha/lib ./pkg/zalgo-captcha/lib
COPY --from=builder /usr/src/app/pkg/zalgo-captcha ./pkg/zalgo-captcha

# install dependencies and copy Js files
RUN npm ci --quiet --only=production
# TODO: consider --chown=node:node
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

USER node

CMD ["dumb-init", "node", "./dist/server.js"]
