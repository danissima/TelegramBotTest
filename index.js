const TelegramBotApi = require('node-telegram-bot-api')
const { commandsNames } = require('./commands')
const BOT_TOKEN = '5383278457:AAEgm9Tp49R0TC6YI2DBKIxNBslUB6zLOjg'

const bot = new TelegramBotApi(BOT_TOKEN, { polling: true })

bot.setMyCommands([
  { command: commandsNames.start, description: 'Начать!' },
  { command: commandsNames.salary, description: 'Узнать актуальную зарплату программиста' }
])

bot.on('text', async (message) => {
  const { text } = message
  const chatId = message.chat.id

  /* START */
  if (text === commandsNames.start) {
    return bot.sendMessage(chatId, 'Прив')
  }

  /* SALARY */
  if (text === commandsNames.salary) {
    bot.sendMessage(chatId, 'Выбери свой уровень', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'junior', callback_data: 'junior' }, { text: 'middle', callback_data: 'middle' }, { text: 'senior', callback_data: 'senior' }, ]
        ]
      })
    })
  }
})

bot.on('callback_query', (message) => {
  const { data } = message
  const chatId = message.message.chat.id
  const days = daysInMonth(message.message.date * 1000)
  let totalSalary = days * 8

  if (data === 'junior') {
    totalSalary *= 175
  } else if (data === 'middle') {
    totalSalary *= 350
  } else if (data === 'senior') {
    totalSalary *= 500
  }

  return bot.sendMessage(chatId, `Зарплата для ${data} будет равна ${totalSalary.toLocaleString()} рублей в месяц`)
})

function daysInMonth(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return new Date(year, month, 0).getDate()
}