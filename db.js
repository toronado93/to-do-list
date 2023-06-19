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

  try {
    const check = await List.countDocuments({ date: appdate });

    // If does not exist
    if (check !== 1) {
      const newList = new List({ date: appdate, matters: values });

      const result = await newList.save();
    } else {
      try {
        const result = await List.updateOne(
          { date: appdate },
          { $push: { matters: values } }
        );

        if (result.modifiedCount > 0) {
          console.log("Document updated successfully.");
        } else {
          console.log("No document found matching the given date.");
        }
        return result.modifiedCount;
      } catch (error) {
        console.log("Error updating document", error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Future Create better function to find tasks

const askData = async (appdate) => {
  // Firstly bring all data with new method

  try {
    console.log("Atlas Rise! running for your query..");

    const check = await List.countDocuments({ date: appdate });
    if (check === 1) {
      const result = await List.find({ date: appdate });
      return result[0].matters;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async (appdate, deletetask_object) => {
  // check to data single or plural

  let values = Object.values(deletetask_object); // Extract values from the object
  values = values.flat(); // making nsted array to flat

  try {
    const result = await List.updateOne(
      { date: appdate },
      { $pull: { matters: { $in: values } } }
    );

    // console.log(result);
    // return data for pop-up info resource

    return result.modifiedCount;
  } catch (error) {
    console.log(error);
  }
};

// Send mentod into the mongodb

module.exports.atlasConnect = connectDB;
module.exports.atlasAsk = askData;
module.exports.ccc = connection_Info;
module.exports.atlasUpdate = updateData;
module.exports.atlasTaskDeleter = deleteData;
// module.exports.dummytest = newversionaskData;
