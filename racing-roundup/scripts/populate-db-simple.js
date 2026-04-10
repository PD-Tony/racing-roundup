// Script to populate MongoDB with sample articles for testing
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// Sample article data with simpler content to avoid quote issues
const sampleArticles = [
  {
    _id: uuidv4(),
    title: "Hamilton Secures Pole Position at British Grand Prix",
    description: "Lewis Hamilton delivered a stunning lap to secure pole position for his home race at Silverstone.",
    content: "In a thrilling qualifying session at Silverstone, Lewis Hamilton showcased his exceptional skill by securing pole position for the British Grand Prix. Despite challenging weather conditions, Hamilton managed to outpace his rivals with a lap time that left commentators and fans in awe. This marks his eighth pole position at the British Grand Prix, extending his record at his home circuit.",
    imageUrl: "https://picsum.photos/800/600?random=1",
    category: "Formula 1",
    source: "Racing News",
    sourceUrl: "https://example.com/hamilton-pole",
    publishedAt: new Date("2025-03-30T14:30:00Z"),
    containsRaceResults: true,
    containsQualifyingResults: true
  },
  {
    _id: uuidv4(),
    title: "Bagnaia Dominates MotoGP Season Opener",
    description: "Francesco Bagnaia started the new MotoGP season with a commanding victory.",
    content: "Ducati rider Francesco Bagnaia made a statement of intent at the MotoGP season opener, securing a dominant victory that puts him in an early championship lead. The Italian rider showed impressive pace throughout the weekend and converted it into a masterful race performance. His teammate finished second, making it a perfect start to the season for the Ducati factory team.",
    imageUrl: "https://picsum.photos/800/600?random=2",
    category: "MotoGP",
    source: "MotoGP Central",
    sourceUrl: "https://example.com/bagnaia-wins",
    publishedAt: new Date("2025-03-28T16:45:00Z"),
    containsRaceResults: true,
    containsQualifyingResults: false
  },
  {
    _id: uuidv4(),
    title: "Red Bull Unveils Major Upgrade Package for Spanish GP",
    description: "Red Bull Racing has brought significant aerodynamic updates to Barcelona.",
    content: "Red Bull Racing has arrived at the Spanish Grand Prix with what team principal Christian Horner describes as their most significant upgrade package of the season. The updates focus primarily on floor and sidepod modifications aimed at improving airflow around the car. Technical director Pierre Waché explained that the team has been working on these developments since the early part of the season, with simulations suggesting a potential gain of up to three-tenths per lap.",
    imageUrl: "https://picsum.photos/800/600?random=3",
    category: "Formula 1",
    source: "F1 Insider",
    sourceUrl: "https://example.com/redbull-upgrades",
    publishedAt: new Date("2025-03-26T09:15:00Z"),
    containsRaceResults: false,
    containsQualifyingResults: false
  },
  {
    _id: uuidv4(),
    title: "Márquez Signs Contract Extension with Honda",
    description: "Marc Márquez has committed his future to Honda with a new multi-year deal.",
    content: "Six-time MotoGP champion Marc Márquez has ended speculation about his future by signing a contract extension with Honda. The new deal will keep the Spanish rider with the Japanese manufacturer for at least two more seasons. Despite a challenging period with injuries and the team's recent competitive struggles, Márquez expressed confidence that Honda can return to winning ways.",
    imageUrl: "https://picsum.photos/800/600?random=4",
    category: "MotoGP",
    source: "MotoGP Today",
    sourceUrl: "https://example.com/marquez-contract",
    publishedAt: new Date("2025-03-25T11:20:00Z"),
    containsRaceResults: false,
    containsQualifyingResults: false
  },
  {
    _id: uuidv4(),
    title: "FIA Introduces New Safety Measures Following Investigation",
    description: "The FIA has announced new safety protocols for all Formula 1 events.",
    content: "Following a comprehensive investigation into recent incidents, the FIA has unveiled a series of new safety measures to be implemented across all Formula 1 events. The changes include modifications to barrier designs at specific types of corners, enhanced driver warning systems, and updated extraction procedures. FIA President Mohammed Ben Sulayem emphasized that these measures are the result of close collaboration with teams, drivers, and safety experts.",
    imageUrl: "https://picsum.photos/800/600?random=5",
    category: "Formula 1",
    source: "Motorsport Safety",
    sourceUrl: "https://example.com/fia-safety",
    publishedAt: new Date("2025-03-22T14:10:00Z"),
    containsRaceResults: false,
    containsQualifyingResults: false
  }
];

// Connection URI from environment variable or default to localhost
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/racing-roundup";

async function populateDatabase() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB server");
    
    // Get reference to the database
    const db = client.db();
    
    // Get reference to the articles collection
    const articlesCollection = db.collection("articles");
    
    // Check if collection already has data
    const count = await articlesCollection.countDocuments();
    if (count > 0) {
      console.log(`Database already contains ${count} articles.`);
      console.log("Clearing existing articles...");
      await articlesCollection.deleteMany({});
      console.log("Existing articles cleared.");
    }
    
    // Insert sample articles
    const result = await articlesCollection.insertMany(sampleArticles);
    console.log(`${result.insertedCount} articles successfully inserted into the database.`);
    
    // Display the inserted articles
    console.log("\nArticles in the database:");
    const articles = await articlesCollection.find({}).toArray();
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.category}) - Published: ${article.publishedAt.toLocaleDateString("en-GB")}`);
    });
    
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection to MongoDB closed");
  }
}

// Run the function
populateDatabase();
