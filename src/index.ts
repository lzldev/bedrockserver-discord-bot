import 'dotenv/config'
import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import { getGuildIds, validateEnv } from './utils'

import { commands } from './commands'

validateEnv()

const l = console.log
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once(Events.ClientReady, (readyClient) => {
  l(`Logged in as ${readyClient.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
})

client.on(Events.Error, (error) => {
  console.error(error)
})

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) {
    return
  } else if (message.content.toLowerCase() !== 'hi') {
    return
  }

  await message.channel.send('HI!!!!')
})

client.login(process.env.DISCORD_TOKEN)

const guildIds = getGuildIds()!

const rest = new REST().setToken(process.env.DISCORD_TOKEN!)

console.log(`Command GUILD IDS ${guildIds}`)
;(async () => {
  console.log(
    `Started refreshing ${commands.size} application (/) commands. in ${guildIds?.length} Guilds.`,
  )

  const parsedCommands = Array.from(commands.values()).map((command) =>
    command.data.toJSON(),
  )

  guildIds?.forEach(async (guildId) => {
    const clientId = process.env['APP_ID']!
    const gid = String(guildId)

    const data = (await rest.put(
      Routes.applicationGuildCommands(clientId, gid),
      {
        body: parsedCommands,
      },
    )) as any[]

    if (!data) {
      console.error(data)
      return
    }

    console.log(
      `Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`,
    )
  })
})()
