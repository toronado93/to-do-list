const mongoose = require("mongoose");

// Problem Occured early due absent of db name
const connectionURL =
  "mongodb+srv://eep93:uBXwc46VggsVQmYu@cluster0.9rr3zwi.mongodb.net/todo-list?retryWrites=true&w=majority";

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
  } catch (error) {}
};

// const List = mongoose.model(
//   "list",
//   new mongoose.Schema({
//     date: String,
//     matters: [String],
//   })
// );

const askData = async (day_info) => {
  try {
    await connectDB();

    const db = mongoose.connection.db;
    const collection = db.collection("list");
    const result = await collection
      .find(
        { date: day_info },
        {
          matters: 1,
        }
      )
      .toArray();

    return result[0].matters;
  } catch (error) {}
};

module.exports.atlasConnect = connectDB;
module.exports.atlasAsk = askData;
