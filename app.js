const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
  https
    .get("https://api.covid19api.com/country/India", (resp) => {
      let data = [];
      let current = {};
      let prev = {};
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        data = JSON.parse(data);
        current = data[data.length - 1];
        prev = data[data.length - 2];
        var increaseconfirmed = current.Confirmed - prev.Confirmed;
        var increaserecovered = 0;
        var increasedeath = current.Deaths - prev.Deaths;
        if (current.Recovered == 0) {
          increaserecovered = 0;
        } else {
          increaserecovered = current.Recovered - prev.Recovered;
        }
        res.render("index", {
          location: current.Country,
          confirmed: current.Confirmed,
          recovered: current.Recovered,
          death: current.Deaths,
          increase_confirmed: increaseconfirmed,
          increase_recovered: increaserecovered,
          increase_death: increasedeath,
        });
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});
app.post("/country", function (req, res) {
  const country = req.body.individual;
  https.get("https://api.covid19api.com/country/" + country, (resp) => {
    let data = [];
    let current = {};
    let prev = {};
    // A chunk of data has been received.
    resp.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp
      .on("end", () => {
        data = JSON.parse(data);
        current = data[data.length - 1];
        prev = data[data.length - 2];
        var increasedeath = current.Deaths - prev.Deaths;
        var increaserecovered = current.Recovered - prev.Recovered;
        var increaseconfirmed = current.Confirmed - prev.Confirmed;
        res.render("index", {
          location: current.Country,
          confirmed: current.Confirmed,
          recovered: current.Recovered,
          death: current.Deaths,
          increase_confirmed: increaseconfirmed,
          increase_recovered: increaserecovered,
          increase_death: increasedeath,
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  });
});
// about
app.get("/about", function (req, res) {
  res.render("About");
});
app.get("/precautions", function (req, res) {
  res.render("Precautions");
});
app.get("/map", function (req, res) {
  res.render("Map");
});
app.get("/home", function (req, res) {
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("Server listening on Port 3000");
});
