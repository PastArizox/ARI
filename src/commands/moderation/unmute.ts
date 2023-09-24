import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    Guild,
    User,
    PermissionsBitField,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'unmute',
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to unmute')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason why you want to unmute the user')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .setDMPermission(false),
    async execute(interaction: CommandInteraction<CacheType>) {
        let member = interaction.options.get('user')?.member as GuildMember;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let description: string;
        let passed = false;

        const mutedRole = interaction.guild?.roles.cache.find(
            (role) => role.name.toLowerCase() === 'muted'
        );

        if (
            mutedRole &&
            member.roles.cache.find(
                (role) =>
                    role.name.toLowerCase() === mutedRole.name.toLowerCase()
            )
        ) {
            description = `🔉 **${member.user.username}** has been unmuted`;
            member.roles.remove(mutedRole);
            passed = true;
        } else {
            description = `❌ **${member.user.username}** is not muted`;
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Green);

        interaction.reply({ embeds: [embed] });

        if (passed) {
            Logger.log(
                interaction.guild as Guild,
                '🔉 User unmuted',
                interaction.member?.user as User,
                reason,
                LogLevel.INFO,
                [
                    {
                        title: 'User unmuted',
                        value: `${member} | ${member.user.id}`,
                    },
                ]
            );
        }
    },
};
