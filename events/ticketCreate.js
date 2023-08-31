/* |  Advanced Ticket Bot using MongoDB | */
const {
  MessageEmbed,
  Collection
} = require("discord.js");
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const {
  Modal,
  TextInputComponent,
  showModal
} = require('discord-modals');
const client = require("../index.js");
const discordTranscripts = require('discord-html-transcripts');
const colors = require("colors");
const moment = require("moment");
const dayjs = require("dayjs");
const cooldowns = new Map();

const db1 = require("../models/ticket"); 
const db2 = require("../models/ticket_claim"); 
const db3 = require("../models/ticket_log"); 
const db4 = require("../models/ticket_mention"); 
const db5 = require("../models/ticket_theme"); 
const db = require("../models/ticket_open"); 

const wait = require('util').promisify(setTimeout);
let mentions; 
let logs; 
let theme;

const typesimage = '.png'

client.on("interactionCreate", async(interaction) => {
      if(interaction.isCommand()) return;
      let systemnum = interaction.customId;
      let s = systemnum.match(/\d/g)
      if(s == null) return;
      s = s.join("")

      function msToTime(duration) {
        var milliseconds = parseInt((duration % 500) / 100),
          seconds = Math.floor((duration / 500) % 60),
          
        seconds = (seconds < 2) ? "" + `${seconds} second` : `${seconds} seconds`;

        return seconds;
      }


      if(!cooldowns.has(`ticket_usage`)) {
        cooldowns.set(`ticket_usage`, new Collection());
      }
      let currentDate = Date.now();
      let userCooldowns = cooldowns.get(`ticket_usage`);
      let cooldownAmount = 2000;




      db3.findOne({
        Guild: interaction.guild.id,
        System: s
      }, async(err, data) => {
        if(!data) return;
        logs = data.Logging || null;
      })

      
      db5.findOne({
        Guild: interaction.guild.id,
      }, async(err, data_4) => {

        
        if(data_4) {
          theme = data_4.opeColor||client.config.color.main
    } else {
          theme = client.config.color.main
    }


      if(interaction.customId == `edit_ticket${s}`) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: `${client.emoji.wrong} **You cannot use this Command to Manage the Ticket-System!**`, ephemeral: true})
        
        db1.findOne({
              Guild: interaction.guild.id,
              System: s
            }, async(err, data) => {
          const mid = data.TMessage||null;
          if(!mid) return interaction.reply({ content: `${client.emoji.wrong} **The database must be messed up! Please setup the system again!**`, ephemeral: true});
          const chid = data.TChannel||full;
          if(!chid) return interaction.reply({ content: `${client.emoji.wrong} **The database must be messed up! Please setup the system again!**`, ephemeral: true});

          const modal = new Modal() // We create a Modal
.setCustomId(`ticket-edit-modal${s}`)
.setTitle(`Edit your Ticket Panel`)
.addComponents([
  new TextInputComponent() // We create a Text Input Component
  .setCustomId(`tcp_desc${s}`)
  .setLabel('Edit Panel Description')
  .setStyle('LONG') //SHORT' or 'LONG'
  .setPlaceholder(data.TDesc.length > 60 ? data.TDesc.substring(0, 80) + ".." : data.TDesc)
  .setRequired(true),
  
  new TextInputComponent() // We create a Text Input Component
  .setCustomId(`tcp_button${s}`)
  .setLabel('Edit Button Label')
  .setStyle('SHORT') //SHORT' or 'LONG'
  .setPlaceholder(data.TButton)
  .setRequired(true),

  new TextInputComponent() // We create a Text Input Component
  .setCustomId(`tcp_openmsg${s}`)
  .setLabel('Edit OpenMsg Greeting')
  .setStyle('LONG') //SHORT' or 'LONG'
  .setPlaceholder(data.OpenMsg.length > 60 ? data.OpenMsg.substring(0, 80) + ".." : data.OpenMsg)
  .setRequired(true),

  new TextInputComponent() // We create a Text Input Component
  .setCustomId(`tcp_image1${s}`)
  .setLabel('Add a Embed Image')
  .setStyle('LONG') //SHORT' or 'LONG'
  .setPlaceholder(`Insert a image, .png or .gif supported. URL ONLY`)
  .setRequired(false),

]);


      
    showModal(modal, {
      client: client, // Client to show the Modal through the Discord API.
      interaction: interaction // Show the modal with interaction data.
    })
        })
      } else if(interaction.customId == `create_ticket${s}`) {
        
        opener = interaction.user.id;
        let x = dayjs(new Date()).unix()
        let yesorno;
        let allowtext;
        
db1.findOne({
              Guild: interaction.guild.id,
              System: s
            }, async(err, data) => {
              if(!data) return;

  if(data.AllowSkip == `no`) {
    yesorno = `true`

    allowtext = `*Sorry, looks like you can't add a reason to your ticket, the Server has it disabled!*`
  } else {
    yesorno = `false`

    allowtext = `Hello there, just a quick question...\n*Do you wish to add a reason for opening your ticket? Or do you want to skip this?*`
  }
              

          const roo = new MessageActionRow()
                              .addComponents([
                                  new MessageButton()
                                  .setLabel(`Add Reason`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`add_reason${s}`),
                                  new MessageButton()
                                  .setLabel(`Skip`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`skip_reason${s}`)
                                  .setDisabled(yesorno)
                              ])

          const emee = new MessageEmbed()
        .setColor(`PURPLE`)
        .setDescription(`${allowtext}`)
            
         interaction.reply({
                              embeds: [emee], components: [roo], ephemeral: true
                          })

})
              
      } if(interaction.customId == `skip_reason${s}`) {

        const emme = new MessageEmbed()
        .setColor(`PURPLE`)
        .setDescription(`<a:Foading:920516789883002880> *Skipping the ticket reason...*`)

        interaction.update({
                              embeds: [emme], components: [],
                              ephemeral: true
                          });

        
opener = interaction.user.id;
        let x = dayjs(new Date()).unix()
        db1.findOne({
              Guild: interaction.guild.id,
              System: s
            }, async(err, data) => {
              if(!data) return;
              interaction.guild.channels.create(`${data.Style||`ticket-`}${interaction.user.username}`, {
                  permissionOverwrites: [{
                      id: interaction.user.id,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                  }, {
                      id: data.Admin,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                  }, {
                      id: interaction.guild.roles.everyone,
                      deny: ["VIEW_CHANNEL"]
                  }],
                  type: 'text',
                  parent: data.Category,
                  topic: `📨 Ticket for: \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`
              }).catch(async(e) => {

              console.log(e)

                const ee = new MessageEmbed()
                .setColor(`DARK_RED`)
                .setTitle(`${client.emoji.wrong} An error occured while opening your ticket!`)
                .setDescription(`\`\`\`\n${e}\n\`\`\``)
                
              return interaction.editReply({
                  embeds: [ee],
                  ephemeral: true
              })
          }).then(async function(channel) {
              db.findOne({
                  Guild: interaction.guild.id,
                  Opener: interaction.user.id,
                  Type: data.Type || `General`
              }, async(err, data_) => {


                  if (data_) {
                      const check = await interaction.guild.channels.cache.get(data_.Channel);
                      if (!check) {
                          data_.delete();

                        const eme = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<:ghost:1063227719929823322> Seems your channel was deleted manually... *clearing your Database*\n _Click the button again to open your ticket_`)
                           interaction.editReply({
                              embeds: [eme], components: [],
                              ephemeral: true
                          });
                      } else {
                        const eeem = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`${client.emoji.wrong} You already have a Ticket opened at <#${data_.Channel}>!`)
                           interaction.editReply({
                              embeds: [eeem], components: [],
                              ephemeral: true
                          });
                      }
                      channel.delete()
                  } else {
                      db1.findOne({
                          Guild: interaction.guild.id,
                          System: s
                      }, async(err, data_1) => {
                          if (!data_1) return;

                        const eee = new MessageEmbed()
        .setColor(`GREEN`)
        .setDescription(`${client.emoji.correct} **Successfuly Created your ticket in <#${channel.id}>** \n _Ticket type:_ **${data.Type||`General`}**`)
                        
                           interaction.editReply({
                              embeds: [eee], components: [],
                              ephemeral: true
                          })
                        
let t_type = data.Type||`General`;
                        
                          const embed = new MessageEmbed()
                              .setColor(`${theme}`)
                              .setAuthor(`${t_type.length > 12 ? t_type.substring(0, 12) + ".." : t_type} Ticket for ${interaction.user.tag}`, client.user.displayAvatarURL())
                              .setThumbnail(interaction.user.displayAvatarURL())
                              .setDescription(`**Greetings:**\n${data.OpenMsg || `Welcome to your support ticket! Please describe what you need!`}`)
                              .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
                        

                          const row = new MessageActionRow()
                              .addComponents([
                                  new MessageButton()
                                  .setLabel(`Delete`)
                                .setEmoji(`1057075936090148884`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`tc_close${s}`),
                                  new MessageButton()
                                  .setLabel(`Close`)
                                .setEmoji(`1057076159399075962`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`tc_archive${s}`),
                                  new MessageButton()
                                  .setLabel(`Claim`)
                                .setEmoji(`1057076835420213361`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`tc_claim${s}`),
                                  new MessageButton()
                                .setEmoji(`1057398972035125409`)
                                  .setStyle(`PRIMARY`)
                                  .setCustomId(`tc_setting${s}`)
                              ])
                        
                          channel.send({
                              content: `<@${interaction.user.id}> • <@&${data.Admin}>`,
                              embeds: [embed],
                              components: [row]
                          })


                          new db({
                              Guild: interaction.guild.id,
                              Opener: interaction.user.id,
                              Channel: channel.id,
                              Date: `<t:${x}:R> *(<t:${x}:F>)*`,
                              System: s,
                              Type: data.Type || `General`
                          }).save()
                      })
                  }
              })
          })
      })
  } if(interaction.customId == `add_reason${s}`) {
        
    const modal = new Modal() // We create a Modal
.setCustomId(`ticket-reason-modal${s}`)
.setTitle(`Add a reason to the Ticket`)
.addComponents([
  new TextInputComponent() // We create a Text Input Component
  .setCustomId(`tc_reason${s}`)
  .setLabel('What is the reason of opening this ticket?')
  .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
  .setMinLength(5)
  .setMaxLength(700)
  .setPlaceholder('Type your Reason here...')
  .setRequired(true) // If it's required or not
]);
      
    showModal(modal, {
      client: client, // Client to show the Modal through the Discord API.
      interaction: interaction // Show the modal with interaction data.
    })
  }
  if (interaction.customId == `tc_close${s}`) {
      if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `<:leaf:1063543950700449802> Sorry, you reached your cooldown of **${msToTime(timeLeft.toString())}**`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          const emd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket not found in Database!`)
        .setDescription(`But you can manually delete this ticket`)
        
          if (!data_) return interaction.reply({
              embeds: [emd],
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);


          db1.findOne({
              Guild: interaction.guild.id,
              System: s
          }, async(err, data) => {
              if (!data) return;
const opener = await client.users.cache.get(data_.Opener);
            if(!opener) {
              mentions = `<@&${data.Admin}>`
            } else {
              mentions = `${opener}`
            }
            

              const emb = new MessageEmbed()
            .setColor(`DARK_RED`)
            .setTitle(`${client.emoji.wrong} You cant manage this ticket!`)
            .setDescription(`But you can **<:audit_profile:1062837198522683453> Mention** someone to delete it for you!`)

            const row = new MessageActionRow()
            .addComponents([
              new MessageButton()
                      .setLabel(`Mention`)
                    .setEmoji(`1062837198522683453`)
                      .setStyle(`SECONDARY`)
                      .setCustomId(`mention${s}`),
            ])

              if (!interaction.member.roles.cache.has(data.Admin)) return interaction.reply({
                  embeds: [emb],
                  components: [row],
                  ephemeral: true,
              })

            const f = await transcriptCreate(interaction.channel);



              const embed = new MessageEmbed()
                  .setColor(`GREEN`)
                  .setAuthor(`${interaction.user.tag} - Deleting Ticket`, interaction.user.displayAvatarURL())
                  .setDescription(`*Deleting the ticket in 3 seconds...*`)
                  .addField(`**Ticket Opener:**`, `<@${opener.id}> | \`${opener.id}\` / *\`${opener.id}\`*`)
                  .addField(`**Action Taken:**`, `Deleted Ticket | \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`)
                  .addField(`**Ticket Creation:**`, `${data_.Date}`)
                  .addField(`**Ticket Type:**`, `${data.Type || `General`}`)
                  .setFooter(client.config.embed.footer, client.user.displayAvatarURL())

              const embed_user = new MessageEmbed()
                  .setColor(`GREEN`)
                  .setAuthor(`${interaction.user.tag} - Deleted Ticket`, interaction.user.displayAvatarURL())
                  .addField(`**Ticket Opener:**`, `<@${opener.id}> | \`${opener.id}\` / *\`${opener.tag}\`*`)
                  .addField(`**Action Taken:**`, `Deleted Ticket | \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`)
                  .addField(`**Ticket Creation:**`, `${data_.Date}`)
                  .addField(`**Ticket Type:**`, `${data.Type || `General`}`)
                  .setFooter(client.config.embed.footer, client.user.displayAvatarURL())




              interaction.reply({
                  embeds: [embed]
              })
              opener.send({
                  embeds: [embed_user],
                  files: [f]
              }).catch((e) => {})

              data_.delete()

              await wait(3000)
              interaction.channel.delete()

              if (logs) {
                  const ch = await interaction.guild.channels.cache.get(logs);
                  if (!ch) return;
                  ch.send({
                      content: `>>> **<:info:1057074238462378154> Ticket Channel info:**\n <#${interaction.channel.id}> | \`${interaction.channel.id}\` / *\`${interaction.channel.name}\`*\n**<:mention:1057365803785265172> Action taken at:**\n <t:${Math.floor((Date.now()) / 1000)}:R> *(<t:${Math.floor((Date.now()) / 1000)}:F>)*`,
                      embeds: [embed_user],
                      files: [f]
                  })
              }
          })
      })

  }
  if (interaction.customId == `tc_claim${s}`) {
      if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `<:leaf:1063543950700449802> Sorry, you reached your cooldown of **${msToTime(timeLeft.toString())}**`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          const emd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket not found in Database!`)
        .setDescription(`But you can manually delete this ticket`)
        
          if (!data_) return interaction.reply({
              embeds: [emd],
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);


          db1.findOne({
              Guild: interaction.guild.id,
              System: s
          }, async(err, data) => {
              if (!data) return;

              const emb = new MessageEmbed()
            .setColor(`DARK_RED`)
            .setTitle(`${client.emoji.wrong} You cant manage this ticket!`)
            .setDescription(`Role needed to manage: <@&${data.Admin}>`)

            const emb2 = new MessageEmbed()
            .setColor(`DARK_RED`)
            .setTitle(`${client.emoji.wrong} You cant claim your own ticket!`)

            if (interaction.user == opener) return interaction.reply({
                  embeds: [emb2],
                  ephemeral: true
              })

              if (!interaction.member.roles.cache.has(data.Admin)) return interaction.reply({
                  embeds: [emb],
                  ephemeral: true
              })
              db2.findOne({
                  Guild: interaction.guild.id,
                  Channel: interaction.channel.id,
                  Claimer: interaction.user.id
              }, async(err, data_1) => {
                  if (!data_1) {
                      new db2({
                          Guild: interaction.guild.id,
                          Claimer: interaction.user.id,
                          Channel: interaction.channel.id
                      }).save()
                      const embed = new MessageEmbed()
                          .setColor(`WHITE`)
                          .setAuthor(`${interaction.user.tag} - Claimed Ticket`, interaction.user.displayAvatarURL())
                          .setDescription(`<@${interaction.user.id}> *Claimed this ticket!*`)
                          .setFooter(client.config.embed.footer, client.user.displayAvatarURL())


                      interaction.reply({
                          embeds: [embed]
                      })
                  } else {

                      claimer = data_1.Claimer || null;

                    const enmd = new MessageEmbed()
                    .setColor(`DARK_RED`)
                    .setTitle(`${client.emoji.wrong} You already claimed the ticket!`)
                    
                      if (interaction.user.id == claimer) return interaction.reply({
                          embeds: [enmd],
                          ephemeral: true
                      })

                  }
              })
          })
      })
  }
  if (interaction.customId == `tc_archive${s}`) {
      if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `<:leaf:1063543950700449802> Sorry, you reached your cooldown of **${msToTime(timeLeft.toString())}**`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          const emd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket not found in Database!`)
        .setDescription(`But you can manually delete this ticket`)
        
          if (!data_) return interaction.reply({
              embeds: [emd],
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);

          const embedd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket opener isn't found in server!`)

        if (!opener) return interaction.reply({
              embeds: [embedd],
              ephemeral: true
          })


          db1.findOne({
              Guild: interaction.guild.id,
              System: s
          }, async(err, data) => {
              if (!data) return;

              const emb = new MessageEmbed()
            .setColor(`DARK_RED`)
            .setTitle(`${client.emoji.wrong} You cant manage this ticket!`)
            .setDescription(`Role needed to manage: <@&${data.Admin}>`)

              if (!interaction.member.roles.cache.has(data.Admin)) return interaction.reply({
                  embeds: [emb],
                  ephemeral: true
              })

              const f = await discordTranscripts.createTranscript(interaction.channel,{
              returnType: 'attachment', 
              fileName: `${interaction.channel.name}-transcript.html`, 
              minify: true, 
              });

              interaction.channel.permissionOverwrites.edit(data.Admin, {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true,
              })
              interaction.channel.permissionOverwrites.edit(opener.id, {
                  SEND_MESSAGES: false,
                  VIEW_CHANNEL: false,
              })

              const embed = new MessageEmbed()
                  .setColor(`DARK_GREEN`)
                  .setAuthor(`${interaction.user.tag} - Closed Ticket`, interaction.user.displayAvatarURL())
                  .addField(`**Ticket Opener:**`, `<@${opener.id}> | \`${opener.id}\` / *\`${opener.tag}\`*`)
                  .addField(`**Action Taken:**`, `Locked Ticket | \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`)
                  .addField(`**Ticket Creation:**`, `${data_.Date}`)
                  .addField(`**Ticket Type:**`, `${data.Type || `General`}`)
                  .setFooter(client.config.embed.footer, client.user.displayAvatarURL())

            

              const row = new MessageActionRow()
                  .addComponents([
                      new MessageButton()
                      .setLabel(`Delete`)
                    .setEmoji(`1057075936090148884`)
                      .setStyle(`SECONDARY`)
                      .setCustomId(`tc_close${s}`),
                      new MessageButton()
                      .setLabel(`Reopen`)
                    .setEmoji(`1057078563301494814`)
                      .setStyle(`SECONDARY`)
                      .setCustomId(`tc_unarchive${s}`),
                      new MessageButton()
                      .setLabel(`Claim`)
                    .setEmoji(`1057076835420213361`)
                      .setStyle(`SECONDARY`)
                      .setCustomId(`tc_claim${s}`),
                                  new MessageButton()
                                .setEmoji(`1057398972035125409`)
                                  .setStyle(`PRIMARY`)
                                  .setCustomId(`tc_setting${s}`)
                  ])

              interaction.message.edit({
                  components: [row]
              })

              interaction.reply({
                  embeds: [embed],
                  files: [f]
              })
              opener.send({
                  embeds: [embed],
                  files: [f]
              }).catch((e) => {
                  interaction.channel.send({
                      embeds: [new MessageEmbed().setColor(`DARK_RED`).setTitle(`${client.emoji.wrong} Failed to DM Transcript to \`${opener.tag}\``)]
                  })
              })

              if (logs) {
                  const ch = await interaction.guild.channels.cache.get(logs);
                  if (!ch) return;
                  ch.send({
                      content: `>>> **<:info:1057074238462378154> Ticket Channel info:**\n <#${interaction.channel.id}> | \`${interaction.channel.id}\` / *\`${interaction.channel.name}\`*\n**<:mention:1057365803785265172> Action taken at:**\n <t:${Math.floor((Date.now()) / 1000)}:R> *(<t:${Math.floor((Date.now()) / 1000)}:F>)*`,
                      embeds: [embed],
                      files: [f]
                  })
              }
          })
      })

  }
  if (interaction.customId == `tc_unarchive${s}`) {
      if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `<:leaf:1063543950700449802> Sorry, you reached your cooldown of **${msToTime(timeLeft.toString())}**`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          const emd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket not found in Database!`)
        .setDescription(`But you can manually delete this ticket`)
        
          if (!data_) return interaction.reply({
              embeds: [emd],
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);

          const embedd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket opener isn't found in server!`)

        if (!opener) return interaction.reply({
              embeds: [embedd],
              ephemeral: true
          })


          db1.findOne({
              Guild: interaction.guild.id,
              System: s
          }, async(err, data) => {
              if (!data) return;

              const emb = new MessageEmbed()
            .setColor(`DARK_RED`)
            .setTitle(`${client.emoji.wrong} You cant manage this ticket!`)
            .setDescription(`Role needed to manage: <@&${data.Admin}>`)

              if (!interaction.member.roles.cache.has(data.Admin)) return interaction.reply({
                  embeds: [emb],
                  ephemeral: true
              })




              const f = await discordTranscripts.createTranscript(interaction.channel,{
              returnType: 'attachment', 
              fileName: `${interaction.channel.name}-transcript.html`, 
              minify: true, 
              });

              interaction.channel.permissionOverwrites.edit(data.Admin, {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true,
              })
              interaction.channel.permissionOverwrites.edit(opener.id, {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true,
              })

              const embed = new MessageEmbed()
                  .setColor(`DARK_GREEN`)
                  .setAuthor(`${interaction.user.tag} - Reopened Ticket`, interaction.user.displayAvatarURL())
                  .addField(`**Ticket Opener:**`, `<@${opener.id}> | \`${opener.id}\` / *\`${opener.tag}\`*`)
                  .addField(`**Action Taken:**`, `Un-Locked Ticket | \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`)
                  .addField(`**Ticket Creation:**`, `${data_.Date}`)
                  .addField(`**Ticket Type:**`, `${data.Type || `General`}`)
                  .setFooter(client.config.embed.footer, client.user.displayAvatarURL())

            

             const row = new MessageActionRow()
                  .addComponents([
                      new MessageButton()
                      .setLabel(`Delete`)
                    .setEmoji(`1057075936090148884`)
                      .setStyle(`SECONDARY`)
                      .setCustomId(`tc_close${s}`),
                      new MessageButton()
                      .setLabel(`Close`)
                    .setEmoji(`1057076159399075962`)
                      .setStyle(`SECONDARY`)
                      .setCustomId(`tc_archive${s}`),
                      new MessageButton()
                      .setLabel(`Claim`)
                    .setEmoji(`1057076835420213361`)
                      .setStyle(`SECONDARY`)
                      .setCustomId(`tc_claim${s}`),
                                  new MessageButton()
                                .setEmoji(`1057398972035125409`)
                                  .setStyle(`PRIMARY`)
                                  .setCustomId(`tc_setting${s}`)
                  ])

              interaction.message.edit({
                  components: [row]
              })

              interaction.reply({
                  embeds: [embed],
                  files: [f]
              })
              opener.send({
                  embeds: [embed],
                  files: [f]
              }).catch((e) => {
                  interaction.channel.send({
                      embeds: [new MessageEmbed().setColor(`DARK_RED`).setTitle(`${client.emoji.wrong} Failed to DM Transcript to \`${opener.tag}\``)]
                  })
              })

              if (logs) {
                  const ch = await interaction.guild.channels.cache.get(logs);
                  if (!ch) return;
                  ch.send({
                      content: `>>> **<:info:1057074238462378154> Ticket Channel info:**\n <#${interaction.channel.id}> | \`${interaction.channel.id}\` / *\`${interaction.channel.name}\`*\n**<:mention:1057365803785265172> Action taken at:**\n <t:${Math.floor((Date.now()) / 1000)}:R> *(<t:${Math.floor((Date.now()) / 1000)}:F>)*`,
                      embeds: [embed],
                      files: [f]
                  })
              }
          })
      })

  }
  if(interaction.customId == `mention${s}`) {
    if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `<:leaf:1063543950700449802> Sorry, you reached your cooldown of **${msToTime(timeLeft.toString())}**`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          const emd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket not found in Database!`)
        .setDescription(`But you can manually delete this ticket`)
        
          if (!data_) return interaction.reply({
              embeds: [emd],
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);


          db1.findOne({
              Guild: interaction.guild.id,
              System: s,
          }, async(err, data) => {
              
            
            
            db2.findOne({
                  Guild: interaction.guild.id,
                  Channel: interaction.channel.id
              }, async(err, data_1) => {

              db4.findOne({
                  Guild: interaction.guild.id,
                  Channel: interaction.channel.id
              }, async(err, data_2) => {


            if(!data_1) {
              mentions = `someone if there isnt a claimer`
            } else {
              mentions = `<@${data_1.Claimer}>`
            }
            

              const emb = new MessageEmbed()
            .setColor(`DARK_RED`)
            .setTitle(`${client.emoji.wrong} You cant mention again!`)
            .setDescription(`You cant mention someone again`)

            
             const embb = new MessageEmbed()
            .setColor(`DARK_RED`)
            .setTitle(`${client.emoji.wrong} You cant mention nobody!`)
            .setDescription(`You cant mention ${mentions}`)
            

              if(!data_1) {
                return interaction.reply({
                  embeds: [embb],
                  ephemeral: true,
              })
              } else if(!data_2) {
                interaction.reply({
                  content: `\\🚨 ${mentions}, ***${interaction.user.tag}*** requests for this ticket to be deleted.`,
              })
              } else if(data_2) {
                interaction.reply({
                  embeds: [emb],
                  ephemeral: true,
              })
              }

              if (!data_2) {
                      new db4({
                          Guild: interaction.guild.id,
                          Channel: interaction.channel.id,
                          Mention: interaction.user.id,
                      }).save()
              } 
            })
            })
          })
      })

  } 
  if(interaction.customId == `tc_setting${s}`) {
    if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `<:leaf:1063543950700449802> Sorry, you reached your cooldown of **${msToTime(timeLeft.toString())}**`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          const emd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket not found in Database!`)
        .setDescription(`But you can manually delete this ticket`)
        
          if (!data_) return interaction.reply({
              embeds: [emd],
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);


          db1.findOne({
              Guild: interaction.guild.id,
              System: s,
          }, async(err, data) => {
              
            
            
            db2.findOne({
                  Guild: interaction.guild.id,
                  Channel: interaction.channel.id
              }, async(err, data_1) => {

              db4.findOne({
                  Guild: interaction.guild.id,
                  Channel: interaction.channel.id
              }, async(err, data_2) => {

                const opener = await client.users.cache.get(data_.Opener);

          const embedd = new MessageEmbed()
        .setColor(`DARK_RED`)
        .setTitle(`${client.emoji.wrong} Ticket opener isn't found in server!`)

        if (!opener) return interaction.reply({
              embeds: [embedd],
              ephemeral: true
          })

                if(!data_1) {
                  claimer = `Nobody yet`
                } else {
                  claimer = `<@${data_1.Claimer}>`
                }

                const embed = new MessageEmbed()
                .setTitle(`Ticket Information : \`${interaction.channel.name}\``)
                .setColor(`PURPLE`)
                .setDescription(`**Tip:** *If you aren't staff, press the "delete" button and then press "mention" button if you want to notify the ticket claimer to close your ticket.*`)
                .addFields([
                  { name: `**Ticket opener:**`, value: `<@${opener.id}>` },
                  { name: `**Ticket creation:**`, value: `${data_.Date}` },
                  { name: `**Ticket type:**`, value: `${data.Type || `General`}` },
                  { name: `**Ticket claimer:**`, value: `${claimer}` },
                ])

                

                interaction.reply({
              embeds: [embed],
              ephemeral: true
          })
    })
            })
          })
      })
  }
})

