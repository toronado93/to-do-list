require("dotenv").config();
const mongoose = require("mongoose");

// Problem Occured early due absent of db name
const connectionURL = process.env.MONGODB_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(connectionURL, options);
    console.log("MongoDB Atlas is connected...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const connection_Info = async () => {
  try {
    const connection = await mongoose.connect(connectionURL, options);
    console.log("MongoDB Atlas PLUS is connected...");

    // Retrieve information about the connection
    const db = connection.connection.db;
    const databaseName = db.databaseName;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);

    const connectionInfo = {
      connectionURL,
      databaseName,
      collections: collectionNames,
    };

    console.log(connectionInfo);
  } catch (error) {}
};

const List = mongoose.model(
  "list",
  new mongoose.Schema({
    date: String,
    matters: [String],
  })
);

const updateData = async (appdate, newtask_object) => {
  // Looking for the day date if the date exist apply update method
  // If date doesnt exist in mongo apply insert method

  const values = Object.values(newtask_object); // Extract values from the object

  console.log(appdate, values);
  try {
    const result = await List.updateOne(
      { date: appdate },
      { $push: { matters: values } }
    );
    console.log("Update result:", result);

    if (result.modifiedCount > 0) {
      console.log("Document updated successfully.");
    } else {
      console.log("No document found matching the given date.");
    }
  } catch (error) {
    console.log("Error updating document", error);
  }

  console.log(date);
  console.log(newtask_object);
};

// Future Create better function to find tasks

const newversionaskData = async (day_info) => {
  // Firstly bring all data with new method

  try {
    const result = await List.find({});

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const askData = async (day_info) => {
  try {
    await mongoose.connect(connectionURL, options);
    console.log("Atlas Rise! running for your query..");

    const db = mongoose.connection.db;

    if (db) {
      const collection = db.collection("list");
      const result = await collection
        .find(
          { date: day_info },
          {
            matters: 1,
          }
        )
        .toArray();

      if (result.length === 0) {
        return [];
      } else {
        return result[0].matters;
      }
    } else {
      console.log("DB connection is undefined");
      return ["Bad Internet Connection"];
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Send mentod into the mongodb

module.exports.atlasConnect = connectDB;
module.exports.atlasAsk = askData;
module.exports.ccc = connection_Info;
module.exports.atlasUpdate = updateData;
module.exports.dummytest = newversionaskData;
