import type { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'

const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear channel messages.')

async function execute(interaction: ChatInputCommandInteraction) {
  const messages = await interaction.channel?.awaitMessages().catch((error) => {
    console.error(error)
  })

  if (!messages) {
    interaction.reply('Error')
    throw new Error('No messages found.')
  }

  messages?.forEach(async (mes) => {
    await mes.delete()
  })

  interaction.reply('Messages deleted.')
}

const ClearCommand = { data, execute }

export { ClearCommand }
