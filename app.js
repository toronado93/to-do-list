const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

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

app.post("/", (req, res) => {
  const { date, month, year } = req.body;

  const the_day = `${date} ${month} ${year}`;

  res.render("list", { the_day });
});

app.listen(port, () => {
  console.log("Server is up and running");
});

app.use(express.static(__dirname));
