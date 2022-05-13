/*
    ___________      ___   __  __________  _________   _______________________________  __________  ____ 
    / ____/__  /     /   | / / / /_  __/ / / / ____/ | / /_  __/  _/ ____/  _/ ____/   |/_  __/ __ \/ __ \
   / __/    / /     / /| |/ / / / / / / /_/ / __/ /  |/ / / /  / // /_   / // /   / /| | / / / / / / /_/ /
  / /___   / /__   / ___ / /_/ / / / / __  / /___/ /|  / / / _/ // __/ _/ // /___/ ___ |/ / / /_/ / _, _/ 
 /_____/  /____/  /_/  |_\____/ /_/ /_/ /_/_____/_/ |_/ /_/ /___/_/   /___/\____/_/  |_/_/  \____/_/ |_|  
   ___    ____ 
  |__ \  / __ \
  __/ / / / / /
 / __/_/ /_/ / 
/____(_)____/                                                                                           
---------------------------------------------------------*/
const Discord = require('discord.js')
const client = new Discord.Client()
const express = require('express')
const superagent = require('superagent');
const config = require("./config.js")
const rateLimit = require('express-rate-limit');
const code = require('./Routes/code');
//---------------------------------------------------------
var app = express();
var rand = require("generate-key");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 25,
    standardHeaders: true
});

app.use(limiter);
app.use(express.json({limit: "500mb"}));

app.post('/api/json', code);

app.listen(config['server-port'], () => {
	console.log(`Listening on port 2010`);
});
client.on('message', message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    if(!message.author.id === [config.author1]) return
        if(message.guild.id != config.guildID) return
            if(message.channel.id != config.channelID) return
                if(message.content.startsWith(config.prefix+'create')){
                var ip = args[1]
                adminKey = args[2]
                if(!ip){return message.channel.send('error: ip dont send')}
                if(!adminKey){return message.channel.send('error: admin key dont send')}
                if(adminKey != config.key4bot) {return message.channel.send("the admin token is not good :c")}
                var keyy = rand.generateKey(400);

                  const sltcv = new Discord.MessageEmbed()
                    .setTitle("Key in creation")
                    .setDescription(`<@${message.author.id}> create: \n\`\`\`${keyy}\`\`\``)
                    .setColor("BLACK")
                    .setFooter('by Ezermoz')
                  message.channel.send(sltcv)
                  message.channel.send(`**->** <#${config.sendID}>`)  

                const embed = new Discord.MessageEmbed()
                      .setTitle("Request to server...")
                      .setColor("BLACK")
                      .setDescription(`A new key is for waiting by <@${message.author.id}>\n\`\`\`${keyy}\`\`\`IPV4: **${ip}**`)
                      .setFooter("by Ezermoz")
                      .setTimestamp()
client.channels.cache.get(config.sendID).send(embed);

superagent
  .post(`http://${config.url}:${config['server-port']}/api/json`)
  .send({
    adminKey: config.adminKey,
    ip: ip,
    key: keyy,
    tor: 'CREATE_KEY'
  })
  .set('accept', 'json')
  .end((err, response) => {})
                }else{
                  if(message.content.startsWith(config.prefix+'delete')){
                    var key = args[1]
                    adminKey = args[2]
                    if(!key){return message.channel.send('error: key dont send')}
                    if(!adminKey){return message.channel.send('error: admin key dont send')}
                    if(adminKey != config.key4bot) {return message.channel.send("the admin token is not good :c")}
    
                      const sltcv = new Discord.MessageEmbed()
                        .setTitle("Pending deletion...")
                        .setDescription(`<@${message.author.id}> want to delete: \n\`\`\`${key}\`\`\``)
                        .setColor("BLACK")
                        .setFooter('by Ezermoz')
                      message.channel.send(sltcv)
                      message.channel.send(`**->** <#${config.sendID}>`)  
    
                    const embed = new Discord.MessageEmbed()
                          .setTitle("Request to server...")
                          .setColor("BLACK")
                          .setDescription(`A key is pending deletion by: <@${message.author.id}>\n\`\`\`${key}\`\`\``)
                          .setFooter("by Ezermoz")
                          .setTimestamp()
    client.channels.cache.get(config.sendID).send(embed);
    
    superagent
      .post(`http://${config.url}:${config['server-port']}/api/json`)
      .send({
        adminKey: config.adminKey,
        ip: "x",
        key: key,
        tor: 'DELETE_KEY'
      })
      .set('accept', 'json')
      .end((err, response) => {})
                  }
                }
                if(message.content.startsWith(config.prefix+'check')){
                  var key = args[1]
                  adminKey = args[2]
                  if(!key){return message.channel.send('error: key dont send')}
                  if(!adminKey){return message.channel.send('error: admin key dont send')}
                  if(adminKey != config.key4bot) {return message.channel.send("the admin token is not good :c")}
  
                    const sltcv = new Discord.MessageEmbed()
                      .setTitle("Pending check...")
                      .setDescription(`<@${message.author.id}> want to check key: \n\`\`\`${key}\`\`\``)
                      .setColor("BLACK")
                      .setFooter('by Ezermoz')
                    message.channel.send(sltcv)
                    message.channel.send(`**->**See Logs Here <#${config.sendID}>`)  
  
                  const embed = new Discord.MessageEmbed()
                        .setTitle("Request to server...")
                        .setColor("BLACK")
                        .setDescription(`A key is check by: <@${message.author.id}>\n\`\`\`${key}\`\`\``)
                        .setFooter("by Ezermoz")
                        .setTimestamp()
  client.channels.cache.get(config.sendID).send(embed);
  
  superagent
    .post(`http://${config.url}:${config['server-port']}/api/json`)
    .send({
      adminKey: config.adminKey,
      ip: "unknow",
      key: key,
      tor: 'CHECK_KEY'
    })
    .set('accept', 'json')
    .end((error, res) => {
      if(res.body.descriptions == "Sorry but the key is not in our database !") return message.channel.send(':x: **The key is not in the database !**')
      var ip = res.body.main.ip
      var key = res.body.main.key
      const embed = new Discord.MessageEmbed()
      .setTitle("Finnish!")
      .setColor("GREEN")
      .setDescription(`A key is check by: <@${message.author.id}>\n\`\`\`${key}\`\`\`This IPV4 is **${ip}**`)
      .setFooter("by Ezermoz")
      .setTimestamp()
message.channel.send(embed)
    });
  
  }   
})
client.login(config.token)
  //made by ezermoz
  //inspirate is not skid
  //anti-skid