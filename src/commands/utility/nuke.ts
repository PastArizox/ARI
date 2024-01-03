import {
    ChatInputCommandInteraction,
    CacheType,
    SlashCommandBuilder,
    Colors,
    Guild,
    ChannelType,
    PermissionsBitField,
    TextChannel,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { Logger, LogLevel } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'nuke',
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nuke a channel and delete all messages')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel to nuke')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason for the nuke')
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName('delay')
                .setDescription('Nuke delay (in seconds)')
                .setMinValue(1)
                .setMaxValue(86400)
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const channel =
            interaction.options.getChannel<ChannelType.GuildText>('channel') ||
            (interaction.channel as TextChannel);

        const delaySeconds = interaction.options.getInteger('delay') || 0;
        const delayMillis = delaySeconds * 1000;
        const reason = interaction.options.getString('reason') || 'Unknown';

        const delayString = formatDelay(delayMillis);

        const gettingNukedEmbed = new EmbedBuilder()
            .setTitle('Channel Nuke Incoming!')
            .setDescription(
                `This channel will be nuked in \`${delayString}\` ${getEmote(
                    'bomb'
                )}`
            )
            .setColor(Colors.Orange);

        const sameChannel = channel == interaction.channel;

        await interaction.reply({
            embeds: [gettingNukedEmbed],
            ephemeral: !sameChannel,
        });

        if (!sameChannel) {
            await channel.send({ embeds: [gettingNukedEmbed] });
        }

        setTimeout(async () => {
            const clonnedChannel = await channel.clone();
            channel.delete(reason);

            const nukedEmbed = new EmbedBuilder()
                .setTitle('💣 Channel Nuked!')
                .setDescription(
                    `This channel has been nuked! ${getEmote('boom')}`
                )
                .setImage(
                    'https://media.tenor.com/hw1uenMkjEEAAAAC/nuke-automic-boom.gif'
                )
                .setColor(Colors.Red);

            clonnedChannel.send({ embeds: [nukedEmbed] });

            Logger.log(
                interaction.guild as Guild,
                '💥 Channel Nuked',
                interaction.user,
                reason,
                LogLevel.WARNING,
                [
                    {
                        title: 'From',
                        value: `${channel} | ${channel.name}`,
                    },
                    {
                        title: 'Clone channel',
                        value: `${clonnedChannel} | ${clonnedChannel.name}`,
                    },
                ]
            );
        }, delayMillis);
    },
};

function formatDelay(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
}

function getEmote(name: string): string {
    switch (name) {
        case 'bomb':
            return '💣';
        case 'boom':
            return '💥';
        default:
            return '';
    }
}
