const envVars = [
  'DISCORD_TOKEN',
  'APP_ID',
  'PUBLIC_KEY',
  'GUILD_IDS',
  'CHANNEL_IDS',
  'BEDROCK_HOST',
  'BEDROCK_PORT',
  'AWS_REGION',
  'AWS_INSTANCE_ID',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
] as const

export const validateEnv = () => {
  envVars.forEach((varName) => {
    if (typeof process.env[varName] === 'undefined') {
      console.error(`${varName} must be provided`)
      process.exit(1)
    }
  })
}

export const getGuildIds = () => {
  let guildIds
  try {
    guildIds = process.env['GUILD_IDS']?.split(',') ?? []
  } catch {
    console.error(`Invalid GuildIds`)
  }

  return guildIds
}

export const getChannelIds = () => {
  let channelIds
  try {
    channelIds = process.env['CHANNEL_IDS']?.split(',') ?? []
  } catch {
    console.error(`Invalid ChannelIds`)
  }

  return channelIds
}
