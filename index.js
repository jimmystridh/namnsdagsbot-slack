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
const listToEnumerationText = list => list.length === 1
  ? list[0].toString()
  : `${list.slice(0, -1).join(', ')} och ${list[list.length - 1]}`

sendGratzToNameDayCelebrators()
sendReminderToUpcomingCelebrators()

function sendGratzToNameDayCelebrators() {
  const todayDate = new Date()
  const todayDateString = `${pad(todayDate.getMonth() + 1)}-${pad(todayDate.getDate())}`
  const nameDay = nameDays.find(day => day.date === todayDateString)
  if (!nameDay) return

  nameDay.names.forEach(name => {
    const todayNameDayUsers = nameToUsersMap[name.toLowerCase()]
    if (todayNameDayUsers) {
      const mentions = todayNameDayUsers.map(u => '@' + u)
      const mentionsEnumerated = listToEnumerationText(mentions)
      const gratz = `Idag gratulerar vi ${mentionsEnumerated} på ${name}-dagen :cake:`

      console.log(gratz)
      slack.send({ text: gratz, parse: 'full' })
    }
  })
}

function sendReminderToUpcomingCelebrators() {
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrowDateString = `${pad(tomorrowDate.getMonth() + 1)}-${pad(tomorrowDate.getDate())}`
  const nameDay = nameDays.find(day => day.date === tomorrowDateString)
  if (!nameDay) return

  nameDay.names.forEach(name => {
    const tomorrowNameDayUsers = nameToUsersMap[name.toLowerCase()]
    if (tomorrowNameDayUsers) {
      tomorrowNameDayUsers.forEach(u => {
        const mention = '@' + u
        const reminder = ':bell: Imorgon har du namnsdag! Du glömmer väl inte fika? :cake: ' +
          'Det är ju alltid uppskattat bland kollegorna :yum:'

        console.log(reminder)
        slack.send({ text: reminder, channel: mention })
      })
    }
  })
}

