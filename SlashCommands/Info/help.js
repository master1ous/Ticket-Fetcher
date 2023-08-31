const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { swap_pages2 } = require(`${process.cwd()}/handler/functions`);
const db5 = require("../../models/ticket_theme");
let theme;


module.exports = {
    name: "help",
    description: "See all of the bots commands",
    type: 'CHAT_INPUT',
    category: "Info",
    run: async (client, interaction, args) => {
let embeds = [];

db5.findOne({
      Guild: interaction.guild.id,
    }, async(err, data_4) => {

      if(data_4) {
            theme = data_4.opeColor||client.config.color.main
      } else {
            theme = client.config.color.main
      }


      const embed = new MessageEmbed()
      .setAuthor(`Ticketing Bot`, client.user.displayAvatarURL())
      .setDescription(`Hello there, I am **${client.user.username}** an advanced Ticket bot with many features. Use the buttons bellow to navigate my systems:\n\n› Information Commands\n› Settings Commands\n› Admin Commands`)
      .setColor(theme)
      .setFooter(client.config.embed.footer)

      const embed_info = new MessageEmbed()
      .setAuthor(`Information Commands`, client.user.displayAvatarURL())
      .setDescription(`
> *${client.slashCommands.filter((cmd) => cmd.category === "Info").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join(" ⁄ ")}*
`)
      .setColor(theme)
      .setFooter(client.config.embed.footer)

      const embed_settings = new MessageEmbed()
      .setAuthor(`Settings Commands`, client.user.displayAvatarURL())
      .setDescription(`
> *${client.slashCommands.filter((cmd) => cmd.category === "Settings").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join(" ⁄ ")}*
`)
      .setColor(theme)
      .setFooter(client.config.embed.footer)

      const embed_admin = new MessageEmbed()
      .setAuthor(`Admin Commands`, client.user.displayAvatarURL())
      .setDescription(`
> *${client.slashCommands.filter((cmd) => cmd.category === "Admin").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join(" ⁄ ")}*
`)
      .setColor(theme)
      .setFooter(client.config.embed.footer)

      
      embeds.push(embed, embed_info, embed_settings, embed_admin)

      return swap_pages2(client, interaction, embeds);
    })
    },
};
