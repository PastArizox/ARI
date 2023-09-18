import {
    CacheType,
    Collection,
    CommandInteraction,
    Message,
    SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';

// TODO add permissions check

export const command: SlashCommand = {
    name: 'clear',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a given amount of message in a channel.')
        .addNumberOption((option) =>
            option
                .setName('amount')
                .setDescription('Amount of messages to delete')
                .setMinValue(1)
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('Delete the messages of the specified user')
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        let amount =
            Number(interaction.options.get('amount', false)?.value) || 15;

        const channel = interaction.channel;

        if (!channel) {
            console.error('Intent maybe not enabled');
            return;
        }

        let messages = new Collection<String, Message>();
        const userToDeleteFrom = interaction.options.get('user', false)?.user;

        if (userToDeleteFrom) {
            await channel.messages.fetch({ cache: false }).then((msgs) => {
                let count = 0;

                msgs.forEach((message, key) => {
                    if (count >= amount) return;
                    if (message.author === userToDeleteFrom) {
                        messages.set(key, message);
                        count++;
                    }
                });
            });
        } else {
            messages = await channel.messages.fetch({
                limit: amount,
                cache: false,
            });
        }

        let deleted = 0;
        messages.forEach((message) => {
            message.delete();
            deleted++;
        });

        await interaction
            .reply(`\`${deleted}\` messages have been deleted.`)
            .then((message) => {
                setTimeout(() => message.delete(), 3000);
            }); // TODO: replace by embed

        // TODO: Add logger
    },
};
