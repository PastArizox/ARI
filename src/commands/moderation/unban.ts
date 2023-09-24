import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    Colors,
    User,
    Guild,
    PermissionsBitField,
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
                .setDescription('The id of the user you want to unban')
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
    async execute(interaction: CommandInteraction<CacheType>) {
        let userId = interaction.options.get('user_id')?.value as string;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let description: string;
        let passed = false;

        try {
            await interaction.guild?.members.unban(userId);
            passed = true;
            description = `✅ **${userId}** has been unbanned from the server`;
        } catch {
            description = '❌ This user is not banned from this server';
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setImage(
                passed
                    ? 'https://media.tenor.com/4CPKscdlZEAAAAAC/eric-young-jail.gif'
                    : null
            )
            .setColor(Colors.Green);

        interaction.reply({ embeds: [embed] });

        if (passed) {
            Logger.log(
                interaction.guild as Guild,
                '✅ User unbanned',
                interaction.member?.user as User,
                reason,
                LogLevel.INFO,
                [{ title: 'Unbanned UserId', value: userId }]
            );
        }
    },
};
