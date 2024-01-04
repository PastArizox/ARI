import {
    CacheType,
    ChatInputCommandInteraction,
    Colors,
    GuildMember,
    PermissionsBitField,
    User,
} from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { SlashCommand } from '../../types';

export const command: SlashCommand = {
    name: 'warn',
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn commands')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .addSubcommand((subCommand) =>
            subCommand
                .setName('add')
                .setDescription('Add a warn to a member')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('The member you want to warn')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('The reason of the warn')
                        .setRequired(false)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('remove')
                .setDescription('Remove a warn from a member')
                .addIntegerOption((option) =>
                    option
                        .setName('id')
                        .setDescription('The id of the warn')
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription(
                            'The member you want the warn to be removed'
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('The reason of the remove of the warn')
                        .setRequired(false)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('list')
                .setDescription('Display the warns of a member')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription(
                            'The member you want the warn to be removed'
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('info')
                .setDescription(
                    'Display the information about a warn of a member'
                )
                .addIntegerOption((option) =>
                    option
                        .setName('id')
                        .setDescription('The id of the warn')
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription(
                            'The member you want the warn to be removed'
                        )
                        .setRequired(true)
                )
        ),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const subCommand = interaction.options.getSubcommand(true);

        switch (subCommand) {
            case 'add':
                await handleAddWarn(interaction);
                break;
            case 'remove':
                await handleRemoveWarn(interaction);
                break;
            case 'list':
                await handleListWarn(interaction);
                break;
            case 'info':
                await handleInfoWarn(interaction);
                break;
            default:
                const embed = new EmbedBuilder()
                    .setTitle('❌ Invalid SubCommand')
                    .setDescription("This SubCommand doesn't exist.")
                    .setColor(Colors.Red);

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
        }
    },
};

async function handleAddWarn(
    interaction: ChatInputCommandInteraction<CacheType>
) {
    const member = interaction.options.getMember('member') as GuildMember;
    const reason =
        interaction.options.getString('reason') || 'No reason provided';

    // Add warn

    interaction.reply(
        `Warn added for ${member.user.username}. Reason: ${reason}`
    );
}

async function handleRemoveWarn(
    interaction: ChatInputCommandInteraction<CacheType>
) {
    const member = interaction.options.getMember('member') as GuildMember;
    const reason =
        interaction.options.getString('reason') || 'No reason provided';
    const idOfWarn = interaction.options.getInteger('id', true);

    // Remove warn

    interaction.reply(
        `Warn with id ${idOfWarn} removed for ${member.user.username}. Reason: ${reason}`
    );
}

async function handleListWarn(
    interaction: ChatInputCommandInteraction<CacheType>
) {
    const member = interaction.options.getMember('member') as GuildMember;
    const warns: Warn[] = [];

    // List warns

    interaction.reply(`Warns of ${member.user.username} : ${warns.toString()}`);
}

async function handleInfoWarn(
    interaction: ChatInputCommandInteraction<CacheType>
) {
    const member = interaction.options.getMember('member') as GuildMember;
    const idOfWarn = interaction.options.getInteger('id', true);
    const warns: Warn[] = [];

    // Show info about the warn

    interaction.reply(`Informations about the warn of ${member.user.username}`);
}

type Warn = {
    title: string;
    reason: string;
    author: User;
    date: string;
};
