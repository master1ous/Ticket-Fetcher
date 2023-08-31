const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const db5 = require("../../models/ticket_theme");
const model = require("../../models/ticket");

        let cat;
        let theme;

module.exports = {
    name: "setup-ticket",
    category: "Setup",
    description: "Setup the ticket-system",
    premium: true,
    options: [
    {
        name: "system",
        description: "Select which Ticket-System you want to setup",
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
        name: "style",
        description: "Select which style you want for ticket names",
        type: "STRING",
        required: true,
        choices: [
          { name: `ticket-{username}`, value: `ticket-` },
          { name: `📁│t・{username}`, value: `📁│t・` },
          { name: `🎫│t・{username}`, value: `🎫│t・` },
          { name: `📁│ticket・{username}`, value: `📁│ticket・` },
          { name: `🎫│ticket・{username}`, value: `🎫│ticket・` },
          { name: `📁・{username}`, value: `📁・` },
          { name: `🎫・{username}`, value: `🎫・` },
          { name: `📁・t・{username}`, value: `📁・t・` },
          { name: `🎫・t・{username}`, value: `🎫・t・` },
          { name: `t・{username}`, value: `t・` },
          { name: `ticket・{username}`, value: `ticket・` },
          { name: `🎫︱{username}`, value: `🎫︱` },
          { name: `📁︱{username}`, value: `📁︱` },
          { name: `🎫︱ticket・{username}`, value: `🎫︱ticket・` },
          { name: `📁︱ticket・{username}`, value: `📁︱ticket・` },
        ]
      },
      {
        name: "type",
        description: "What is the ticket type? General, Support, ect.",
        type: "STRING",
        required: true,
      },
      {
          name: "channel",
          description: "ticket-panel channel",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: true,
      },
      
      {
            name: "role",
            description: "Admin Role to manage tickets",
            type: 8,
            required: true,
      },
      {
        name: "button_label",
        description: "Label for the button",
        type: "STRING",
        required: true,
      },
      {
        name: "embed_desc",
        description: "Message on prompt",
        type: "STRING",
        required: true,
      },
      {
        name: "ticket_open_msg",
        description: "Message on ticket-open [Use +n+ to add a space]",
        type: "STRING",
        required: true,
      },
      {
        name: "allow_skip",
        description: "Should the opener be allowed to skip the ticket reason?",
        type: "STRING",
        required: true,
        choices: [
          { name: `Yes, allow`, value: `yes` },
          { name: `No, disable`, value: `no` },
          
        ]
      },
      {
          name: "category",
          description: "ticket category",
          type: "CHANNEL",
          channelTypes: ["GUILD_CATEGORY"],
          required: false,
      },
    
     
      
    ], 

    run: async (client, interaction, args) => {
      let s = interaction.options.getString('system');
      let ss = interaction.options.getString('type');
      let sss = interaction.options.getString('style');
      let ssss = interaction.options.getString('allow_skip');
      let channel = interaction.options.getChannel("channel");
      let category = interaction.options.getChannel("category");
      let role = interaction.options.getRole('role');
      let message = interaction.options.getString('embed_desc');
      let msg = interaction.options.getString('ticket_open_msg');
      let label = interaction.options.getString('button_label');
      let check = await interaction.guild.channels.cache.get(channel.id);

      db5.findOne({
        Guild: interaction.guild.id,
      }, async(err, data_4) => {

        
        if(data_4) {
          theme = data_4.opeColor||client.config.color.main
    } else {
          theme = client.config.color.main
    }


      if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.followUp({ content: `${client.emoji.wrong} **You cannot use this Command to Manage the Ticket-System!**`, ephemeral: true})

      



      model.findOne({ Guild: interaction.guild.id, System: s }, async(err, data) => {

      if(!check) return interaction.followUp({ content: `${client.emoji.wrong} The args you provide either isn't a channel, or I can't view the selected channel.` })

      if(ss.length > 10) return interaction.followUp({ content: `${client.emoji.wrong} Your ticket-type can't be over 10 characters!` })



      const panel = new MessageEmbed()
      .setTitle(`**Open a Ticket in \`${interaction.guild.name}\`**`)
      .setDescription(`${message.split("+n+").join("\n")}`)
      .setColor(`${client.config.color.main}`)
      .setFooter(`Press the Button below to open a ticket`, interaction.guild.iconURL())

      const button = new MessageActionRow()
      .addComponents([
        new MessageButton()
        .setLabel(label)
        .setStyle(`SECONDARY`)
        .setEmoji(`1057071742172016781`)
        .setCustomId(`create_ticket${s}`),
        new MessageButton()
        .setStyle(`SECONDARY`)
        .setEmoji(`1057071228969553980`)
        .setCustomId(`edit_ticket${s}`)
      ])
      const embed = new MessageEmbed()
      .setColor(theme)
      .setTitle(`${client.emoji.correct} I have Setup the Ticket System`)
        .setDescription(`\n**Tip:** To setup the logs, use the command: ***/ticket-logs***\n`)
      .addField(`<:system:1057072480776359946> Ticket System Number:`, `**${s}**`)
        .addField(`<:type:1057072839271927838> Ticket Type:`, `**${ss || `General`}**`)
      .addField(`<:channel:1057073038312603679> Ticket Channel:`, `**${channel} (${channel.id})**`)
      .addField(`<:category:1057073305552699472> Ticket Category:`, `**${category || `_\`None Set, Using Default\`_`}**`)
      .addField(`${client.emoji.manage} Ticket Admin Role:`, `**${role}**`)
      .addField(`${client.emoji.preview} Ticket Open Message:`, msg.split("+n+").join("\n"))
      

        if(category) {
          cat = category.id
        } else {
          cat = null
        }
        
        
        
      interaction.followUp({ embeds: [embed] })

      client.channels.cache.get(channel.id).send({ embeds: [panel], components: [button] }).catch((e) => { interaction.channel.send(`${client.emoji.wrong} I cant send the Embed to that channel! Check my perms!`)}).then(async(message)=> {
        if(data) { data.delete(); new model({
            Guild: interaction.guild.id, 
            System: s,
            Admin: role.id,
            OpenMsg: msg.split("+n+").join("\n"),
            Category: cat,
            Type: ss||`General`,
            Style: sss||`ticket-`,
            AllowSkip: ssss||`yes`,
            TMessage: message.id,
            TChannel: message.channel.id,
            TButton: label,
            TDesc: message,
            //opeColor: openColor,
          }).save() }
        if(!data) new model({
            Guild: interaction.guild.id, 
            System: s,
            Admin: role.id,
            OpenMsg: msg.split("+n+").join("\n"),
            Category: cat,
            Type: ss||`General`,
            Style: sss||`ticket-`,
            AllowSkip: ssss||`yes`,
            TMessage: message.id,
            TChannel: message.channel.id,
            TButton: label,
            TDesc: message,
            //opeColor: openColor,
          }).save()
      })
      })
    })
    },
};