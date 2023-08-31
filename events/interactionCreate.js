const client = require("../index");
const { MessageEmbed, Collection } = require("discord.js")
const cooldowns = new Map();

client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({ content: "An error has occured " });

      if(cmd.finishedCommand == false && !client.config.developers.includes(interaction.user.id)){
        return interaction.reply(`<:wrong:1057074896540278917> **Hey there, this command is not finished or useable for the public, if this is a mistake please contact Azury** \n <:audit_join:1062835846631403540>  * Invite url is discord.gg/azury *`)
      }

      if (!cooldowns.has(cmd.name)) {
        const coll = new Collection();
        cooldowns.set(cmd.name, coll);
      }
      const current_time = Date.now();
      const time_stamps = cooldowns.get(cmd.name);
      const cooldown_amount = cmd.cooldown * 1000;
      if (time_stamps.has(interaction.user.id)) {
        const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;
        if (current_time < expiration_time) {
          const time_left = (expiration_time - current_time) / 1000;
          return interaction.reply({ content: `💥 Uh oh! Your currently on cooldown for the **${cmd.name}**, please wait **${time_left.toFixed(1)}** to use the command again` });
        }
      }
      time_stamps.set(interaction.user.id, current_time);
      setTimeout(() => time_stamps.delete(interaction.user.id), cooldown_amount);

      await interaction.deferReply({ ephemeral: false }).catch(() => {});
      const args = [];

      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(interaction.user.id);
      cmd.run(client, interaction, args);
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});
