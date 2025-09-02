import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server."),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply("This command can only be used in a server!");
      return;
    }

    const guild = interaction.guild;

    // Fetch additional guild info
    await guild.fetch();

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Server Information: ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "📊 Server ID", value: guild.id, inline: true },
        {
          name: "👥 Member Count",
          value: guild.memberCount.toString(),
          inline: true,
        },
        { name: "🏆 Owner", value: `<@${guild.ownerId}>`, inline: true },
        {
          name: "📅 Created",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: "🌍 Region",
          value: guild.preferredLocale || "Unknown",
          inline: true,
        },
        {
          name: "🔒 Verification Level",
          value: guild.verificationLevel.toString(),
          inline: true,
        },
        {
          name: "📝 Channels",
          value: guild.channels.cache.size.toString(),
          inline: true,
        },
        {
          name: "😀 Emojis",
          value: guild.emojis.cache.size.toString(),
          inline: true,
        },
        {
          name: "🎭 Roles",
          value: guild.roles.cache.size.toString(),
          inline: true,
        },
        {
          name: "🤖 Bot Count",
          value: guild.members.cache
            .filter((member) => member.user.bot)
            .size.toString(),
          inline: true,
        },
        {
          name: "👤 Human Count",
          value: guild.members.cache
            .filter((member) => !member.user.bot)
            .size.toString(),
          inline: true,
        },
        {
          name: "🚀 Boost Level",
          value: `${guild.premiumTier} (${
            guild.premiumSubscriptionCount || 0
          } boosts)`,
          inline: true,
        }
      )
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    // Add description if it exists
    if (guild.description) {
      embed.setDescription(guild.description);
    }

    await interaction.reply({ embeds: [embed] });
  },
};
