import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    Role,
    BaseGuildTextChannel,
    Guild,
    User,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

// TODO add permissions check

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
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        let member = interaction.options.get('user')?.member as GuildMember;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let mutedRole = interaction.guild?.roles.cache.find(
            (role) => role.name.toLowerCase() === 'muted'
        );

        if (!mutedRole) {
            mutedRole = await interaction.guild?.roles.create({
                name: 'Muted',
                color: Colors.Grey,
                reason: `Muted role needed by ${interaction.client.user.username} but didn\'t exist`,
            });
        }

        interaction.guild?.channels.cache.forEach((channel) => {
            let textChannel = channel as BaseGuildTextChannel;
            if (!textChannel) return;

            textChannel.permissionOverwrites.create(mutedRole as Role, {
                SendMessages: false,
            });
        });

        let description: string;
        let passed = false;

        if (
            member.roles.cache.find(
                (role) =>
                    role.name.toLowerCase() === mutedRole?.name.toLowerCase()
            )
        ) {
            description = `❌ **${member.user.username}** is already muted`;
        } else {
            description = `🔇 **${member.user.username}** has been muted`;
            member.roles.add(mutedRole as Role);
            passed = true;
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Red);

        interaction.reply({ embeds: [embed] });

        if (passed) {
            Logger.log(
                interaction.guild as Guild,
                '🔇 User muted',
                interaction.member?.user as User,
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
