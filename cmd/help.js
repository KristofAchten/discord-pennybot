module.exports = {
    name: 'help',
    description: 'This command will display this nifty help page.',
    execute(message, args) {
        const Discord = require('discord.js')
        const embed = new Discord.MessageEmbed()
        .setColor('#34ebcc')
        .setTitle('Command info')
        .setURL('https://www.youtube.com/watch?v=8ybW48rKBME')
        .setDescription('The following list of commands can be used with PennyBot on this server')
        .addFields(generateHelpFields())
        .setImage('https://i.kym-cdn.com/photos/images/original/001/895/960/b92.jpg')
        .setTimestamp()
        .setFooter('The command prefix is ~ (tilde).')

        message.channel.send(embed)
    }
}

function generateHelpFields() {
    helps = []

    const cmdFiles = require('fs').readdirSync('./cmd/').filter(f => f.endsWith('.js'))
    for (const f of cmdFiles) {
        const cmd = require(`./${f}`)
        helps.push({name: cmd.name, value: cmd.description})
    }

    return helps
}