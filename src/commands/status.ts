import type { ChatInputCommandInteraction } from 'discord.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from 'discord.js'
import { ServerAdvertisement, ping } from 'bedrock-protocol'

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Fetches server status')

async function execute(interaction: ChatInputCommandInteraction) {
  const bedrockHost = process.env['BEDROCK_HOST']!
  const bedrockPort = parseInt(process.env['BEDROCK_PORT']!)
  const status = await ping({
    host: bedrockHost,
    port: bedrockPort,
  })

  const message = (status: ServerAdvertisement) =>
    `Server Status:
  ${status.motd}
  Players:${status.playersOnline}/${status.playersMax}
  Version:\`${status.version}\`
  IP:\`${bedrockHost}:${bedrockPort}\`
`

  await interaction.reply({
    content: message(status),
    ephemeral: true,
  })
}

const StatusCommand = { data, execute }

export { StatusCommand }
