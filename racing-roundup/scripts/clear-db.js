// Script to clear all articles from the MongoDB database
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/racing-roundup';

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Import Article model
    let Article;
    try {
      Article = require('../lib/models/Article').default;
    } catch (error) {
      console.error('Error loading Article model. Make sure you have built the TypeScript files.');
      console.error('Try running: npm run build');
      process.exit(1);
    }
    
    // Count existing articles
    const count = await Article.countDocuments();
    console.log(`Found ${count} articles in the database`);
    
    if (count === 0) {
      console.log('No articles to delete. Database is already empty.');
    } else {
      // Delete all articles
      const result = await Article.deleteMany({});
      console.log(`Deleted ${result.deletedCount} articles from the database`);
    }
    
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the function
clearDatabase();
