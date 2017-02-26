/**
 * StaffPortal Slack plugin
 * Copyright (c) Gilbert Gobbels. All rights reserved.
 */

exports.info = {
  "name": "Slack Integration",
  "enabled": true
};

exports.runPlugin = function() {
  // StaffPortal dependencies
  const config = require("./config.json");
  const logging = require("../../../modules/console.js");

  logging.log("Hi! I'm the Slack connection, and if you see this then I'm alive!");

  // NPM dependencies
  const RtmClient = require("@slack/client").RtmClient;
  const CLIENT_EVENTS = require("@slack/client").CLIENT_EVENTS;

  // Slack API init
  const rtm = new RtmClient(config.token);

  // Commands
  const commands = {
    "hi": require("./modules/cmd/hi.js")
  };
  
  // Events
  //    Message
  rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    if(message.text.startsWith(config.prefix)) {
      let cmd = message.text.split(" ")[0];
      let args = message.text.split(" ").slice("1");
      
      for(let command in commands) {
        if(command.command === cmd) {
          logging.log(`[Command] User ${message.user} executed in ${command.channel}: ${message.text}`);
          command.runCommand(rtm, message, args);
        }
      }
    }
  });
};