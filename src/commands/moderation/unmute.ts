import {
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    Guild,
    User,
    PermissionsBitField,
    ChatInputCommandInteraction,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

// TODO: Test permissions to write in channels

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
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const member = interaction.options.getMember('user') as GuildMember;
        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        const mutedRole = interaction.guild?.roles.cache.find(
            (role) => role.name.toLowerCase() === 'muted'
        );

        if (mutedRole == undefined) {
            const embed = new EmbedBuilder()
                .setTitle('❌ No-Role')
                .setDescription("The role 'muted' doesn't exist")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const isAlreadyMuted =
            mutedRole && member.roles.cache.has(mutedRole.id);

        const description = isAlreadyMuted
            ? `🔉 **${member.user.username}** has been unmuted`
            : `❌ **${member.user.username}** is not muted`;

        const color = isAlreadyMuted ? Colors.Green : Colors.Red;

        const embed = new EmbedBuilder().setTitle(description).setColor(color);

        interaction.reply({ embeds: [embed], ephemeral: !isAlreadyMuted });

        if (isAlreadyMuted) {
            member.roles.remove(mutedRole);
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
