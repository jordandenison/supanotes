<h1 align="center">Supanotes</h1>

<br>

> A simple note creating and sharing API

## Getting Started

Before you begin, make sure you have [Git](https://git-scm.com/), [Docker](https://www.docker.com/), and [Docker Compose](https://docs.docker.com/compose/) installed on your system.

## Current deployment

This app is currently running at https://supanotes.denisonweb.com.

### Installation

1. Clone the repository:  
  ```git clone https://github.com/jordandenison/supanotes.git```

2. Navigate to the project directory:  
   ```cd supanotes```

3. Start the app with Docker Compose:  
   ```docker compose up```

### Installating the typed front-end client to be used with React/Vue.s/Angular etc

1. Install with npm:  
  ```npm install https://supanotes.denisonweb.com/supanotes-1.0.0.tgz```

2. Example usage  
   ```visit https://feathersjs.com/api/client.html```

## Running Tests

To run the tests, use the following command in the project directory while docker is running:  
```docker exec -t supanotes-api-1 npm test```

## Contact

Jordan Denison - [@canadianwifi](https://twitter.com/canadianwifi) - jordan@denisonweb.com

Project Link: [https://github.com/jordandenison/supanotes](https://github.com/jordandenison/supanotes)
