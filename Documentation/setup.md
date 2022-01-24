# setup

- [setup](#setup)
  - [node](#node)
  - [Prisma](#prisma)
  - [Docker](#docker)
    - [Postgres db](#postgres-db)
    - [Project Dockerfile](#project-dockerfile)
  - [Express & EJS](#express--ejs)
  - [VS Code](#vs-code)

## node

1. ``npm init -y``
2. ``npm install express ts-node ejs``
3. ``npm i typescript ts-node-dev --save-dev``
4. ``npm i @types/node @types/express @types/http-errors @types/ejs``
5. ``npm install prisma --save-dev``
6. ``npm i @prisma/client``
7. add all the scripts to package
8. add tsconfig.json
9.  Done :)

## Prisma

Install: https://marketplace.visualstudio.com/items?itemName=Prisma.prisma

1. Crate Prisma schema
2. Crate seed.ts for sample data

## Docker

### Postgres db

Create simple docker-compose with ``postgres:latest`` img

### Project Dockerfile

Create Dockerfile like https://github.com/RoeHH/poc-eta-liquibase-link-of-the-day/blob/master/Dockerfile

## Express & EJS

1. add ``Public`` Folder for imgs 
2. add ``Views`` Folder for ejs Files
3. add ``Routes`` Folder for express routers
4. create ``error.ejs`` File in ``Views``
5. create ``index.ts`` File in ``Views``

## VS Code

Plugins:
* Docker: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker
* Icon Theme: https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme