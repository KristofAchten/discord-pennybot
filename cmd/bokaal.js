module.exports = {
    name: 'bokaal',
    description: 'This command will transfer a message to de bokaal on slack.',
    execute(message, args) {
        const teamPennyRole = '778301465109856257'

        if (!message.member.roles.cache.has(teamPennyRole)) {
            message.channel.send("Only members with the TeamPenny-role can send messages to de bokaal.")
        } else {
            let nickname = message.member.nickname
            let username = message.member.user.username
            let name = nickname === null ? username : nickname

            postToSlack(message, args.join(' '), name)
        }
    }
}

const hook = require("../private.js").slack_hook

function postToSlack(origMsg, message, user) {

    if (message && !message.trim()) {
        origMsg.channel.send(`Thanks ${user}, transferring your message to de bokaal!`)
        const axios = require('axios')

        msg = `${user} verzond volgend bericht vanaf Discord: ${message}`
        axios.post(hook, {
            text: msg
        })
    } else {
        origMsg.channel.send(`You seem to be sending... nothing, ${user}? Not transferring your message.`)
    }

}