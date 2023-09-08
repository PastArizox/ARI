import {
    CacheType,
    Colors,
    CommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';

export const command: SlashCommand = {
    name: 'avatar',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar of a user')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to get the avatar')
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: CommandInteraction<CacheType>) {
        let member =
            (interaction.options.get('user')?.member as GuildMember) ||
            interaction.member;
        let user = member.user;

        const username = user.username;
        const avatar = user.avatarURL();

        const embed = new EmbedBuilder()
            .setTitle(`${username}'s avatar`)
            .setDescription(
                avatar ? null : "This user doesn't have any avatar."
            )
            .setImage(avatar)
            .setColor(Colors.Yellow);

        await interaction.reply({ embeds: [embed] });
    },
};
