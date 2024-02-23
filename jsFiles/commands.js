const fs = require("fs");
require("dotenv").config();

//Global variables
let count = 0;

function dice(sidesInDice = 6) {
  if (isNaN(parseFloat(sidesInDice))) { 
    return sidesInDice + " is not a number";
  };

  const diceLand = Math.floor(Math.random() * sidesInDice) + 1;
  return "you rolled " + diceLand + " out of " + sidesInDice + "."; 
};

function counter(number = 1) {
  count += parseFloat(number);
  
  fs.writeFileSync("./textFiles/bonkCounter.txt", "Counter: " + count.toString());

  return count;
};

module.exports = { dice, counter }