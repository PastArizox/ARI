import {
    CacheType,
    SlashCommandBuilder,
    PermissionsBitField,
    ChatInputCommandInteraction,
    Colors,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { Logger, LogLevel } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'banid',
    data: new SlashCommandBuilder()
        .setName('banid')
        .setDescription('Ban a user from the server by its id')
        .addStringOption((option) =>
            option
                .setName('userid')
                .setDescription('The id of the user you want to ban')
                .setMinLength(18)
                .setMaxLength(19)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason why you want to ban the user')
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName('days')
                .setDescription(
                    'Number of days of messages to delete, must be between 0 and 7, inclusive'
                )
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const userId = interaction.options.getString('userid') as string;
        const reason =
            interaction.options.getString('reason') || 'No reason provided';
        const nbDays = interaction.options.getInteger('days') || 0;

        if (!userId || userId === interaction.member?.user.id) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Self-Ban')
                .setDescription("You can't ban yourself!")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const member = await interaction.guild?.members
            .fetch(userId)
            .catch(() => null);

        if (!member || !member.bannable) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Unable to Ban')
                .setDescription("I can't ban this user.")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        try {
            await member.ban({
                deleteMessageSeconds: nbDays * 86400,
                reason: reason,
            });

            const embed = new EmbedBuilder()
                .setTitle(
                    `⛔ ${member.user.tag} has been banned from the server!`
                )
                .setDescription(`Reason: ${reason}`)
                .setColor(Colors.Red)
                .setImage(
                    'https://media.tenor.com/4dTTTBzI-K0AAAAC/thor-hammer.gif'
                );

            interaction.reply({ embeds: [embed] });

            Logger.log(
                interaction.guild!,
                '⛔ User Banned',
                interaction.user,
                reason,
                LogLevel.IMPORTANT,
                [
                    {
                        title: 'User Banned',
                        value: `${member.user.tag} | ${member.id}`,
                    },
                    {
                        title: 'Deleted Messages',
                        value: `${nbDays} day(s)`,
                    },
                ]
            );
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('❌ Ban Failed')
                .setDescription(
                    'An error occurred while trying to ban the user.'
                )
                .setColor(Colors.Red);

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
