const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const mongoose = require('mongoose');
let cpuStat = require("cpu-stat");
let os = require("os");
const Discord = require(`discord.js`);
const config = require("../../config.json");
const db5 = require("../../models/ticket_theme");
let theme;

module.exports = {
    name: "stats",
    category: "Info",
    description: "View the bot's stats",
    type: 'CHAT_INPUT',
    run: async (client, interaction, args) => {

      db5.findOne({
        Guild: interaction.guild.id,
      }, async(err, data_4) => {
  
        if(data_4) {
          theme = data_4.opeColor||client.config.color.main
    } else {
          theme = client.config.color.main
    }



      const version = "N/A";

      embeds = [];
      let totalguilds;

      let date = new Date();
      let timestamp = date.getTime() - Math.floor(client.uptime);

      const data = await client.cluster.broadcastEval(c => { 
        let date = new Date();
      let timestamp = date.getTime() - Math.floor(c.uptime);
        return { guilds: c.guilds.cache.size, members: c.guilds.cache.map(g => g.memberCount).reduce((a,b)=>a+b,0), cluster: c.cluster.id, shards: c.cluster.ids.map(d => `#${d.id}`).join(", "), uptime: timestamp, ping: c.ws.ping, ram: (process.memoryUsage().heapUsed/1024/1024).toFixed(0) } })

      const shardField = data.map((d) => {
        const { cluster, shards, guilds, members, ping, uptime } = d;
        let ifGuild;

        if(cluster == client.cluster.id) {
          ifGuild = ` <:dot3:1053453194631590029>`
        } else {
          ifGuild = ""
        }
        
        return {
          name: `***Cluster\`#${cluster}\`*** (<t:${Math.floor(uptime / 1000)}:R>) ${ifGuild}`,
          value: `\`\`\`yml\nCluster: #${cluster}\nShards: ${shards}\nGuilds: ${guilds}\nMembers: ${members}\nPing: ${Math.round(ping)}ms\n\`\`\``,
          inline: true,
        }
      })


        const embed = new MessageEmbed()
          .setAuthor(`Bot Statistics of: ${client.user.tag}`, client.user.displayAvatarURL())
          .addField(`___Memory Used___:`, `***${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB***`, true)
          .addField(`___Discord.js___:`, `***v${Discord.version}***`, true)
          .addField(`___Node.js___:`, `***${process.version}***`, true)
          .addField(`___CPU___:`, `***${os.cpus().map((i) => `${i.model}`)[0]}***`, true)
          .addField(`___Ram Used___:`, `***${(process.memoryUsage().heapUsed/1024/1024).toFixed(0)}***`, true)
          .addField(`___Arch___:`, `***${os.arch()}***`, true)
          .addFields(shardField)
          .setThumbnail(interaction.guild.iconURL())
      .setColor(theme)
          .setFooter(`Your on cluster: #${client.cluster.id} & shard: ${client.cluster.ids.map(d => `#${d.id}`).join(", ")}`, interaction.guild.iconURL())
          

      

      return interaction.followUp({ embeds: [embed] })
    })
    },
};