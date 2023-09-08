import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    BaseGuildTextChannel,
    Colors,
    Guild,
    ChannelType,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { Logger, LogLevel } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'nuke',
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nuke a channel and deletes all the messages')
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
                .setDescription('Nuke delay (in second)')
                .setMinValue(1)
                .setMaxValue(86400)
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        let channel =
            (interaction.options.get('channel')
                ?.channel as BaseGuildTextChannel) || interaction.channel;

        let delay = (interaction.options.get('delay')?.value as number) || 0;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let description: string;
        if (channel == interaction.channel) {
            description = `**This channel** will be nuked in \`${delay}\` seconds`;
        } else {
            description = `**${channel.name}** will be nuked in \`${delay}\` seconds`;
        }

        const gettingNukedEmbed = new EmbedBuilder().setDescription(
            description
        );
        const nukedEmbed = new EmbedBuilder()
            .setImage(
                'https://media.tenor.com/hw1uenMkjEEAAAAC/nuke-automic-boom.gif'
            )
            .setColor(Colors.Blue);
        await interaction.reply({ embeds: [gettingNukedEmbed] }).then(() =>
            setTimeout(async () => {
                const clonnedChannel = await channel.clone();
                channel.delete(reason);
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
                            value: `${interaction.channel} | ${
                                (interaction.channel as BaseGuildTextChannel)
                                    .name
                            }`,
                        },
                        {
                            title: 'Clone channel',
                            value: `${clonnedChannel} | ${clonnedChannel.name}`,
                        },
                    ]
                );
            }, delay * 1000)
        );
    },
};
