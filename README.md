# \*NixConnect

\*NixConnect is the name of the project for my bachelor thesis. This application
serves to be a customizable social network geared towards UNIX enthusiasts
with inclusiveness at its core.

## Prerequisites

This project, its code and any of its forks are subject to [Privacy Policy](https://gitea.com/benko11/nixbook-official/src/branch/main/privacy-policy.md) and [Code of Conduct](https://gitea.com/benko11/nixbook-official/src/branch/main/CODE_OF_CONDUCT.md).

In order to be able to build the build and run the application you will need some packages installed on your system, namely:

-   PHP 8.0 or greater
-   MySQL
-   NodeJS and NPM

Latest versions of respective packages are recommended to be installed.

## Installation

```
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Set up the database connection in the `.env` file, and you should be good to go.

To run the project, run the following commands (both are necessary):

```

php artisan serve
npm run dev

```
