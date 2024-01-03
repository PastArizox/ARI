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
    name: 'lock',
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock a channel')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel you want to lock')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason for the lock')
                .setRequired(false)
        )
        .addRoleOption((option) =>
            option
                .setName('role')
                .setDescription('The role for which to lock the channel')
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const channel =
            interaction.options.getChannel<ChannelType.GuildText>('channel') ||
            (interaction.channel as TextChannel);

        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        const role =
            (interaction.options.getRole('role') as Role) ||
            channel.guild.roles.everyone;

        if (
            !channel
                .permissionsFor(role)
                .has(PermissionsBitField.Flags.SendMessages)
        ) {
            const embed = new EmbedBuilder()
                .setTitle(`🔒 This channel is already locked`)
                .setDescription(`For ${role}`)
                .setColor(Colors.Blue);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        await channel.permissionOverwrites.create(role, {
            SendMessages: false,
        });

        const embed = new EmbedBuilder()
            .setTitle(`🔒 Channel has been locked`)
            .setDescription(`For ${role}`)
            .setColor(Colors.Blue);

        const sameChannel = channel == interaction.channel;

        await interaction.reply({ embeds: [embed], ephemeral: !sameChannel });

        if (!sameChannel) {
            await channel.send({ embeds: [embed] });
        }

        Logger.log(
            interaction.guild as Guild,
            '🔒 Channel locked',
            interaction.user,
            reason,
            LogLevel.WARNING,
            [
                {
                    title: 'Locked channel',
                    value: `${channel} | ${channel.name}`,
                },
                {
                    title: 'For',
                    value: `${role} | ${role.name}`,
                },
            ]
        );
    },
};
