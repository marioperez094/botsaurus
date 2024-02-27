const fs = require("fs");
require("dotenv").config();
const api = require("./apiRequests")

//Global variables
let count = 0;
let game = "";
let speedrunCategory = "9d8nl33d"

//Load Functions
function readGame() {
  api.getTwitchAPI("https://api.twitch.tv/helix/channels?broadcaster_id=" + process.env.CHANNEL_ID, (response) => {
    game = response.data[0].game_name;
  });
};

//Check Mods
function modFunction(tags) {
  const isAdmin = tags.username === process.env.TWITCH_CHANNEL;
  const isMod = tags.mod;

  if (isAdmin) return "admin"
  if (isMod) return "mod";

  return false;
};

//Mod Functions
function counter(tags, number = 1) {
  if (!modFunction(tags)) return "you cannot complete this task.";
  if (isNaN(parseFloat(number))) {
    return number + " is not a number";
  };

  count += parseFloat(number);

  fs.writeFileSync("./textFiles/bonkCounter.txt", "Counter: " + count.toString());

  return `the count is now ${ count }`;
};

function changeCategory(tags, category, callback) {
  if (!modFunction(tags)) return callback("you cannot complete this task.");
  if (!category) return callback("please include a category.");
  api.getNoHeaderAPI("https://www.speedrun.com/api/v1/games?name=" + game, (response) => {
    if (!response.data) return callback(response);

    const gameID = response.data[0].id;
    api.getNoHeaderAPI("https://www.speedrun.com/api/v1/games/" + gameID + "/categories", (response) => {
      if (!response.data) return callback(response);

      const filteredCategories = response.data.filter((runCategory) => {
        return runCategory.name === category
      });

      speedrunCategory = filteredCategories[0].id
      return callback(`the category has been changed to ${ filteredCategories[0].name }`)
    });
  });
};

//Normal Functions
function introduction() {
  return "hello! Welcome to the dino herd! KonCha";
}

function dice(sidesInDice = 6) {
  if (isNaN(parseFloat(sidesInDice))) { 
    return sidesInDice + " is not a number";
  };

  const diceLand = Math.floor(Math.random() * sidesInDice) + 1;
  return "you rolled " + diceLand + " out of " + sidesInDice + "."; 
};

function getWR(callback) {
  api.getNoHeaderAPI('https://www.speedrun.com/api/v1/games?name=' + game, (response) => {
    if (!response.data) return callback(response);

    const gameID = response.data[0].id;

    api.getNoHeaderAPI("https://www.speedrun.com/api/v1/leaderboards/" + gameID + "/category/" + speedrunCategory + "?top=1&embed=players", (response) => {
      if (!response.data) return callback(response);

      const worldRecord = response.data.runs[0].run.times.primary.slice(2);
      const player = response.data.players.data[0].names.international;

      return callback(`the current wr is ${ worldRecord } by ${ player }`);
    })
  });
};

module.exports = { readGame, introduction, dice, counter, getWR, changeCategory }