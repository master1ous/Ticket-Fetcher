const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const db5 = require("../../models/ticket_theme");
let theme;

module.exports = {
    name: "invite",
    description: "Gets the bot's invite link",
    type: 'CHAT_INPUT',
    category: "Info",
    run: async (client, interaction, args) => {
      let msg = await interaction.followUp(`Loading..`);

      db5.findOne({
        Guild: interaction.guild.id,
      }, async(err, data_4) => {
  
        if(data_4) {
          theme = data_4.opeColor||client.config.color.main
    } else {
          theme = client.config.color.main
    }
  

      const emb = new MessageEmbed()
      .setColor(theme)
      .setTitle(`Invite ${client.user.username}`)
      .setDescription(`Once you invite me run **/help** to get started managing tickets the right way for your guild!`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic : true }))
      .setFooter(client.config.embed.footer) 

      const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
				.setLabel('Instant')
				.setStyle('LINK'),
			);
      
      setTimeout(() => {
        msg.edit({ content: ` `, embeds: [emb], components: [row] });
      }, 500);
    })
    },
};
