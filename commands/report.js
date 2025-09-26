const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("عمل بلاغ على عضو")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("الشخص المراد التبليغ عنه")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("سبب البلاغ")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const target = interaction.options.getMember("user");

    const reason = interaction.options.getString("reason");

    // استخدام ID القناة بدل name
    const logChannel = interaction.guild.channels.cache.get("ID Log RePort");

    if (!logChannel) {
      return interaction.editReply({ content: "⚠️ لم يتم العثور على قناة اللوج." });
    }

    const embed = new EmbedBuilder()
      .setTitle("📢 بلاغ جديد")
      .setColor("Red")
      .addFields(
        { name: "👤 العضو المبلغ عنه", value: `${target}`, inline: true },
        { name: "✍️ السبب", value: reason, inline: true },
        { name: "👮‍♂️ المبلغ", value: `${interaction.user}`, inline: true }
      )
      .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("accept").setLabel("✅ استلام").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("cancel").setLabel("❌ إلغاء").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("warn").setLabel("⚠️ تحذير").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("kick").setLabel("👢 طرد").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("ban").setLabel("🔨 باند").setStyle(ButtonStyle.Danger),
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("mute").setLabel("🔇 ميوت").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("timeout").setLabel("⏳ تايم أوت").setStyle(ButtonStyle.Secondary),
    );

    await logChannel.send({ embeds: [embed], components: [row1, row2] });
    await interaction.editReply({ content: "تم استلام البلاغ " });
  }
};
