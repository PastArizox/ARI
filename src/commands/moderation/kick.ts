import {
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    Guild,
    PermissionsBitField,
    ChatInputCommandInteraction,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'kick',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user out of the server')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to kick')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason why you want to kick the user')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const member = (interaction.options.getMember('user') ||
            interaction.member!) as GuildMember;
        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        if (member === interaction.member) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Self-Kick')
                .setDescription("You can't kick yourself!")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (!member || !member.kickable) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Unable to Kick')
                .setDescription("I can't kick this user.")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        try {
            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle(
                    `🌪️ ${member.user.tag} has been kicked from the server!`
                )
                .setDescription(`Reason: ${reason}`)
                .setColor(Colors.Orange)
                .setImage(
                    'https://media.tenor.com/5JmSgyYNVO0AAAAC/asdf-movie.gif'
                );

            interaction.reply({ embeds: [embed] });

            Logger.log(
                interaction.guild!,
                '🌪️ User Kicked',
                interaction.user,
                reason,
                LogLevel.IMPORTANT,
                [
                    {
                        title: 'User Kicked',
                        value: `${member.user.tag} | ${member.id}`,
                    },
                ]
            );
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('❌ Kick Failed')
                .setDescription(
                    'An error occurred while trying to kick the user.'
                )
                .setColor(Colors.Red);

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
