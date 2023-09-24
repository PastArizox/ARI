import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    ChannelType,
    BaseGuildTextChannel,
    Guild,
    Colors,
    PermissionsBitField,
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
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .setDMPermission(false),
    async execute(interaction: CommandInteraction<CacheType>) {
        let channel =
            (interaction.options.get('channel')
                ?.channel as BaseGuildTextChannel) || interaction.channel;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let passed = false;
        let description: string;

        if (channel.name.includes('🔒-')) {
            description = '🔒 This channel is already locked';
        } else {
            passed = true;

            channel.setName(`🔒-${channel.name}`, reason);
            channel.permissionOverwrites.create(channel.guild.roles.everyone, {
                SendMessages: false,
            });

            description = `🔒 **${channel}** has been locked`;
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Blue);

        if (passed) {
            const embedLocked = new EmbedBuilder()
                .setTitle('🔒 This channel is now locked')
                .setColor(Colors.Blue);

            channel.send({ embeds: [embedLocked] });
        }

        interaction.reply({ embeds: [embed] });

        if (passed) {
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
                ]
            );
        }
    },
};
