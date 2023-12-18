import type { ChatInputCommandInteraction } from 'discord.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from 'discord.js'

import { ServerAdvertisement, ping } from 'bedrock-protocol'

import {
  DescribeInstanceStatusCommand,
  EC2,
  StartInstancesCommand,
  StopInstancesCommand,
} from '@aws-sdk/client-ec2'
import { fromEnv } from '@aws-sdk/credential-providers'

const awsClient = new EC2({
  region: process.env['AWS_REGION']!,
  credentials: fromEnv(),
})

const awsInstancesCommand = new DescribeInstanceStatusCommand({
  InstanceIds: [process.env['AWS_INSTANCE_ID']!],
})

const awsStartCommand = new StartInstancesCommand({
  InstanceIds: [process.env['AWS_INSTANCE_ID']!],
})
const awsStopCommand = new StopInstancesCommand({
  InstanceIds: [process.env['AWS_INSTANCE_ID']!],
})

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Fetches server status')

async function execute(interaction: ChatInputCommandInteraction) {
  const containerStatus = await awsClient.send(awsInstancesCommand)
  console.log(containerStatus)
  if (containerStatus.$metadata.httpStatusCode !== 200) {
    console.error('Error fetching Container Status')
    throw 'Error fetching Container Status'
  }

  const firstContainer = containerStatus.InstanceStatuses?.at(0)
  if (!firstContainer) {
    console.error('Container Stopped')

    const startContainerButton = new ButtonBuilder()
      .setLabel('Start')
      .setCustomId('start_server')
      .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder().addComponents(startContainerButton)

    const reply = await interaction.reply({
      content: 'Server Desligado',
      components: [row as any],
    })

    const response = await reply.awaitMessageComponent({
      time: 1000 * 30, // 30s
    })

    console.log(response)

    if (response.customId === 'start_server') {
      const cmd = await awsClient.send(awsStartCommand)
      console.log(cmd)
    }

    reply.delete()

    return
  } else if (firstContainer.InstanceStatus?.Status !== 'ok') {
    interaction.reply('Container Starting...')
  }

  const bedrockHost = process.env['BEDROCK_HOST']!
  const bedrockPort = parseInt(process.env['BEDROCK_PORT']!)

  console.log(`Pinging to : ${bedrockHost}:${bedrockPort}`)

  const status = await ping({
    host: bedrockHost,
    port: bedrockPort,
  }).catch((e) => {
    console.error(e)
  })

  if (!status) {
    interaction.reply('Container Online. Minecraft server not responding')
    return
  }

  const message = (status: ServerAdvertisement) =>
    `Server Status:
  ${status.motd}
  Players: ${status.playersOnline}/${status.playersMax}
  Version: \`${status.version}\`
  IP: \`${bedrockHost}:${bedrockPort}\`
`

  /// # Minecraft launch intents: https://gist.github.com/lukeeey/8d0fd2c0b4a31d64cc9b47f6c1286330

  if (status.playersOnline !== 0) {
    const res = await interaction.reply({
      content: message(status),
    })

    await res
      .awaitMessageComponent({
        time: 1000 * 5,
      })
      .then(async () => {
        await res.delete()
      })
      .catch(async () => {
        await res.delete()
      })

    return
  }

  const stopContainerButton = new ButtonBuilder()
    .setLabel('Stop')
    .setCustomId('stop_server')
    .setStyle(ButtonStyle.Danger)

  const row = new ActionRowBuilder().addComponents(stopContainerButton)

  const res = await interaction.reply({
    content: `${message(status)}`,
    components: [row as any],
  })

  await res
    .awaitMessageComponent({
      time: 1000 * 5,
    })
    .then(async (iter) => {
      if (iter.customId === 'stop_server') {
        await awsClient.send(awsStopCommand)
        interaction.reply('Server Stopped')
      }

      await res
        .delete()
        .then(() => console.log('message Deleted'))
        .catch((e) => console.log)
    })
    .catch(async (e) => {
      await res
        .delete()
        .then(() => console.log('message Deleted'))
        .catch((e) => console.log)
    })
}

const StatusCommand = { data, execute }

export { StatusCommand }
