1. Copy .env to the root of the project

2. Build and run container of the database
   sudo docker-compose up --build -d postgres

3. Install libraries
   npm install

4. Delete database and apply migrations and seeds
   npx prisma migrate reset

5. Run the application
   npm start