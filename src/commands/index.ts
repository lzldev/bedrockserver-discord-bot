import { StatusCommand } from './status'

const _commandsArr = [StatusCommand] satisfies ChuuCommand[]

const commands = new Map<string, ChuuCommand>()

_commandsArr.forEach((command) => {
  commands.set(command.data.name, command)
})

export { commands }

import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

export type ChuuCommand = {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
}
