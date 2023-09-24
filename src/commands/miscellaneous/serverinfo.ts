import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    Guild,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';

export const command: SlashCommand = {
    name: 'serverinfo',
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get the informations about the server')
        .setDMPermission(false),
    async execute(interaction: CommandInteraction<CacheType>) {
        const server = interaction.guild as Guild;

        const clientUsername = interaction.client.user.username;
        const clientAvatarURL = interaction.client.user.avatarURL();
        const clientDiscriminator = Number(
            interaction.client.user.discriminator
        );

        const name = server.name;
        const id = server.id;
        const description = server.description;
        const createAt = server.createdAt;
        const channelsCount = server.channels.cache.size;
        const boostsCount = server.premiumSubscriptionCount;
        const bansCount = server.bans.cache.size;
        const emojisCount = server.emojis.cache.size;
        const membersCount = server.memberCount;
        const rolesCount = server.roles.cache.size;
        const afkChannelName = server.afkChannel?.name;
        const verified = server.verified;
        const verificationLevel = server.verificationLevel;
        let verificationLevelName: string;

        switch (verificationLevel) {
            case 0:
                verificationLevelName = 'None';
                break;
            case 1:
                verificationLevelName = 'Low';
                break;
            case 2:
                verificationLevelName = 'Medium';
                break;
            case 3:
                verificationLevelName = 'High';
                break;
            case 4:
                verificationLevelName = 'Very High';
                break;
            default:
                verificationLevelName = 'Unknown';
        }

        const icon = server.iconURL();

        const embed = new EmbedBuilder()
            .setTitle(name)
            .setDescription(`Display all the informations about ${name}`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Identifier', value: id, inline: true },
                {
                    name: 'Description',
                    value: description ? description : 'None',
                    inline: true,
                },
                {
                    name: 'Channels',
                    value: `${channelsCount} channel(s)`,
                    inline: true,
                },
                {
                    name: 'Boosts',
                    value: `${
                        boostsCount ? boostsCount.toString() : '0'
                    } boost(s)`,
                    inline: true,
                },
                { name: 'Bans', value: `${bansCount} ban(s)`, inline: true },
                {
                    name: 'Emojis',
                    value: `${emojisCount} emoji(s)`,
                    inline: true,
                },
                {
                    name: 'Members',
                    value: `${membersCount} member(s)`,
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: `${rolesCount} role(s)`,
                    inline: true,
                },
                {
                    name: 'AFK channel',
                    value: afkChannelName ? `<#${afkChannelName}>` : 'None',
                    inline: true,
                },
                {
                    name: 'Verified',
                    value: verified ? 'Yes' : 'No',
                    inline: true,
                },
                {
                    name: 'Verification level',
                    value: verificationLevelName,
                    inline: true,
                }
            )
            .setThumbnail(icon)
            .setColor([255, 255, 255])
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