client.on('modalSubmit', async (modal, interaction) => {

  await modal.deferReply({ ephemeral: true });
let systemnum = modal.customId;
      let s = systemnum.match(/\d/g)
      if(s == null) return;
      s = s.join("")
  
  if(modal.customId === `ticket-edit-modal${s}`) {
    
    const desc = modal.getTextInputValue(`tcp_desc${s}`)
    const button = modal.getTextInputValue(`tcp_button${s}`)
    const openmsg = modal.getTextInputValue(`tcp_openmsg${s}`)
    const image1 = modal.getTextInputValue(`tcp_image1${s}`)


    

    db1.findOneAndUpdate({
      Guild: modal.guild.id,
      System: s
    }, {
      TButton: button,
      TDesc: desc,
      OpenMsg: openmsg,

    }).then(async()=> {
      modal.editReply({
                  content: `${client.emoji.correct} **Edited the Ticket setup!**`,
                  ephemeral: true
              })
    })

    db1.findOne({
      Guild: modal.guild.id,
      System: s
    }, async(err, data) => {
      const mid = data.TMessage
      const chid = data.TChannel

      const emimage = new MessageEmbed()
      .setColor(`${client.config.color.main}`)
      
      if(image1 && image1.endsWith(typesimage)) {
        emimage.setImage(image1)
      } else if(image1 && image1.endsWith(`.gif`)) {
        emimage.setImage(image1)
      }

      const embed = new MessageEmbed()
      .setColor(`${client.config.color.main}`)
      .setTitle(`**Open a Ticket in \`${modal.guild.name}\`**`)
      .setDescription(`${desc.split("+n+").join("\n")}`)
      .setFooter(`Press the Button below to open a ticket`, modal.guild.iconURL())

      const row = new MessageActionRow()
      .addComponents([
        new MessageButton()
        .setLabel(button)
        .setStyle(`SECONDARY`)
        .setEmoji(`1057071742172016781`)
        .setCustomId(`create_ticket${s}`),
        new MessageButton()
        .setStyle(`SECONDARY`)
        .setEmoji(`1057071228969553980`)
        .setCustomId(`edit_ticket${s}`)
      ])
      
      client.channels.cache.get(chid).messages.fetch(mid).then(async(m)=>{
        if(image1 && image1.endsWith(typesimage)) {
          m.edit({ embeds: [emimage, embed], components: [row] })
        } else if(image1 && image1.endsWith(`.gif`)) {
          m.edit({ embeds: [emimage, embed], components: [row] })
        } else {
          m.edit({ embeds: [embed], components: [row] })
        }
      })
    })
  } else if(modal.customId === `ticket-reason-modal${s}`) {
    const reason = modal.getTextInputValue(`tc_reason${s}`)
opener = modal.user.id;
        let x = dayjs(new Date()).unix()
        db1.findOne({
              Guild: modal.guild.id,
              System: s
            }, async(err, data) => {
              if(!data) return;

        modal.guild.channels.create(`${data.Style||`ticket-`}${modal.user.username}`, {
                  permissionOverwrites: [{
                      id: modal.user.id,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                  }, {
                      id: data.Admin,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                  }, {
                      id: modal.guild.roles.everyone,
                      deny: ["VIEW_CHANNEL"]
                  }],
                  type: 'text',
                  parent: data.Category,
                  topic: `📨 Ticket for: \`${modal.user.tag}\` / *\`(${modal.user.id})\`*`
              }).catch(async(e) => {

              console.log(e)

                const ee = new MessageEmbed()
                .setColor(`DARK_RED`)
                .setTitle(`${client.emoji.wrong} An error occured while opening your ticket!`)
                .setDescription(`\`\`\`\n${e}\n\`\`\``)
                
              return modal.editReply({
                  embeds: [ee],
                  ephemeral: true
              })
          }).then(async function(channel) {

              db.findOne({
                  Guild: modal.guild.id,
                  Opener: modal.user.id,
                  Type: data.Type || `General`
              }, async(err, data_) => {


                  if (data_) {
                      const check = await modal.guild.channels.cache.get(data_.Channel);
                      if (!check) {
                          data_.delete();
                        const eme = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`<:ghost:1063227719929823322> Seems your channel was deleted manually... *clearing your Database*\n _Click the button again to open your ticket_`)
                          modal.editReply({
                              embeds: [eme],
                              ephemeral: true
                          });
                      } else {
                        const eeem = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`${client.emoji.wrong} You already have a Ticket opened at <#${data_.Channel}>!`)
                          modal.editReply({
                              embeds: [eeem],
                              ephemeral: true
                          });
                      }
                      channel.delete()
                  } else {
                      db1.findOne({
                          Guild: modal.guild.id,
                          System: s
                      }, async(err, data_1) => {
                          if (!data_1) return;
                        const eee = new MessageEmbed()
        .setColor(`GREEN`)
        .setDescription(`${client.emoji.correct} **Successfuly Created your ticket in <#${channel.id}>** \n _Ticket type:_ **${data.Type||`General`}**`)
                          modal.editReply({
                              embeds: [eee],
                              ephemeral: true
                          })
                        
let t_type = data.Type||`General`;
                        
                          const embed = new MessageEmbed()
                              .setColor(`${theme}`)
                              .setAuthor(`${t_type.length > 12 ? t_type.substring(0, 12) + ".." : t_type} Ticket for ${modal.user.tag}`, client.user.displayAvatarURL())
                              .setThumbnail(modal.user.displayAvatarURL())
                              .setDescription(`**Greetings:**\n${data.OpenMsg || `Welcome to your support ticket! Please describe what you need!`}\n\n**Ticket reason:**\n${reason}`)
                              .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
                        

                          const row = new MessageActionRow()
                              .addComponents([
                                  new MessageButton()
                                  .setLabel(`Delete`)
                                .setEmoji(`1057075936090148884`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`tc_close${s}`),
                                  new MessageButton()
                                  .setLabel(`Close`)
                                .setEmoji(`1057076159399075962`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`tc_archive${s}`),
                                  new MessageButton()
                                  .setLabel(`Claim`)
                                .setEmoji(`1057076835420213361`)
                                  .setStyle(`SECONDARY`)
                                  .setCustomId(`tc_claim${s}`),
                                  new MessageButton()
                                .setEmoji(`1057398972035125409`)
                                  .setStyle(`PRIMARY`)
                                  .setCustomId(`tc_setting${s}`)
                              ])

                          channel.send({
                              content: `<@${modal.user.id}> • <@&${data.Admin}>`,
                              embeds: [embed],
                              components: [row]
                          })


                          new db({
                              Guild: modal.guild.id,
                              Opener: modal.user.id,
                              Channel: channel.id,
                              Date: `<t:${x}:R> *(<t:${x}:F>)*`,
                              System: s,
                              Type: data.Type || `General`
                          }).save()
                      })
                  }
              })
          })
      })
  }
})
})

async function transcriptCreate(channel) {
  if(!channel) return;
  return discordTranscripts.createTranscript(channel,{
  returnType: 'attachment', 
  fileName: `${channel.name}.html`, 
  minify: true, 
});
}