import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    Guild,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

// TODO Add permissions check
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
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        let member = interaction.options.get('user')?.member as GuildMember;
        if (!member) member = interaction.member as GuildMember;

        let reason = interaction.options.get('reason')?.value as string;
        if (!reason) reason = 'Unknown';

        let description: string;
        let log = false;

        if (member == interaction.member) {
            description = "❌ You can't kick yourself !";
        } else if (!member.kickable) {
            description = "❌ You can't kick this user !";
        } else {
            member.kick(reason);
            log = true;
            description = `🌪️ **${member.user.username}** has been kicked off the server !`;
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Red);

        interaction.reply({ embeds: [embed] });

        if (log) {
            Logger.log(
                interaction.guild as Guild,
                '🌪️ User kicked',
                interaction.user,
                reason,
                LogLevel.IMPORTANT,
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
