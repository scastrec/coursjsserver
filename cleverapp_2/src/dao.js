import mongodb from 'mongodb';
 
// Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'chatapi';

const getCollection = async (collection) => {
    // Use connect method to connect to the server
    try {
        const client = await mongodb.MongoClient.connect(url);
        const db = await client.db(dbName);
        return db.collection(collection)
    } catch (e) {
        console.log("Error connecting to DB", e);
        throw e;
    }
} 

export const insertDocument = async (coll, doc) => {
    // Get the documents collection
    const collection = await getCollection(coll);
    // Insert one documents
    try {
        await collection.insertOne(doc);
    } catch(e) {
        console.log("Error inserting document to DB", e);
        throw e;
    }
  }

  export const findDocuments = async (coll, filter) => {
      console.log('findDocuments', filter);
    // Get the documents collection
    const collection = await getCollection(coll);
    // Insert one documents
    try {
        const found = await collection.find(filter).toArray();
        console.log({found});
        return found;
    } catch(e) {
        console.log("Error inserting document to DB", e);
        throw e;
    }
  }

  export const findOne = async (coll, filter) => {
      console.log('findOne', filter)
    // Get the documents collection
    const collection = await getCollection(coll);
    // Insert one documents
    try {
        return await collection.findOne(filter);
    } catch(e) {
        console.log("Error inserting document to DB", e);
        throw e;
    }
  }