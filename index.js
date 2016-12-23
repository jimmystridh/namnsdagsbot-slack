const todayDate = new Date()
const year = todayDate.getFullYear()
const days = require(`./${year}.json`) //from http://api.dryg.net/dagar/v2.1/2016
const namnsdagar = require('./namnsdagar.json')
require('dotenv').config()
const SlackWebhook = require('slack-webhook')
const slack = new SlackWebhook(process.env.WEBHOOK_URL, {
  defaults: {
    username: process.env.BOT_USERNAME,
    channel: process.env.BOT_CHANNEL,
    icon_emoji: process.env.BOT_ICON_EMOJI
  }
})

const pad = (number) => number < 10 ? '0' + number : number

const today = `${todayDate.getFullYear()}-${pad(todayDate.getMonth() + 1)}-${pad(todayDate.getDate())}`

const todayNamnsdagar = days.dagar.find(((day) => day.datum == today)).namnsdag

todayNamnsdagar.forEach((name) => {
    const today = namnsdagar[name.toLowerCase()]
    if(today) {
            today.forEach((user) => {
            console.log(`Idag gratulerar vi @${user} på ${name}-dagen :cake:`)
            slack.send(`Idag gratulerar vi @${user} på ${name}-dagen :cake:`)
        })
    }
})