/*
type of requests - CREATE/REMOVE/LOGIN/CHECK
key 
adminPassword
ipv4

    ___________      ___   __  __________  _________   _______________________________  __________  ____ 
    / ____/__  /     /   | / / / /_  __/ / / / ____/ | / /_  __/  _/ ____/  _/ ____/   |/_  __/ __ \/ __ \
   / __/    / /     / /| |/ / / / / / / /_/ / __/ /  |/ / / /  / // /_   / // /   / /| | / / / / / / /_/ /
  / /___   / /__   / ___ / /_/ / / / / __  / /___/ /|  / / / _/ // __/ _/ // /___/ ___ |/ / / /_/ / _, _/ 
 /_____/  /____/  /_/  |_\____/ /_/ /_/ /_/_____/_/ |_/ /_/ /___/_/   /___/\____/_/  |_/_/  \____/_/ |_|  
                                                                                                          
---------------------------------------------------------*/
const db = require('quick.db')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require("../config.js")

const data = {
    "good": require('./good.json'),
    "good2": require('./good2.json'),
    "bad": require('./bad.json'),
    "bad2": require('./bad2.json')
}
//---------------------------------------------------------
client.login(config.token)
module.exports = (req, res) => {
    
        const {ip , key, tor, adminKey } = req.body
        if(!ip || !key) return console.log("-> Bad json request without ip/key")
        if(!tor == 'CREATE_KEY' || !tor ==  'DELETE_KEY' || !tor == 'CHECK_KEY' || !tor == 'LOGIN_KEY') {
            console.log('-> Bad json requests without options')
            return res.send('-> Bad json requests without options')
        }
        console.log(`--------------------------------------------------------------------------------------------------------------------\nIP: ${ip}\nREQUEST TYPE: ${tor}\nADMINKEY: ${adminKey}\nKEY: ${key}\n--------------------------------------------------------------------------------------------------------------------`)

        if(tor == "CREATE_KEY"){
            if(adminKey != config.adminKey) return console.log("-> Bad json requests without the good admin key")
            db.set(`key_${key}`, ip)
            res.send("Succefully create a key !")
            
            const embed = new Discord.MessageEmbed()
            .setTitle("Server ~:")
            .setColor("GREEN")
            .setDescription(`A key has created\`\`\`${key}\`\`\`This IPV4 is **${ip}**`)
            .setFooter("by Ezermoz")
            .setTimestamp()
client.channels.cache.get(config.sendID).send(embed);
            return
        }
        
        if(tor == "DELETE_KEY"){
            if(adminKey != config.adminKey) return console.log("-> Bad json requests without the good admin key")
            let value = db.fetch(`key_${key}`, ip)
            if(!value) return;
            res.send("Succefully delete a key !")

            const embed = new Discord.MessageEmbed()
            .setTitle("Server ~:")
            .setColor("GREEN")
            .setDescription(`A key has deleted\`\`\`${key}\`\`\`This IPV4 is **${value}**`)
            .setFooter("by Ezermoz")
            .setTimestamp()
client.channels.cache.get(config.sendID).send(embed);
            db.delete(`key_${key}`, ip)
            return
        }

        if(tor == "LOGIN_KEY"){
            const {ip , key, tor, adminKey } = req.body
            if(!ip || !key) return console.log("-> Bad json request without ip/key")
            if(tor != 'LOGIN_KEY') return
            if(adminKey != 'unknow') return
            let value = db.fetch(`key_${key}`)
            if(!value){ return res.json(data.bad2)}
            if(value != ip) return res.json(data.bad)

            const embed = new Discord.MessageEmbed()
            .setTitle("Server ~:")
            .setColor("GREEN")
            .setDescription(`A key has use for login\`\`\`${key}\`\`\`This IPV4 is **${value}**`)
            .setFooter("by Ezermoz")
            .setTimestamp()
client.channels.cache.get(config.sendID).send(embed);
            res.json(data.good)
            return
        }

        if(tor == "CHECK_KEY"){
            const {ip , key, tor, adminKey } = req.body
            if(tor != 'CHECK_KEY')
            if(!ip || !key) return console.log("-> Bad json request without ip/key")
            if(adminKey != config.adminKey) return
            let value = db.fetch(`key_${key}`)
            if(!value){ return res.json(data.bad2);}
            let fetchIPV4 = { ip: value, key: key }


            data.good2["main"] = fetchIPV4 ;
            res.json(data.good2)

            return
        }
}
  //made by ezermoz
  //inspirate is not skid
  //anti-skid