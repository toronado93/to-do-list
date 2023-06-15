const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { atlasConnect, atlasAsk } = require(__dirname + "/db.js");

// Mongo DB Connection
atlasConnect();

// Middware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Get Method
app.get("/", (req, res) => {
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

app.listen(port, () => {
  console.log("Server is up and running");
});

app.use(express.static(__dirname));
