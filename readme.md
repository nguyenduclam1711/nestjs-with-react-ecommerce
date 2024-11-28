# Nestjs with react ecommerce

<!--toc:start-->
- [Nestjs with react ecommerce](#nestjs-with-react-ecommerce)
  - [Prequesites](#prequesites)
  - [How to run the project in dev environment](#how-to-run-the-project-in-dev-environment)
<!--toc:end-->

## Prequesites

- Docker
- Nodejs v22

## How to run the project in dev environment

Need to run this command in the root folder to give the shell script the permission to execute

```bash
chmod +x ./run-dev.sh ./run-dev-frontend.sh ./run-dev-backend.sh ./run-dev-docker.sh
```

And use this command in the root folder to build docker container and run it

```bash
./run-docker-dev.sh
```

If using mac arm, pls use this command to run because there is a bug that cause bcrypt library cannot run on alpine image

```bash
./run-dev.sh
```
