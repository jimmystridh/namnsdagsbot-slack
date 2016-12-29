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

const pad = number => number < 10 ? '0' + number : number

const REMINDER_TEXT = ':bell: Imorgon har du namnsdag! Du glömmer väl inte fika? :cake: ' +
  'Det är ju alltid uppskattat bland kollegorna :yum:'

sendGratzToNameDayCelebrators()
sendReminderToUpcomingCelebrators()

function sendGratzToNameDayCelebrators() {
  const todayDate = new Date()
  const nameDay = getNameDayForDate(todayDate)
  if (!nameDay) return

  nameDay.names.forEach(name => {
    const todayNameDayUsers = nameToUsersMap[name.toLowerCase()]
    if (todayNameDayUsers) {
      const mentions = todayNameDayUsers.map(u => '@' + u)
      const mentionsText = listToEnumerationText(mentions)
      const gratz = `Idag gratulerar vi ${mentionsText} på ${name}-dagen :cake:`

      console.log(gratz)
      slack.send({ text: gratz, parse: 'full' })
    }
  })
}

function sendReminderToUpcomingCelebrators() {
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const nameDay = getNameDayForDate(tomorrowDate)
  if (!nameDay) return

  nameDay.names.forEach(name => {
    const tomorrowNameDayUsers = nameToUsersMap[name.toLowerCase()]
    if (tomorrowNameDayUsers) {
      tomorrowNameDayUsers.forEach(u => {
        const mention = '@' + u

        console.log(REMINDER_TEXT)
        slack.send({ text: REMINDER_TEXT, channel: mention })
      })
    }
  })
}

function getNameDayForDate(date) {
  const dateString = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return nameDays.find(day => day.date === dateString)
}

function listToEnumerationText(list) {
  if (list.length === 1) return list[0].toString()

  return `${list.slice(0, -1).join(', ')} och ${list[list.length - 1]}`
}
