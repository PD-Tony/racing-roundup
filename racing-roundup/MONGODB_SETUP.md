# MongoDB Setup Guide for Racing Roundup

This guide will help you set up a free MongoDB Atlas database for the Racing Roundup project.

## Setting Up MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**
   - After signing in, click "Build a Database"
   - Select the "FREE" tier option
   - Choose your preferred cloud provider and region (ideally one close to the UK for better performance)
   - Click "Create Cluster" (this may take a few minutes to provision)

3. **Set Up Database Access**
   - In the left sidebar, click "Database Access" under Security
   - Click "Add New Database User"
   - Create a username and password (make sure to save these securely)
   - Set privileges to "Read and Write to Any Database"
   - Click "Add User"

4. **Configure Network Access**
   - In the left sidebar, click "Network Access" under Security
   - Click "Add IP Address"
   - For development, you can click "Allow Access from Anywhere" (not recommended for production)
   - Alternatively, add your specific IP address
   - Click "Confirm"

5. **Get Your Connection String**
   - Once your cluster is created, click "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `racing-roundup`

6. **Update Your .env.local File**
   - Open the `.env.local` file in the project root
   - Replace the `MONGODB_URI` value with your connection string

Example:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.example.mongodb.net/racing-roundup?retryWrites=true&w=majority
```

## Testing Your Connection

After setting up MongoDB Atlas and updating your `.env.local` file, you can test the connection by:

1. Installing dependencies:
   ```
   npm install
   ```

2. Starting the development server:
   ```
   npm run dev
   ```

3. Populating the database with initial articles:
   ```
   node scripts/fetch-news.js
   ```

4. Visiting `http://localhost:3000` in your browser

## Troubleshooting

If you encounter connection issues:

- Ensure your IP address is whitelisted in Network Access
- Verify your username and password are correct
- Check that you've replaced all placeholders in the connection string
- Make sure you've included the database name (`racing-roundup`) in the connection string

For more detailed MongoDB Atlas setup instructions, visit the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/).
