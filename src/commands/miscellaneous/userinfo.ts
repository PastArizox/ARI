import { EmbedBuilder } from '@discordjs/builders';
import {
    CacheType,
    CommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';

export const command: SlashCommand = {
    name: 'userinfo',
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get all the informations about a user')
        .addMentionableOption((option) =>
            option
                .setName('user')
                .setDescription('The member you want the informations')
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: CommandInteraction<CacheType>) {
        let member =
            (interaction.options.get('user')?.member as GuildMember) ||
            interaction.member;
        let user = member.user;

        const clientUsername = interaction.client.user.username;
        const clientAvatarURL = interaction.client.user.avatarURL();
        const clientDiscriminator = Number(
            interaction.client.user.discriminator
        );

        const username = user.username;
        const displayName = member?.displayName;
        const id = user.id;
        const createdAt = user.createdAt;
        const createdAtFormated = `${createdAt.getMonth()}/${createdAt.getDay()}/${createdAt.getFullYear()}`;
        const joinedAt = member.joinedAt;
        const joinedAtFormated = `${joinedAt?.getMonth()}/${joinedAt?.getDay()}/${joinedAt?.getFullYear()}`;
        const premiumSince = member.premiumSince;
        const premiumSinceFormated = `${premiumSince?.getMonth()}/${premiumSince?.getDay()}/${premiumSince?.getFullYear()}`;
        const presence = member.presence;
        let status: string;

        switch (presence?.status) {
            case 'online':
                status = '🟢 Online';
                break;
            case 'idle':
                status = '🟠 Idle';
                break;
            case 'dnd':
                status = '🔴 DND';
                break;
            case 'invisible':
                status = '🟣 Invisible';
                break;
            case 'offline':
                status = '🟣 Invisible';
                break;
            default:
                status = '⚫ Offline';
        }

        let clientStatus: string;

        if (presence?.clientStatus?.desktop) clientStatus = '🖥️ Desktop';
        else if (presence?.clientStatus?.mobile) clientStatus = '📱 Mobile';
        else if (presence?.clientStatus?.web) clientStatus = '🌐 Web';
        else clientStatus = '❌ Unknown';

        const rolesManager = member.roles;
        const roles: string[] = [];
        rolesManager.cache.forEach((role) => {
            roles.push(`<@&${role.id}>`);
        });
        roles.pop(); // Remove @everyone

        const avatarURL = user.avatarURL();
        const bannerURL = user.bannerURL();
        const discriminator = Number(user.discriminator);

        const embed = new EmbedBuilder()
            .setTitle(`${username}'s user informations`)
            .setDescription(
                `Display all the informations about the user ${username}`
            )
            .setURL(`https://discordlookup.com/user/${id}`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '**Global**', value: '\u200B' },

                { name: '📛 Username', value: username, inline: true },
                { name: '🌐 Display Name', value: displayName, inline: true },
                { name: '🆔 Identifier', value: id, inline: true },
                { name: '✅ Created', value: createdAtFormated, inline: true },
                { name: '💭 Status', value: status, inline: true },
                { name: '🕶️ Platform', value: clientStatus, inline: true },

                { name: '\u200B', value: '\u200B' },
                { name: '**Server**', value: '\u200B' },

                {
                    name: '➡️ Joined At',
                    value: joinedAt ? joinedAtFormated : 'Unknown',
                    inline: true,
                },
                {
                    name: '👤 Roles',
                    value: `${roles.length != 0 ? roles : 'None'}`,
                    inline: true,
                },
                {
                    name: '⏫ Boosting',
                    value: premiumSince
                        ? `Since ${premiumSinceFormated}`
                        : 'No',
                    inline: true,
                }
            )
            .setThumbnail(
                avatarURL
                    ? avatarURL
                    : `https://cdn.discordapp.com/embed/avatars/${
                          discriminator % 5
                      }.png`
            )
            .setImage(bannerURL ? bannerURL : null)
            .setColor(user.accentColor ? user.accentColor : [255, 255, 255])
            .setFooter({
                text: `By ${clientUsername}`,
                iconURL: clientAvatarURL
                    ? clientAvatarURL
                    : `https://cdn.discordapp.com/embed/avatars/${
                          clientDiscriminator % 5
                      }.png`,
            })
            .setTimestamp(Date.now());

        await interaction.reply({ embeds: [embed] });
    },
};
