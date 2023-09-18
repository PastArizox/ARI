import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    ChannelType,
    BaseGuildTextChannel,
    Guild,
    Colors,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

// TODO add permissions check

export const command: SlashCommand = {
    name: 'unlock',
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a channel')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel you want to unlock')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason for the unlock')
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        let channel =
            (interaction.options.get('channel')
                ?.channel as BaseGuildTextChannel) || interaction.channel;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let passed = false;
        let description: string;

        if (!channel.name.includes('🔒-')) {
            description = '🔓 This channel is not locked';
        } else {
            passed = true;

            channel.setName(
                `${channel.name.substring(2, channel.name.length)}`,
                reason
            );
            channel.permissionOverwrites.create(channel.guild.roles.everyone, {
                SendMessages: true,
            });

            description = `🔓 **${channel}** has been unlocked`;
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Blue);

        if (passed) {
            const embedUnlocked = new EmbedBuilder()
                .setTitle('🔓 This channel is now unlocked')
                .setColor(Colors.Blue);

            channel.send({ embeds: [embedUnlocked] });
        }

        interaction.reply({ embeds: [embed] });

        if (passed) {
            Logger.log(
                interaction.guild as Guild,
                '🔓 Channel unlocked',
                interaction.user,
                reason,
                LogLevel.WARNING,
                [
                    {
                        title: 'Unlocked channel',
                        value: `${channel} | ${channel.name}`,
                    },
                ]
            );
        }
    },
};
