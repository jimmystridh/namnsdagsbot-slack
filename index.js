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
const today = nameDays.find(day => day.date === todayDateString)
if (!today) return

today.nameDay.forEach(name => {
  const todayNameDayUsers = nameToUsersMap[name.toLowerCase()]
  if (todayNameDayUsers) {
    const mentions = todayNameDayUsers.map(u => '@' + u)
    const mentionsEnumerated = listToEnumerationText(mentions)
    const gratz = `Idag gratulerar vi ${mentionsEnumerated} på ${name}-dagen :cake:`

    console.log(gratz)
    slack.send(gratz)
  }
})

function listToEnumerationText(list) {
  if (list.length === 1) return list[0].toString()

  return `${list.slice(0, -1).join(', ')} och ${list[list.length - 1]}`
}