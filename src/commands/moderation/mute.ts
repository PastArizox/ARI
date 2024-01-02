import {
    CacheType,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionsBitField,
    ChannelType,
    GuildMember,
    Colors,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

// TODO: Test permissions to write in channels

export const command: SlashCommand = {
    name: 'mute',
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to mute')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason why you want to mute the user')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const member = interaction.options.getMember('user')! as GuildMember;
        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        if (member === interaction.member) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Self-Mute')
                .setDescription("You can't mute yourself!")
                .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const mutedRole =
            interaction.guild!.roles.cache.find(
                (role) => role.name.toLowerCase() === 'muted'
            ) ||
            (await interaction.guild!.roles.create({
                name: 'Muted',
                color: Colors.Grey,
                reason: "Muted role needed by the bot but didn't exist",
            }));

        interaction.guild!.channels.cache.forEach((channel) => {
            const textChannel = channel;
            if (textChannel?.type === ChannelType.GuildText) {
                textChannel.permissionOverwrites.create(mutedRole.id, {
                    SendMessages: false,
                });
            }
        });

        const isAlreadyMuted = member.roles.cache.has(mutedRole.id);

        const description = isAlreadyMuted
            ? `❌ ${member.user.username} is already muted`
            : `🔇 ${member.user.username} has been muted`;

        if (!isAlreadyMuted) {
            await member.roles.add(mutedRole);
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Red);

        await interaction.reply({ embeds: [embed], ephemeral: isAlreadyMuted });

        if (!isAlreadyMuted) {
            Logger.log(
                interaction.guild!,
                '🔇 User muted',
                interaction.user,
                reason,
                LogLevel.IMPORTANT,
                [
                    {
                        title: 'User muted',
                        value: `${member} | ${member.user.id}`,
                    },
                ]
            );
        }
    },
};
