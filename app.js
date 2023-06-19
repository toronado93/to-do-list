const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const {
  atlasConnect,
  atlasAsk,
  atlasUpdate,
  atlasTaskDeleter,
} = require(__dirname + "/db.js");

const openWeatherApi = require(__dirname + "/api.js");

let globaldata_scope = "native";

// Open Weather API TASKS
let open_responde = {};
(async () => {
  open_responde = await openWeatherApi.fetchWeatherInfo();
})();

// Mongo DB Connection
atlasConnect();

// Middware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Get Method
app.get("/", async (req, res) => {
  //   const open_responde = await openWeatherApi.fetchWeatherInfo();

  res.render("calendar", {
    city_name: open_responde.city_name,
    icon_url: open_responde.icon_url,
    temperature: open_responde.temp,
    data_info: 0,
    data_circumstance: "",
  });
});

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
  // Seperate req.body as new item and deleted item
  const task_object = req.body;
  const delete_object = {};
  const new_object = {};
  let data_return_info = 0;
  let data_circumstance = "";

  for (const key in task_object) {
    if (key.includes("delete")) {
      delete_object[key] = task_object[key];
    } else {
      new_object[key] = task_object[key];
    }
  }

  //   New Data will be send into the db.js
  try {
    if (Object.keys(new_object).length != 0) {
      const addedreturn = await atlasUpdate(globaldata_scope, new_object);

      // data return info here

      data_return_info = addedreturn;
      data_circumstance = "added";
    } else {
    }
  } catch (error) {
    console.error(error);
  }

  //   Deleted Data will be send into the db.js

  try {
    if (Object.keys(delete_object).length != 0) {
      const deletereturn = await atlasTaskDeleter(
        globaldata_scope,
        delete_object
      );

      // Pop-up
      data_return_info = deletereturn;
      data_circumstance = "deleted";
    } else {
    }
  } catch (error) {
    console.error(error);
  }

  //   res.sendFile(__dirname + "/calendar.html");
  res.render("calendar", {
    city_name: open_responde.city_name,
    icon_url: open_responde.icon_url,
    temperature: open_responde.temp,
    data_info: data_return_info,
    data_circumstance,
  });
});

app.listen(port, () => {
  //   await ccc();
  console.log("Server is up and running");
});

app.use(express.static(__dirname));
