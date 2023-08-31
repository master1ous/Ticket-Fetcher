const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const model = require("../../models/ticket_theme");
const config = require("../../config.json");


module.exports = {
    name: "setup-theme",
    category: "Setup",
    description: "Setup the color theme",
    premium: true,
    options: [
    {
        name: "pallet",
        description: "Select which Color-pallet you want to setup",
        type: "STRING",
        required: true,
        choices: [
        {name: `Default`, value: `${config.color.main}`},
        {name: `Red`, value: `RED`},
        {name: `Orange`, value: `ORANGE`},
        {name: `Yellow`, value: `YELLOW`},
        {name: `Green`, value: `GREEN`},
        {name: `Blue`, value: `BLUE`},
        {name: `Purple`, value: `PURPLE`},
        {name: `Black`, value: `BLACK`},
        {name: `White`, value: `WHITE`},
        ]
      },
    
     
      
    ], 

    run: async (client, interaction, args) => {
      let s = interaction.options.getString('pallet');

      if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.followUp({ content: `${client.emoji.wrong} **You cannot use this Command to Manage the Ticket-System!**`, ephemeral: true})




      model.findOne({ Guild: interaction.guild.id }, async(err, data) => {

     if(data) { data.delete() }

      })

      const embed = new MessageEmbed()
      .setColor(s||client.config.color.main)
      .setTitle(`${client.emoji.correct} I have changed the color pallet!`)
        .setDescription(`\n**Color:** ${s||"Not defined??"}`)

        
      interaction.followUp({ embeds: [embed] })


      new model({
        Guild: interaction.guild.id, 
        opeColor: s,
      }).save()
      console.log(`Changed the color theme ${interaction.guild.id} -> ${s}`)
    },
};