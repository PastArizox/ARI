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

export const command: SlashCommand = {
    name: 'unban',
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption((option) =>
            option
                .setName('user_id')
                .setDescription('The ID of the user you want to unban')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason why you want to unban the user')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const userId = interaction.options.getString('user_id') as string;
        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        const bans = await interaction.guild?.bans.fetch();
        const user = bans?.find((key) => key.user.id === userId)?.user;

        if (user == undefined) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Not banned')
                .setDescription('This user is not banned from the server.')
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        try {
            await interaction.guild?.members.unban(userId, reason);

            const embed = new EmbedBuilder()
                .setTitle(
                    `✅ ${user.username} has been unbanned from the server`
                )
                .setColor(Colors.Green)
                .setImage(
                    'https://media.tenor.com/4CPKscdlZEAAAAAC/eric-young-jail.gif'
                );

            interaction.reply({ embeds: [embed] });

            Logger.log(
                interaction.guild!,
                '✅ User Unbanned',
                interaction.user,
                reason,
                LogLevel.INFO,
                [{ title: 'Unbanned User', value: `${user} | ${userId}` }]
            );
        } catch (error) {
            console.error(error);

            const embed = new EmbedBuilder()
                .setTitle('❌ Unban Failed')
                .setDescription(
                    'An error occurred while trying to unban the user.'
                )
                .setColor(Colors.Red);

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
