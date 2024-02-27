const request = require("request");
require("dotenv").config();

function getTwitchAPI(url, callback) {
  const options = { 
    url: url,
    method: "GET",
    headers: {
      "CLIENT-ID": process.env.CLIENT_ID,
      "Authorization": "Bearer " + process.env.BOT_ACCESS_TOKEN
    }
  };


  getRequest(options, (response) => {
    callback(response)
  });
};

function getNoHeaderAPI(url, callback) {
  const options = {
    url: url,
    method: "GET",
  };

  getRequest(options, (response) => {
    callback(response)
  });
};

function getRequest(options, callback) {
  request.get(options, function (error, response, body) {
    if (error) return;
    const objectResponse = JSON.parse(body);
    if (objectResponse.status) return console.log(objectResponse.message);

    callback(objectResponse)
  });
};

module.exports = { getTwitchAPI, getNoHeaderAPI };