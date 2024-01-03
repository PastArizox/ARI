import {
    CacheType,
    SlashCommandBuilder,
    ChannelType,
    Guild,
    Colors,
    PermissionsBitField,
    TextChannel,
    ChatInputCommandInteraction,
    Role,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'lockinfo',
    data: new SlashCommandBuilder()
        .setName('lockinfo')
        .setDescription('Display information about locked roles in a channel')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription(
                    'The channel you want to get lock information for'
                )
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const channel =
            interaction.options.getChannel<ChannelType.GuildText>('channel') ||
            (interaction.channel as TextChannel);

        const lockedRoles = channel.permissionOverwrites.cache
            .filter((overwrite) =>
                overwrite.deny.has(PermissionsBitField.Flags.SendMessages)
            )
            .map((overwrite) => {
                if (overwrite.id === channel.guild.roles.everyone.id) {
                    return '🔒 @everyone';
                }
                const role = channel.guild.roles.cache.get(overwrite.id);
                return role ? `🔒 ${role}` : '🔒 Unknown Role';
            });

        const embed = new EmbedBuilder()
            .setTitle(`Lock Information for ${channel.name}`)
            .setDescription(
                lockedRoles.length > 0
                    ? `This channel is currently locked for the following roles:\n\n${lockedRoles.join(
                          '\n'
                      )}`
                    : 'This channel is not locked for any roles.'
            )
            .setColor(Colors.Blue);

        await interaction.reply({ embeds: [embed], ephemeral: true });

        Logger.log(
            interaction.guild as Guild,
            '🔒 Lock Information Requested',
            interaction.user,
            'Lock information requested for ' + channel.name,
            LogLevel.INFO
        );
    },
};
