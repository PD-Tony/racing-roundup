// Script to check the contents of the MongoDB database
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/racing-roundup';

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Define a simplified Article schema
    const ArticleSchema = new mongoose.Schema({
      title: String,
      description: String,
      link: String,
      pubDate: Date,
      source: String,
      category: String,
      imageUrl: String,
      author: String,
      isProcessed: Boolean
    });
    
    // Create a model from the schema
    const Article = mongoose.model('Article', ArticleSchema);
    
    // Count articles
    const totalCount = await Article.countDocuments();
    console.log(`Total articles in database: ${totalCount}`);
    
    // Count articles by category
    const f1Count = await Article.countDocuments({ category: 'F1' });
    const motoGPCount = await Article.countDocuments({ category: 'MotoGP' });
    console.log(`F1 articles: ${f1Count}`);
    console.log(`MotoGP articles: ${motoGPCount}`);
    
    // Get the 5 most recent articles
    const recentArticles = await Article.find().sort({ pubDate: -1 }).limit(5);
    
    console.log('\nMost recent articles:');
    recentArticles.forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Published: ${article.pubDate.toISOString()}`);
    });
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    process.exit(0);
  }
}

// Run the function
checkDatabase();
