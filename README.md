# REST API for a Restaurant with Prisma and Express

### Get started

1. Clone the repository

   ```sh
   git clone https://github.com/itzAmka/restaurant-rest-api.git restaurant-rest-api

   cd restaurant-rest-api
   ```

2. Install the dependencies

   ```sh
   pnpm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```.env
   DATABASE_URL="MONGODB_URL"
   ```

4. Run the Prisma commands to generate the Prisma client and migrate the database

   ```sh
   npx prisma generate
   ```

5. Run the development server

   ```sh
   pnpm dev
   ```
