const tmi = require("tmi.js");
require("dotenv").config();
const commands = require("./jsFiles/commands")

// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: [
    process.env.TWITCH_CHANNEL
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

//Global Variables
const timedCommands = [];

// Called every time a message comes in
function onMessageHandler(channel, tags, message, self) {
  if (self) return;

  const command = message.split(" ");

  if (commandTimer(command[0])) return;

  executeCommands(channel, tags, command);
};

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);

  commands.readGame();
};

function commandTimer (command) {
  if (timedCommands.indexOf(command) > -1) return true;
  
  const commandsLength = timedCommands.length;
  timedCommands.push(command);

  let timer = setTimeout(() => {
    timedCommands.splice(commandsLength, 1);
    clearTimeout(timer);
  }, 1000);
  return false; 
};

function executeCommands (channel, tags, command) {
  const user = tags.username;

  switch(command[0].toLowerCase()) {
    case "hi":
    case "hello":
    case "hey":
      botResponse(`@${ user }, ${ commands.introduction() }`)
      break;

    case "!dice":
      botResponse(`@${ user }, ${ commands.dice(command[1]) }`)
      break;
    
    case "!bonk":
    case "!death":
    case "!count":
      botResponse(`@${ user }, ${ commands.counter(tags, command[1])}`)
      break;
    case "!wr":
      commands.getWR((response) => {
        botResponse(`@${ user }, ${ response }`)
      });
      break;
    case "!category":
      commands.changeCategory(tags, command.splice(1).join(" "), (response) => {
        botResponse(`@${ user }, ${ response }`)
      });
      break;

    case "!changeGame":
      commands.readGame();
      break;
  };
};

function botResponse(response) {
  client.say(process.env.TWITCH_CHANNEL, response)
};