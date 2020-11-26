// Imports
const Discord = require('discord.js')
const fs = require('fs')

// App constants
const prefix = '~'
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Attach all command definitions
const cmdFiles = fs.readdirSync('./cmd/').filter(f => f.endsWith('.js'))
for (const f of cmdFiles) {
    const cmd = require(`./cmd/${f}`)
    client.commands.set(cmd.name, cmd)
}

// Init
client.once('ready', () => {
    console.log("PennyBot is ready for business.")
})

// Messagehandler
client.on('message', message => {
    if (!message.content.startsWith(prefix)) {
        return
    }

    const args = message.content.slice(prefix.length).split(' ')
    const command = args.shift().toLowerCase();

    handleCommand(message, command, args)
})

function handleCommand(message, command, args) {
    cmd = client.commands.get(command)
    if (cmd) {
        cmd.execute(message, args)
    }
}

// Login after initialization
console.log(require("./private.js"))
client.login(require("./private.js").login)

