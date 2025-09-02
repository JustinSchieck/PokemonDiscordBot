export default {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.CLIENT_ID || "",
  guildId: process.env.GUILD_ID || "",
} as const;
