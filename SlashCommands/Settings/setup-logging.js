const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const model = require("../../models/ticket_log");

        let cat;

module.exports = {
    name: "ticket-logs",
    category: "Settings",
    description: "Setup the ticket-logs",
    premium: true,
    options: [
    {
        name: "system",
        description: "Select which Ticket-System you want to manage",
        type: "STRING",
        required: true,
        choices: [
          { name: `1st Ticket-System`, value: `1` },
          { name: `2nd Ticket-System`, value: `2` },
          { name: `3rd Ticket-System`, value: `3` },
          { name: `4th Ticket-System`, value: `4` },
          { name: `5th Ticket-System`, value: `5` },
          { name: `6th Ticket-System`, value: `6` },
          { name: `7th Ticket-System`, value: `7` },
          { name: `8th Ticket-System`, value: `8` },
          { name: `9th Ticket-System`, value: `9` },
          { name: `10th Ticket-System`, value: `10` },
          { name: `11th Ticket-System`, value: `11` },
          { name: `12th Ticket-System`, value: `12` },
          { name: `13th Ticket-System`, value: `13` },
          { name: `14th Ticket-System`, value: `14` },
          { name: `15th Ticket-System`, value: `15` },
        ]
      },
      {
          name: "channel",
          description: "ticket-logs channel",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: true,
      },
      
    ], 

    run: async (client, interaction, args) => {
      let s = interaction.options.getString('system');
      let channel = interaction.options.getChannel("channel");
      let check = await interaction.guild.channels.cache.get(channel.id);

      if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.followUp({ content: `${client.emoji.wrong} **You cannot use this Command to Manage the Ticket-System!**`, ephemeral: true})

      model.findOne({ Guild: interaction.guild.id, System: s }, async(err, data) => {

      if(!check) return interaction.followUp({ content: `${client.emoji.wrong} The args you provide either isn't a channel, or I can't view the selected channel.` })

      const panel = new MessageEmbed()
      .setColor(client.config.color.main)
      .setTitle(`**Ticket Logs for: System \`${s}\`**`)
      .setDescription(`Ticket Archives/Closes will be posted here!`)
      .setFooter(`Powered by Azury`, interaction.guild.iconURL())


      const embed = new MessageEmbed()
      .setColor(client.config.color.main)
      .setTitle(`${client.emoji.correct} I have Setup the Ticket Logs`)
        
      .addField(`<:system:1057072480776359946> System Number:`, `**${s}**`)
      .addField(`<:channel:1057073038312603679> Logging Channel:`, `**${channel} (${channel.id})**`)

      
if(data) {
        data.delete()
} 
        new model({
            Guild: interaction.guild.id, 
            System: s,
            Logging: channel.id
          }).save()
        
      interaction.followUp({ embeds: [embed] })

      client.channels.cache.get(channel.id).send({ embeds: [panel] })
      })
    },
};