import {
    CacheType,
    Colors,
    CommandInteraction,
    GuildMember,
    SlashCommandBuilder,
    User,
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
        const userOption = interaction.options.get('user') as {
            member?: GuildMember;
        } | null;
        const member = userOption?.member || interaction.member!;
        const { user } = member as { user: User };
        const { username } = user;

        const embed = new EmbedBuilder()
            .setTitle(`${username}'s avatar`)
            .setDescription(
                user.avatarURL() ? null : "This user doesn't have any avatar."
            )
            .setImage(user.avatarURL())
            .setColor(Colors.Yellow);

        await interaction.reply({ embeds: [embed] });
    },
};
