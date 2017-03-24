# employee-microservice-node

[![CircleCI](https://circleci.com/gh/omerio/employee-microservice-node.svg?style=svg)](https://circleci.com/gh/omerio/employee-microservice-node) [![codecov](https://codecov.io/gh/omerio/employee-microservice-node/branch/master/graph/badge.svg)](https://codecov.io/gh/omerio/employee-microservice-node)

Example Node.js CRUD microservice for an Employee entity with unit tests, mocking, code style checking and good test coverage. The microservice exposes REST APIs which are documented using [Swagger](http://swagger.io/).

## Getting Started

Checkout and run the code
```bash
git clone https://github.com/omerio/employee-microservice-node.git
cd employee-microservice-node
npm install
npm start
```

Once the server is started you can access the following URLs:
* Server: http://localhost:8000/
* Swagger documentation: http://localhost:8000/docs

## Libraries

The following libraries are used in this project:

- **Web Server Framework**: [hapi](https://hapijs.com/) with [swagger](https://github.com/glennjones/hapi-swagger) and [good](https://github.com/hapijs/good) plugins. [Boom](https://github.com/hapijs/boom) for HTTP errors. [Request](https://github.com/request/request) for making HTTP requests
- **Logging**: [winston](https://github.com/winstonjs/winston)
- **Testing**: [mocha](https://mochajs.org/) with [chai](http://chaijs.com/) for BDD and [sinon](http://sinonjs.org/) for mocking
- **Code Coverage**: [nyc](https://github.com/istanbuljs/nyc)
- **Code Style**: [eslint](http://eslint.org/)


## Unit Tests and Coverage

To run the unit tests
```bash
npm test
```

To generate the code coverage reports:
```bash
npm run coverage
```

## CI-CD
This repository uses [CircleCI](https://circleci.com/gh/omerio/employee-microservice-node) for continuous integration and deployment, code coverage results are uploaded to [CodeCov](https://codecov.io/gh/omerio/employee-microservice-node).

## Docker
To build a docker image:
```bash
docker build -t omerio/employee-microservice-node .
```

To run the docker image:
```bash
docker run -p 8000:8000 omerio/employee-microservice-node
```

Publish the image to [Docker Hub](https://hub.docker.com/):
```bash
docker login
docker push omerio/employee-microservice-node
```

## TODO
- Continuous deployment using CircleCI
- Add authentication
- Add JSDocs support
