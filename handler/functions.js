const Discord = require("discord.js");
const {
  Client,
  Collection,
  MessageEmbed,
  MessageAttachment, Permissions, MessageButton, MessageActionRow, MessageSelectMenu
} = require("discord.js");
const ms = require("ms")
const moment = require("moment")
const fs = require('fs')


module.exports = {
  swap_pages2,
  swap_pages2_interaction,
}
async function swap_pages2(client, interaction, embeds) {
  let currentPage = 0;
  let cmduser = interaction.user;
  if (embeds.length === 1) return interaction.followUp({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("◀️").setLabel("Back")

  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('▶️').setLabel("Forward")
  let button_stop = new MessageButton().setStyle('PRIMARY').setCustomId('stop').setEmoji(`❌`)
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_forward, button_stop])]
  //Send interaction with buttons
  let swapmsg = await interaction.followUp({   
      content: `**Use the __Buttons__ below, to swap the Pages!**`,
      embeds: [embeds[0]], 
      components: allbuttons
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({
   filter: (i) => (i.isButton() || i.isSelectMenu()) && i.user == interaction.user.id, time: 180e3 }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
      if(b.user.id !== interaction.user.id)
        return b.reply({content: `❌ **Only the one who typed the command is allowed to react!**`, ephemeral: true})
        //page forward
        if(b?.customId == "1") {
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage !== 0) {
              currentPage -= 1
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
              await b?.deferUpdate();
            } else {
                currentPage = embeds.length - 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        }
        //go home
        else if(b?.customId == "2"){
          collector.resetTimer();
          //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
            currentPage = 0;
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
            await b?.deferUpdate();
        } 
        //go forward
        else if(b?.customId == "3"){
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage < embeds.length - 1) {
                currentPage++;
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            } else {
                currentPage = 0
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        
        } 
        //go forward
        else if(b?.customId == "stop"){
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
            await b?.deferUpdate();
            collector.stop("stopped");
        }
  });
  collector.on("end", (reason) => {
    if(reason != "stopped"){
      swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
    }
  })

}
function getDisabledComponents (MessageComponents) {
  if(!MessageComponents) return []; // Returning so it doesn't crash
  return MessageComponents.map(({components}) => {
      return new MessageActionRow()
          .addComponents(components.map(c => c.setDisabled(true)))
  });
}
async function swap_pages2_interaction(client, interaction, embeds) {
  let currentPage = 0;
  let cmduser = interaction?.user;
  if (embeds.length === 1) return interaction?.reply({ephemeral: true, embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("◀️").setLabel("Back")

  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('▶️').setLabel("Forward")
  let button_stop = new MessageButton().setStyle('PRIMARY').setCustomId('stop').setEmoji(`❌`)
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_forward, button_stop])]
  //Send interaction with buttons
  let swapmsg = await interaction?.reply({   
      content: `**Use the __Buttons__ below, to swap the Pages!**`,
      embeds: [embeds[0]], 
      components: allbuttons,
      ephemeral: true
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({
   filter: (i) => (i.isButton() || i.isSelectMenu()) && i.user == interaction.user.id, time: 180e3 }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
      if(b.user.id !== cmduser.id)
        return b?.reply({content: `❌ **Only the one who typed the command is allowed to react!**`, ephemeral: true})
        //page forward
        if(b?.customId == "1") {
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage !== 0) {
              currentPage -= 1
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
              await b?.deferUpdate();
            } else {
                currentPage = embeds.length - 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        }
        //go home
        else if(b?.customId == "2"){
          collector.resetTimer();
          //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
            currentPage = 0;
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
            await b?.deferUpdate();
        } 
        //go forward
        else if(b?.customId == "3"){
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage < embeds.length - 1) {
                currentPage++;
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            } else {
                currentPage = 0
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        
        } 
        //go forward
        else if(b?.customId == "stop"){
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
            await b?.deferUpdate();
            collector.stop("stopped");
        }
  });
  collector.on("end", (reason) => {
    if(reason != "stopped"){
      swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
    }
  })

}