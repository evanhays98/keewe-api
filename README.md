# Keewe API

This is the repository for the Keewe API. This API is built with Nest.js and TypeScript, and uses PostgreSQL for the
database.

## Prerequisites

- npm
- Docker
- Docker Compose

## Installation

1. Clone the repository:

```bash
git clone https://github.com/evanhays98/keewe-api.git
```

2. Install the dependencies:

```bash
npm install
```

3. Copy the `.env.dist` file to `.env`:

```bash
cp .env.dist .env
```

## Running the app

1. Start the database:

```bash
docker compose up -d
```

2. Run the migrations:

```bash
npm run mig
```

3. Start the app:

```bash
npm run start:dev
```

## Running the tests

```bash
npm run test
```