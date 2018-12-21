const Discord = require("discord.js");
const fetch = require('node-fetch');
const client = new Discord.Client({
  autoReconnect: true
});
const config = require("./config.json");
const allowedChannelIds = ["525624983972478976", "519915583429541918"]; //519915583429541918 is baines test channel on his server


client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  if (allowedChannelIds.indexOf(message.channel.id) === -1) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'secret' && args.length == 1) {
    // message.channel.send('you tried secrets!!');
    processSecret(args[0], message.author, message);
  } 
});

client.on("error", (e) => console.error(e));
client.login(config.token);

function processSecret(secret, user, message) {

  const params = {};
  params.key = secret;
  params.username = user.id;

  fetch(`${config.apiEndpoint}?key=${params.key}&username=${params.username}`, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
      let resStatus = json.status;

      if(resStatus == 0) {
        processUser(message);
      }
    });
}

function processUser(message){

   let addRole = message.guild.roles.find(r => r.name === "Just Joined");
   message.member.setRoles([addRole]).catch(console.error);
   
}
//https://discordapp.com/oauth2/authorize?client_id=524960920775163915&scope=bot&permissions=268511232
//perms int 268511232