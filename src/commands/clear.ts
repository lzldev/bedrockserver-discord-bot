import type { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'

const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear channel messages.')

async function execute(interaction: ChatInputCommandInteraction) {
  interaction.reply('To be implemented.')
}

const ClearCommand = { data, execute }

export { ClearCommand }
