import { EmbedBuilder } from '@discordjs/builders';
import {
    CommandInteraction,
    CacheType,
    GuildMember,
    SlashCommandBuilder,
    Colors,
} from 'discord.js';
import { SlashCommand } from '../../types';

export const command: SlashCommand = {
    name: 'userinfo',
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get all the information about a user')
        .addMentionableOption((option) =>
            option
                .setName('user')
                .setDescription('The member you want the information')
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: CommandInteraction<CacheType>) {
        const member =
            (interaction.options.get('user')?.member as GuildMember) ||
            interaction.member;
        const user = member.user;

        const { joinedAt, premiumSince, presence, roles } = member;
        const { username, displayName, id, createdAt, discriminator } = user;

        const avatarURL = user.avatarURL();
        const bannerURL = user.bannerURL();

        const createdAtFormatted = getDateFormatted(createdAt)!;
        const joinedAtFormatted = getDateFormatted(joinedAt) || 'Unknown';
        const premiumSinceFormatted = getDateFormatted(premiumSince) || 'No';

        const status = presence?.status
            ? {
                  online: '🟢 Online',
                  idle: '🟠 Idle',
                  dnd: '🔴 DND',
                  invisible: '🟣 Invisible',
                  offline: '🟣 Invisible',
              }[presence.status] || '⚫ Unknown'
            : '🟣 Offline';

        const clientStatus = presence?.clientStatus
            ? presence.clientStatus.desktop
                ? '🖥️ Desktop'
                : presence.clientStatus.mobile
                ? '📱 Mobile'
                : presence.clientStatus.web
                ? '🌐 Web'
                : '❌ Unknown'
            : '❌ Unknown';

        const rolesList = roles.cache
            .filter((role) => role.name !== '@everyone')
            .map((role) => `<@&${role.id}>`);

        const rolesString = rolesList.length ? rolesList.join(' ') : 'None';

        const embed = new EmbedBuilder()
            .setTitle(`${username}'s User Information`)
            .setDescription(
                `Display all the information about the user ${username}`
            )
            .setURL(`https://discordlookup.com/user/${id}`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '**General Information**', value: '\u200B' },
                { name: '📛 Username', value: username, inline: true },
                { name: '🌐 Display Name', value: displayName, inline: true },
                { name: '🆔 User ID', value: user.id, inline: true },
                {
                    name: '✅ Created At',
                    value: createdAtFormatted,
                    inline: true,
                },
                {
                    name: '💭 Status',
                    value: status,
                    inline: true,
                },
                {
                    name: '🕶️ Platform',
                    value: clientStatus,
                    inline: true,
                },
                { name: '\u200B', value: '\u200B' },
                { name: '**Server Information**', value: '\u200B' },
                {
                    name: '➡️ Joined At',
                    value: joinedAtFormatted,
                    inline: true,
                },
                {
                    name: '👤 Roles',
                    value: rolesString,
                    inline: true,
                },
                {
                    name: '⏫ Boosting Since',
                    value: premiumSinceFormatted,
                    inline: true,
                }
            )
            .setThumbnail(
                avatarURL ||
                    `https://cdn.discordapp.com/embed/avatars/${
                        Number(discriminator) % 5
                    }.png`
            )
            .setImage(bannerURL || null)
            .setColor(Colors.Blue)
            .setFooter({
                text: `Requested by ${interaction.user.tag} 👤`,
                iconURL:
                    interaction.user.avatarURL() ||
                    `https://cdn.discordapp.com/embed/avatars/${
                        Number(discriminator) % 5
                    }.png`,
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

function getDateFormatted(date: Date | null): string | null {
    return (
        date?.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }) || null
    );
}
