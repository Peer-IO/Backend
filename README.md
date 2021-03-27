# NodeJS API for [P2P](https://github.com/king-11/P2P)

## Getting started

This is a REST API written using blazing fast implementation of Chrome's V8 Engine i.e. Nodejs. The API follows MVC i.e. Model View Controller Architecture where models are developed using mongoose Schema. The Login is controlled using a Firebase which allows easy user management and social authentication. The Resources are accessed using the very secure JWT Tokens. The code is complied using babel and in development it's run using nodemon. Database being used is MongoDB which can be connected to Mongo Atlas.

## Features

- Multiple environment ready (development, production)
- Compressed responses.
- Secured HTTP headers.
- CORS ready.
- HTTP request logger in development mode.
- Login access with Firebase
- API collection example for Postman.
- JWT Tokens, make requests with a token after login with `Authorization` header with value `Bearer yourToken` where `yourToken` is the **signed and encrypted token** given in the response from the login process.

## Requirements

- Node.js **12+**
- MongoDB **4.4+**
- Firebase APP

## Deployment

API is located at: <https://arcane-mountain-95630.herokuapp.com/>

Depolyment is also linked to a VueJS project that shows how this API can be integrated to a frontend that is able to consume an API.  
Repo is here: <https://github.com/king-11/P2P>

## How to install

### Using Git (recommended)

1. Clone the project from github. Change "myproject" to your project name.

```bash
git clone https://github.com/king-11/P2P_Backend.git ./myproject
```

### Using manual download ZIP

1. Download repository
2. Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd myproject
yarn
```

### Encrypting Your Keys

```zsh
node src/secure/encrypt.js <fileName> <password>
```

File Path should be relative to root directory
Specify the fileName env variable for dev and production in src/config

### Setting up environments (development or production)

1. In the root this repository you will find a file named `env.json`
2. Change those variables for development in src/config/dev.
3. Change the values of the file to your environment (development or production)
4. Upload the enviornment variables to your environment server(development or production)
5. If you use the postman collection to try the endpoints, change value of the variable `PORT` on your environment to the port of your server, for development mode use <http://localhost:3000>

**IMPORTANT:** By default token expires in 2 days.

## How to run

### Running in development mode (lifting API server)

```bash
yarn run dev
```

You will know server is running by checking the output of the command `npm run dev`

```bash
****************************
*    NODE_ENV: development
*    Starting Server
*    Port: 3000
*    Database: MongoDB
*    DB Connection: OK
****************************
```

### Running in Prodcution mode

```bash
yarn start
```

- This will create a dist file using babel which will transpile your code.

- Decrypt your firebase.aes.json file to firebase.json

- Spin your server

You can also check other scripts that can be used in development enviornment or to restart your server.

## Usage

Once everything is set up to test API routes either use Postman or any other api testing application.

### Creating new models

If you need to add more models to the project create a new file in `/src/models/`.

### Creating new routes

If you need to add more routes to the project create a new file in `/src/routes/`.

### Creating new controllers

If you need to add more controllers to the project create a new file in `/src/controllers/`.

## Bugs or improvements

Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the Mozilla License. See the LICENSE file for more information.
