const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Database connection URI
const uri = process.env.MONGODB_URI;

async function saveDataToDatabase() {
  try {
    // Read JSON data from file
    const jsonData = fs.readFileSync('./Questions.json', 'utf8');
    const data = JSON.parse(jsonData);

    // Connect to the database
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(process.env.quizAPI);

    // Insert data into the database
    const collection = db.collection('PsychoQuestions'); // Replace 'collectionName' with your actual collection name
    await collection.insertMany(data);

    console.log('Data saved to database successfully');
    client.close();
  } catch (err) {
    console.error('Error saving data to database:', err);
  }
}

module.exports = { saveDataToDatabase };
