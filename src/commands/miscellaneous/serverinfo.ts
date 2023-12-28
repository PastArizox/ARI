import { CacheType, CommandInteraction, SlashCommandBuilder, Guild, GuildExplicitContentFilter, GuildMFALevel, Colors } from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';

export const command: SlashCommand = {
    name: 'serverinfo',
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get detailed information about the server')
        .setDMPermission(false),
    async execute(interaction: CommandInteraction<CacheType>) {
        const server = interaction.guild as Guild;

        const {
            name,
            id,
            description,
            createdAt,
            channels,
            premiumSubscriptionCount,
            bans,
            emojis,
            memberCount,
            roles,
            afkChannel,
            afkTimeout,
            mfaLevel,
            preferredLocale,
            partnered,
            vanityURLCode,
            systemChannel,
            defaultMessageNotifications,
            explicitContentFilter,
            verificationLevel,
        } = server;
        const iconURL = server.iconURL();

        const verificationLevelName = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Very High',
        }[verificationLevel] || 'Unknown';

        const embed = new EmbedBuilder()
            .setTitle(`🌐 ${name}`)
            .setDescription(`Here's detailed information about the server ${name}`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '🔍 Identifier', value: id, inline: true },
                { name: '📝 Description', value: description || 'None', inline: true },
                { name: '🚀 Boosts', value: premiumSubscriptionCount?.toString() || '0', inline: true },
            )
            .addFields(
                { name: '👥 Members', value: memberCount.toString(), inline: true },
                { name: '🎭 Roles', value: roles.cache.size.toString(), inline: true },
                { name: '😃 Emojis', value: emojis.cache.size.toString(), inline: true },
            )
            .addFields(
                { name: '📚 Channels', value: channels.cache.size.toString(), inline: true },
                { name: '⏰ AFK Channel', value: afkChannel ? `<#${afkChannel.name}>` : 'None', inline: true },
                { name: '⌛ AFK Timeout', value: `${(afkTimeout / 60).toString()} minutes`, inline: true },
            )
            .addFields(
                { name: '🚫 Bans', value: bans.cache.size.toString(), inline: true },
                { name: '🔒 MFA Level', value: GuildMFALevel[mfaLevel], inline: true },
                { name: '🌍 Region', value: preferredLocale, inline: true },
            )
            .addFields(
                { name: '🤝 Partnered', value: partnered ? "Yes" : "No", inline: true },
                { name: '🔗 Vanity URL Code', value: vanityURLCode || 'None', inline: true },
                { name: '🛡️ Verification Level', value: verificationLevelName, inline: true },
            )
            .addFields(
                { name: '📢 System Channel', value: systemChannel ? `<#${systemChannel.id}>` : 'None', inline: true },
                { name: '🔔 Default Message Notifications', value: defaultMessageNotifications.toString(), inline: true },
                { name: '🗣️ Explicit Content Filter', value: GuildExplicitContentFilter[explicitContentFilter], inline: true },
            )
            .setThumbnail(iconURL)
            .setColor(Colors.Blue)
            .setFooter({
                text: `Requested by ${interaction.user.tag} 👤`,
                iconURL: interaction.user.avatarURL() || undefined,
            })
            .setTimestamp(createdAt);

        await interaction.reply({ embeds: [embed] });
    },
};
