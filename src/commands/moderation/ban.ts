import {
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    PermissionsBitField,
    ChatInputCommandInteraction,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

// TODO: Check if it works fine

export const command: SlashCommand = {
    name: 'ban',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to ban')
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
        const member = (interaction.options.getMember('user') ||
            interaction.member!) as GuildMember;
        const reason =
            interaction.options.getString('reason') || 'No reason provided';
        const nbDays = interaction.options.getInteger('days') || 0;

        if (member === interaction.member) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Self-Ban')
                .setDescription("You can't ban yourself!")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (!member.bannable) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Unable to Ban')
                .setDescription("I can't ban this user.")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed] });
            return;
        }

        try {
            await member.ban({
                deleteMessageDays: nbDays,
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

            interaction.reply({ embeds: [embed] });
        }
    },
};
