const { Client, Collection } = require("discord.js");
const chalk = require("chalk");
const Discord = require(`discord.js`)
const Cluster = require('discord-hybrid-sharding');
const discordModals = require('discord-modals');
const colors = require("colors");
const { red, green, blue, magenta, cyan, white, gray, black, yellow } = require("chalk");
const client = new Client({
    shards: Cluster.data.SHARD_LIST, 
    shardCount: Cluster.data.TOTAL_SHARDS, 
    intents: 32767,
});
module.exports = client;

// Global Variables

client.commands = new Collection();
client.slashCommands = new Collection();
const fs = require(`fs`);
client.config = require("./config.json");
client.emoji = require(`./emoji.json`)
client.cluster = new Cluster.Client(client)

// Initializing the project
require("./handler")(client);
discordModals(client);

/*        WEB & BOT SERVER         ¦¦        WEB & BOT SERVER        */ 
if(client.config.hostingweb == true) {
require("./webport")();
}




client.login(process.env.token || client.config.token)

/*           ANTI CRASHING            ¦¦           ANTI CRASHING           */ 
process.on('unhandledRejection', (reason, p) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] unhandled Rejection:'.toUpperCase().red);
    console.log(reason.stack.yellow ? String(reason.stack).yellow : String(reason).yellow);
    console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().red);
  });
  process.on("uncaughtException", (err, origin) => {
    console.log('\n\n\n\n\n\n[🚩 Anti-Crash] uncaught Exception'.toUpperCase());
    console.log(err.stack.yellow ? err.stack.yellow : err.yellow)
    console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().red);
  })
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('[🚩 Anti-Crash] uncaught Exception Monitor'.toUpperCase().red);
  });
  process.on('beforeExit', (code) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] before Exit'.toUpperCase().red);
    console.log(code.yellow);
    console.log('=== before Exit ===\n\n\n\n\n'.toUpperCase().red);
  });

  process.on('multipleResolves', (type, promise, reason) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] multiple Resolves'.toUpperCase().red);
    console.log(type, promise, reason.yellow);
    console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase().red);
  });
  
