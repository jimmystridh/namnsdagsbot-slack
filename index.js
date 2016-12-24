const SlackWebhook = require('slack-webhook')
require('dotenv').config()

const todayDate = new Date()
const year = todayDate.getFullYear()

const days = require(`./${year}.json`) //from http://api.dryg.net/dagar/v2.1/2016
const namesdays = require('./namnsdagar.json')

const slack = new SlackWebhook(process.env.WEBHOOK_URL, {
  defaults: {
    username: process.env.BOT_USERNAME,
    channel: process.env.BOT_CHANNEL,
    icon_emoji: process.env.BOT_ICON_EMOJI
  }
})

const pad = (number) => number < 10 ? '0' + number : number

const today = `${todayDate.getFullYear()}-${pad(todayDate.getMonth() + 1)}-${pad(todayDate.getDate())}`

const todayNamesdays = days.dagar.find(((day) => day.datum == today)).namnsdag

todayNamesdays.forEach((name) => {
  const todaysUsers = namesdays[name.toLowerCase()]
  if(todaysUsers) {
    const mentioned = todaysUsers.map((u) => '@' + u)
    const commandSeparatedGreeting = mentioned.join(', ')

    const gratz = `Idag gratulerar vi ${commandSeparatedGreeting} på ${name}-dagen :cake:`
    console.log(gratz)
    slack.send(gratz)
  }
})