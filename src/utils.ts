export const validateEnv = () => {
  if (typeof process.env.DISCORD_TOKEN === 'undefined') {
    process.exit(1)
  } else if (typeof process.env.APP_ID === 'undefined') {
    process.exit(1)
  } else if (typeof process.env.PUBLIC_KEY === 'undefined') {
    process.exit(1)
  }
}
