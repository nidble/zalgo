# Zalgo

Zalgo is a RESTful app capable to generate and validate Captcha Images embracing twelve factors and cutting edge performances

- Full stricted Typescript code
- Ultra fast image (captcha) generation thanks to Rust native code
- Fine granular configuration of Eslint, Prettier and Tsc
- ✨ 100% coverage ✨

## Features

- Provide two distincted API for captcha generation and validation
- Client submission are constrained in time and number
- Api doc yaml following 3.0 spec
- A full-fledged Dockerfile take care of any aspect of building and shipping

The entire lifecycle of request-response is handled by the Nodejs app. Image generation (CPU-bounded sync task) is executed by calling Rust native code and Node Napi interface thanks to [Neon](https://neon-bindings.com/) project.

> A new captcha image is issued when
> invoking a PUT request. This request
> return a Json that consists of an
> unique `id` and a `base64` string image field
> constrained by an `Expire` header.
> Following requests to Captcha validation are
> now performed by calling a POST api with a previous
> unique `id` and a `solution` text-based field that solves the
> previous base64 string image.

## Tech

Zalgo uses a number of open source projects to work properly:

- [PolkaJS] - A micro web server so fast, it'll make you dance! 👯
- [Nanoid] - A tiny, secure, URL-friendly, unique string ID generator for JavaScript.
- [Node.js] - evented I/O for the backend
- [Rust] - A language empowering everyone to build reliable and efficient software
- [Neon] - Electrify your Node with the power of Rust!
- [Pino] - 🌲 super fast, all natural json logger 🌲

And of course Zalgo Captcha itself is open source with a [public repository][zalgo]
 on GitHub.

## Installation

Zalgo requires [Node.js](https://nodejs.org/) v12+ to run and [Rust](https://www.rust-lang.org/) to compile captcha package.

Install the Nodejs runtime and Rust language following respective documentations. Then to start Rust code compilation, 
install [Neon Cli](https://neon-bindings.com/docs/getting-started#install-the-neon-cli):

```sh
npm install --global neon-cli
# OR
yarn global add neon-cli
```

Now compile Rust code with Nodejs bindings:

```sh
cd zalgo-captcha/pkg/zalgo-captcha
npm run compile
```

Install dependencies and start the server.

```sh
cd zalgo-captcha
npm i
LOG_LEVEL=info node run start
```

For production environments (ie: without logging):

```sh
npm install --production
NODE_ENV=production node app
```

## Enviromental variables

What follows is a table of principal variables and some examples

| Env Name | Example |
| ------ | ------ |
| NODE_ENV | `production` |
| LOG_LEVEL | `info`, `warn`, `error` or `debug`, default `silent` |
| PORT | default `3000` |
| CAPTCHA_TTL | default `120` secs |
| CAPTCHA_ATTEMPTS | default `5` secs |


## Testing

Once dependencies were installed, execute

```sh
npm run test

```

For coverage:

```sh
npm run test:coverage

```

## Docker

Zalgo is very easy to install and deploy in a Docker container.

By default, the Docker container will expose port 3000, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd zalgo-captcha
docker build -t <youruser>/zalgo:${package.json.version} .
```

This will create the zalgo image and pull in the necessary dependencies.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 3000 of the host to
port 3000 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 3000:3000 --restart=always --name=zalgo <youruser>/zalgo:${package.json.version}
```

## Curl Examples

Verify the server execution by issuing the following command.
```sh
 curl -H "Content-Type: application/json" http://localhost:3000/healthcheck
```

Then ask for a new captcha with
```sh
curl -H "Content-Type: application/json" -X PUT http://localhost:3000/v1/captcha
```

Submit a solution through:
```sh

 curl -H "Content-Type: application/json" -vX POST http://localhost:3000/v1/captcha/PupuNxYWZOYrw8ftnoCBu -d '{"solution":"xyz"}'

```
> Note: default captcha liveness is about `2` minutes. After that a new captcha must be generated.

## FE Example

Among this repository is available an example of integration. You can run this example
from browser tab after spawned a static server, ie:

```sh
cd example
npx static-server

```

## License

**MIT**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [zalgo]: <https://github.com/nidble/zalgo>
   [PolkaJs]: <https://github.com/lukeed/polka>
   [Nanoid]: <https://www.npmjs.com/package/nanoid>
   [Rust]: <https://www.rust-lang.org/>
   [node.js]: <http://nodejs.org>
   [Neon]: <https://neon-bindings.com/>
   [Pino]: <https://github.com/pinojs/pino/issues>
