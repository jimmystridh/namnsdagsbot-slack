const SlackWebhook = require('slack-webhook')
require('dotenv').config()

const nameDays = require('./nameDays.json')
const nameToUsersMap = require('./nameToUsersMap.json')

const slack = new SlackWebhook(process.env.WEBHOOK_URL, {
  defaults: {
    username: process.env.BOT_USERNAME,
    channel: process.env.BOT_CHANNEL,
    icon_emoji: process.env.BOT_ICON_EMOJI
  }
})

const pad = (number) => number < 10 ? '0' + number : number

const todayDate = new Date()
const todayDateString = `${pad(todayDate.getMonth() + 1)}-${pad(todayDate.getDate())}`
const todayNameDayNames = nameDays.find(day => day.date === todayDateString).nameDay

todayNameDayNames.forEach(name => {
  const todayNameDayUsers = nameToUsersMap[name.toLowerCase()]
  if (todayNameDayUsers) {
    const mentioned = todayNameDayUsers.map((u) => '@' + u)
    const commandSeparatedGreeting = mentioned.join(', ')

    const gratz = `Idag gratulerar vi ${commandSeparatedGreeting} på ${name}-dagen :cake:`
    console.log(gratz)
    slack.send(gratz)
  }
})