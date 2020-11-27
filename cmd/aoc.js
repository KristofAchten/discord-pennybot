module.exports = {
    name: 'aoc',
    description: `Params: <day> (<year>)\nThis command will post the advent of code challenge for a given day/year. If year is not provided, the last active year will be used.`,
    async execute(message, args) {
        if (args.length === 0) {
            message.channel.send(`Please provide the day (and optionally the year) of the challenge you want to view as a parameter for this command.`)
        } else {
            const years = await getYears()
            const challenges = []

            for (i = 1; i <= 24; i++) {
                challenges.push(i.toString(10))
            } 
    
            providedDay = args.shift()
            providedYear = args.length === 0 ? years[0] : args.shift()
    
            if (!challenges.includes(providedDay) || !years.includes(providedYear)) {
                message.channel.send(`The provided day/year for this challenge is invalid! Please try again.`)
            } else {
                postChallenge(message, providedDay, providedYear)
            }
        }
    }
}

const axios = require('axios')
const cheerio = require('cheerio');
const Discord = require('discord.js')

async function getYears() {
    res = []

    await axios.get('https://adventofcode.com/2019/events')
        .then((response) => {
            response.data
                .split('\n')
                .filter(w => w.includes('eventlist-event'))
                .forEach(w => res.push(w.substring(w.indexOf('[') + 1, w.indexOf(']'))))
        })
    return res
}

async function postChallenge(message, day, year) {
    let url = `https://adventofcode.com/${year}/day/${day}`
    let cont = true

    await axios.get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            res = $('article').contents().map(function() {
                return $(this).text() + ' '
            }).get().join('')
        }).catch(err => {
            if (err.response.status === 404) {
                message.channel.send(`This challenge has not yet unlocked. Try again later.`)
                cont = false
            }
        }).then(x => {
            if (cont) {
                postMessage(message, url, res, day, year)
            }
        })
}

function postMessage(message, url, text, day, year) {

    title = text.substring(text.indexOf(':') + 2, text.indexOf(' --- '))
    desc = text.substring(text.indexOf(' --- ') + 5, text.length)

    const embed = new Discord.MessageEmbed()

    .setColor('#f54b42')
    .setTitle(`AoC day ${day} of ${year}: ${title}`)
    .setURL(url)
    .setDescription(truncate(desc, 2048))
    .setImage('https://minapecheux.com/wp/wp-content/uploads/2019/12/advent_of_code_trees.png')
    .setTimestamp()
    .setFooter('Generated through ~aoc <day> (<year>)')

    message.channel.send(embed)
}

function truncate(str, len) {
    if(str.length <= len) {
        return str
    }

    return str.substring(0, len - 4) + '...'
}