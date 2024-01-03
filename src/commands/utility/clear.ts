import {
    CacheType,
    PermissionsBitField,
    SlashCommandBuilder,
    Colors,
    ChatInputCommandInteraction,
    TextChannel,
    Collection,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { Logger, LogLevel } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'clear',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a given amount of messages in a channel.')
        .addNumberOption((option) =>
            option
                .setName('amount')
                .setDescription('Amount of messages to delete')
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('Delete the messages of the specified user')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        let amount = interaction.options.getNumber('amount') || 15;
        const channel = interaction.channel as TextChannel;

        if (!channel) {
            console.error('Intent may not be enabled');
            return;
        }

        const user = interaction.options.getUser('user');

        let messages = await channel.messages.fetch({
            limit: user ? undefined : amount,
            cache: false,
        });

        if (user) {
            messages = messages.filter(
                (message) => message.author.id === user.id
            );

            const entriesArray = Array.from(messages.entries());
            const slicedEntries = entriesArray.slice(0, amount);

            messages = new Collection(slicedEntries);
        }

        if (messages.size > 0) {
            await channel.bulkDelete(messages);
        }

        const embed = new EmbedBuilder()
            .setTitle('🗑️ Message Clearance')
            .setDescription(`\`${messages.size}\` messages have been deleted.`)
            .setColor(Colors.Blue);

        interaction.reply({ embeds: [embed] });

        Logger.log(
            interaction.guild!,
            '🗑️ Messages Cleared',
            interaction.user,
            `Deleted ${messages.size} messages.`,
            LogLevel.IMPORTANT,
            [
                {
                    title: 'For',
                    value: user ? `${user} | ${user.id}` : 'All',
                },
            ]
        );
    },
};
