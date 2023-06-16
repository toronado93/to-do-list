const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
// const { ccc, dummytest } = require("./db");
const { atlasConnect, atlasAsk, atlasUpdate, dummytest } = require(__dirname +
  "/db.js");

let globaldata_scope = "native";

// Mongo DB Connection
atlasConnect();
dummytest();

// Middware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Get Method
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/calendar.html");
});
// app.get("/list.html", (req, res) => {
//   res.send("Hello Taksim");
//   //   res.sendFile(__dirname + "/list.html");
// });

// Post Method

app.post("/", async (req, res) => {
  const { date, month, year } = req.body;

  const the_day = `${date} ${month} ${year}`;
  //   Update Global timing in order to use in list-post
  globaldata_scope = the_day;
  //   We can use ask data here

  try {
    const atlasrespond = await atlasAsk(the_day);

    if (atlasrespond) {
      res.render("list", { the_day, atlasrespond });
    } else {
      res.render("list", { the_day, atlasrespond: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Post method for list
app.post("/list", async (req, res) => {
  // New Data will be send into the db.js
  const new_tasks = req.body;

  try {
    if (Object.keys(new_tasks).length != 0) {
      await atlasUpdate(globaldata_scope, new_tasks);
    } else {
    }
  } catch (error) {
    console.error(error);
  }

  //manage the get data from list
  // update your mongo
  // open your calendar.html page.

  res.sendFile(__dirname + "/calendar.html");
});

app.listen(port, () => {
  //   await ccc();
  console.log("Server is up and running");
});

app.use(express.static(__dirname));
