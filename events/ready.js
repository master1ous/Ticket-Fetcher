const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const client = require("../index");

client.on("ready", async() => {
    
 



console.clear()

let date = new Date();
let timestamp = date.getTime() - Math.floor(client.uptime);

 data = await client.cluster.broadcastEval(c => { 
  let date = new Date();
let timestamp = date.getTime() - Math.floor(c.uptime);
  return { guilds: c.guilds.cache.size, members: c.guilds.cache.map(g => g.memberCount).reduce((a,b)=>a+b,0), cluster: c.cluster.id, shards: c.cluster.ids.map(d => `#${d.id}`).join(", "), uptime: timestamp, ping: c.ws.ping, ram: (process.memoryUsage().heapUsed/1024/1024).toFixed(0) } })

const shardField = data.map((d) => {
  const { cluster, shards, guilds, members, ping, uptime } = d;
  

  
  console.log("Ping is " + red.bold(`${Math.round(ping)}ms` + "!"));
  console.log("On Shard " + `${shards}`);
  
})
    console.log(green(`[🚩BOT] → ` + magenta(`${client.user.tag}`) +  ` is up & ready!`));
    console.log(green(`[🚩BOT] → https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`))
    client.user.setActivity(client.config.activity.replace("{shards}", client.cluster.id)
    , { type: client.config.status.type })
    client.user.setStatus(client.config.status)
  console.log(cyan.bold(`⭐ This code is Powered by Azury Studios`));
  

  
  
});
