import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    Guild,
    PermissionsBitField,
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
    async execute(interaction: CommandInteraction<CacheType>) {
        let member =
            (interaction.options.get('user')?.member as GuildMember) ||
            interaction.member;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let description: string;
        let passed = false;

        if (member == interaction.member) {
            description = "❌ You can't kick yourself !";
        } else if (!member.kickable) {
            description = "❌ You can't kick this user !";
        } else {
            member.kick(reason);
            passed = true;
            description = `🌪️ **${member.user.username}** has been kicked off the server !`;
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Orange)
            .setImage(
                passed
                    ? 'https://media.tenor.com/4dTTTBzI-K0AAAAC/thor-hammer.gif'
                    : null
            );

        interaction.reply({ embeds: [embed] });

        if (passed) {
            Logger.log(
                interaction.guild as Guild,
                '🌪️ User kicked',
                interaction.user,
                reason,
                LogLevel.WARNING,
                [
                    {
                        title: 'User kicked',
                        value: `${member} | ${member.id}`,
                    },
                ]
            );
        }
    },
};
