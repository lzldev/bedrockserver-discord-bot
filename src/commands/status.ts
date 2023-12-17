import type { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'
import { ping } from 'bedrock-protocol'

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Fetches server status')

async function execute(interaction: ChatInputCommandInteraction) {
  const status = await ping({
    host: process.env['BEDROCK_HOST']!,
    port: process.env['BEDROCK_PORT']! as any as number,
  })

  interaction.reply(`Server Status:\n${JSON.stringify(status)}`)
}

const StatusCommand = { data, execute }

export { StatusCommand }
