<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
        <a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
        <a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
        <a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
        <a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
        <a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
        <a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
        <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
        <a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
        <a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
          <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
          <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
        </p>
          <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
          [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[NestJS Framework](https://github.com/nestjs/nest) server project generated from official [JHipster NodeJS blueprint](https://github.com/jhipster/generator-jhipster-nodejs).

## Installation

```bash
$ npm install
```

## TypeORM configuration

### Define your prod database

As default your project will use an sqlite database (or a mongodb in memory).
For prod database configuration,
you don't have to do nothing if you use a docker-compose with a project database image.
To use other custom instance, in [src/orm.config.ts](src/orm.config.ts) change **database, host, port, username and password** according your values:

```ts
if(process.env.BACKEND_ENV==='prod'){
  ormconfig = {
      ...
      database: 'YOUR_DATABASE_NAME'
      host: 'localhost',
      port: 3307,
      username: 'sa',
      password: 'yourStrong(!)Password',
      logging: false,
  };
}

```

**To use it at runtime read the below section.**

### Migration data and schema

According [typeORM migration guide](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md),
there are under [src/migrations/](src/migrations/) the scripts to create the database schema and after to insert data seed.
The scripts are automatically run in the first start up, and after anymore.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build transpiling files in javascript
$ npm run build

# run javascript build from the source project
$ npm run start:prod

# run javascript build with node
$ node dist/main.js

# build bundle with webpack
$ npm run webpack:prod

# run bundle with node (not require node_modules folder)
$ node dist/bundle.js
```

### Using .env file and run in prod

The app uses a **BACKEND_ENV** variable with **dev** default value in the [.env](.env) file.
If you change the value to **prod**, you will use the **prod database at runtime** as defined in [src/orm.config.ts](src/orm.config.ts).
You can also define all the variables that you want in that file. See https://www.npmjs.com/package/dotenv for the usage.

> The standard values used from BACKEND_ENV are: dev, prod or test.
> You can define your custom value for BACKEND_ENV, but remember to add an application-{BACKEND_ENV}.yml file in your [config folder](src/config), and a database configuration for that environment value, according the [src/orm.config.ts](src/orm.config.ts).

If you don't want to set a value in the .env file, you can specify its in the runtime process.
For example:

```bash

# development in prod environment
# in linux
$ BACKEND_ENV=prod npm run start
# in windows
$ set BACKEND_ENV=prod&& npm run start

# run javascript build with node in prod environment
# in linux
$ BACKEND_ENV=prod node dist/main.js
# in windows
$ set BACKEND_ENV=prod&& node dist/main.js

# run bundle with node (not require node_modules folder)
$ node dist/bundle.js
```

> The webpack build bundle automatically is configured for prod env, and **can run without node_modules**.

## Lint

```bash
# run lint
$ npm run lint

# fix lint issues
$ npm run lint:fix

```

## Debug

```bash
# run this and after you can execute debug task in VSCode
$ npm run start:debug

```

## Test

```bash
# unit tests
$ npm run test

# lint
$ npm run lint

# fix lint issues
$ npm run lint:fix

# test coverage of unit tests
$ npm run test:cov

# e2e tests with full app coverage report
$ npm run test:e2e

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Community - [jhipster homepage](https://www.jhipster.tech)
- Stream Lead - [Angelo Manganiello](https://github.com/amanganiello90)
- Website And Guide - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
