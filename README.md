<h1 align="center">Supanotes</h1>

<br>

> A simple note creating and sharing API

## Getting Started

Before you begin, make sure you have either [Git](https://git-scm.com/), [Docker](https://www.docker.com/), and [Docker Compose](https://docs.docker.com/compose/) or [Node.js](https://nodejs.org/) and [Postgres 15](https://www.postgresql.org/) installed on your system.

## Current deployment

This app is currently running at https://supanotes.denisonweb.com. API documentation can be found at https://supanotes.denisonweb.com/docs/.

### Installation with Docker Compose

1. Clone the repository:  
  ```git clone https://github.com/jordandenison/supanotes.git```

2. Navigate to the project directory:  
   ```cd supanotes```

3. Start the app with Docker Compose:  
   ```docker compose up```

### Installation without Docker

1. Clone the repository:  
  ```git clone https://github.com/jordandenison/supanotes.git```

2. Navigate to the api directory:  
   ```cd supanotes/api```

3. Install dependencies:  
   ```npm i```

4. Set the following environment variables:  
   ```DATABASE_URL```
   ```FEATHERS_SECRET```
   ```HOSTNAME (optional)```
   ```PORT (optional)```

5. Start the app:  
   ```npm run dev```

### Installating the typed front-end client to be used with React/Vue/Angular etc

1. Install with npm:  
  ```npm install https://supanotes.denisonweb.com/supanotes-1.1.1.tgz```

2. Example usage  
   ```visit https://feathersjs.com/api/client.html```

## Running Tests

1. To run the tests, run the following command while the app is running in docker:  
   ```docker exec -t supanotes-api-1 npm test```

## Running Tests without Docker

1. To run the tests, run the following command while the app is running:  
   ```npm test```

## Contact

Jordan Denison - [@canadianwifi](https://twitter.com/canadianwifi) - jordan@denisonweb.com

Project Link: [https://github.com/jordandenison/supanotes](https://github.com/jordandenison/supanotes)
