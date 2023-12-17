import 'dotenv/config'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import { validateEnv } from './utils'

validateEnv()

const l = console.log
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (readyClient) => {
  l(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.login(process.env.DISCORD_TOKEN)
