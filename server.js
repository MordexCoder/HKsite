const express = require("express");
const app = express();
const TOKEN = process.env.TOKEN;
const http = require("http");
const fs = require("fs");
const Discord = require("discord.js");
const { Client, Attachment, MessageAttachment } = require("discord.js");
const {
  prefix,
  config,
  logo,
  site,
  logoWide,
  academyLink
} = require("./.config/config.json");
const { version } = require("./package.json");
var client = new Client();
client.commands = new Discord.Collection();
const invalidMessage = "Invalid message or command";
const help = new Discord.MessageEmbed()
  .setColor("#ed810e")
  .setURL("https://horny-kine.glitch.me/#")
  .setTitle("Command List")
  .setDescription(
    "**Type -help(command) for more information on the command.**"
  )
  .setThumbnail(logoWide)
  .addFields(
    {
      name: "**      -info **",
      value:
        ":small_orange_diamond:Shows information about the bot and server\n(type -help info for all the commands)."
    },
    {
      name: "**      -info server**",
      value: ":small_orange_diamond:shows information about the Horny Kine."
    },
    {
      name: "**        -avatar**",
      value: ":small_orange_diamond: now we get to see your ugly mug."
    },
    {
      name: "**        -points**",
      value: ":small_orange_diamond: points."
    },
    {
      name: "**        -site**",
      value: ":small_orange_diamond: Shows the HK site."
    }
  )
  .setTimestamp()
  .setFooter("provided by the Horny Kine.", logo);
const info = new Discord.MessageEmbed()
  .setColor("#ed810e")
  .setURL("http://discord.js.org/")
  .setTitle("Info Command List")
  .setThumbnail(logoWide)
  .addFields(
    {
      name: "**      -info server **",
      value: ":small_orange_diamond:Shows current information about the server."
    },
    {
      name: "**      -info version**",
      value: ":small_orange_diamond:says Regina's current version."
    },
    {
      /*name: "**        -avatar**",
    value: ":small_orange_diamond:shows information about the Horny Kine."*/
    }
  )
  .setTimestamp()
  .setFooter("provided by the Horny Kine.", logo);

client.on("ready", () => {
  client.user.setStatus("busy");
  client.user.setActivity("RIP Advent");
});
client.on("message", message => {
  if (message.content === "test") message.channel.send("response");
});
client.on("message", message => {
  var args = message.content.slice(prefix.length).split(/ +/);
  if (message.author.bot === true) return;
  switch (args[0]) {
    case "test":
      message.channel.send("response");
      break;
    case "site":
      message.channel.send(site);
      break;
    case "avatar":
      message.channel.send("Look at this snack <:kr0nk:710569052837380167>");
      message.channel.send(message.author.displayAvatarURL());
      break;
    case "info":
      switch (args[1]) {
        case "version":
          message.channel.send("Version " + version);
          break;
          const guild = Discord.guild(client, "668880975161196544");
          const members = guild.memberCount;
        case "server":
          const serverEmbed = new Discord.MessageEmbed()
            .setColor("#ed810e")
            .setTitle("Horny Kine")
            .setURL("https://discord.js.org/")
            .setAuthor(" ", "https://discord.js.org")
            .setDescription(
              "Official Discord server to advertise your NSFW art, animation and stories here!"
            )
            .setThumbnail(logo)
            .addFields(
              {
                name: "members",
                value: `${message.guild.memberCount} +  members`
              },
              {
                name: "Admin",
                value: "Mordex",
                inline: true
              },
              {
                name: "Moderator",
                value: "DroolingDemon",
                inline: true
              }
            )
            .addField("Moderator", "S to", true)
            .setImage(" ")
            .setTimestamp()
            .setFooter("Provided by the Horny Kine.", logo);
          message.channel.send(serverEmbed);
          break;
        case "academy":
          message.reply(
            "this is the current version of the Hentai Academy document: " +
              academyLink
          );
          break;
      }
      break;
    case "help":
      message.channel.send(help);
      break;
    case "help info":
      message.channel.send(info);
      break;
    case "points":
      message.channel.send(
        "Do i look like Mee6? Get TF out of here with that shit."
      );
    case "say":
      const usermsg = message.content.split(" ");
      client.channels.cache
        .find(channel => channel.name === "announcements")
        .send(usermsg.slice(1).join(" "));
      break;
    case "quiz":
      const filter = m => m.content.includes("discord");
      const collector = message.channel.createMessageCollector(filter, {
        time: 15000
      });

      collector.on("collect", m => {
        console.log(`Collected ${m.content}`);
      });

      collector.on("end", collected => {
        console.log(`Collected ${collected.size} items`);
      });
      const quiz = require("./quiz.json");
      const item = quiz[Math.floor(Math.random() * quiz.length)];
      const secondFilter = response => {
        return item.answers.some(
          answer => answer.toLowerCase() === response.content.toLowerCase()
        );
      };

      message.channel.send(item.question).then(() => {
        message.channel
          .awaitMessages(secondFilter, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(collected => {
            message.channel.send(
              `${collected.first().author} got the correct answer!`
            );
          })
          .catch(collected => {
            message.channel.send("Looks like nobody got the answer this time.");
          });
      });
      // make regina respond to "Alex, play" type messages
      if (message.content === "Regina, play")
      message.content.splice(0,1)
  }
  chResponse = () => {
    if (message.content)
      client.channels.cache
        .find(channel => channel.name === "comm-request")
        .send(
          "Don't forget to include budget, payment method and information about the commission!"
        )
        .then(message => {
          message.delete({ timeout: 60000 }).catch(console.error);
        });
  };
  if (message.author.bot) return;
  if (message.channel.id === "668886941927735302") chResponse();
});
const adTimeout = new Set();

client.on("message", message => {
  if (
    message.author.bot === true &&
    client.channels.cache.find(channel => channel.name === "social-handles")
  )
    return;
  if (message.content.includes("http://")) {
    if (adTimeout.has(message.author.id)) {
      message.reply("3 Hours has not past since the last time you posted!");
      message.delete();
    } else {
      adTimeout.add(message.author.id);
      setTimeout(() => {
        adTimeout.delete(message.author.id);
      }, 10800000);
    }
  }
});
//670971596202180619 bot-house ID

function serverInfo() {
  const guild = Discord.guild(client, "668880975161196544");
  var members = guild.memberCount
  document.getElementById("membs").innerHTML = members
}
app.use(express.static("public"));
app.get("/", (request, response) => {
  return response.send("Ping!");
});
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
/*const server = http.createServer(function(req, res){
  
  res.setHeader('Content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200);

  let dataObj = { id:123, name: "Bob"}
});
server.listen(8080);*/
console.log("bot is online");
