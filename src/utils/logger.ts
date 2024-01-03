import { EmbedBuilder } from '@discordjs/builders';
import {
    BaseGuildTextChannel,
    ChannelType,
    Colors,
    Guild,
    PermissionsBitField,
    User,
} from 'discord.js';

class Logger {
    private static async getOrCreateLogsChannel(
        guild: Guild
    ): Promise<BaseGuildTextChannel> {
        const existingChannel = guild.channels.cache.find(
            (channel) =>
                channel.type === ChannelType.GuildText &&
                channel.name.toLowerCase().includes('logs')
        ) as BaseGuildTextChannel;

        if (existingChannel) {
            return existingChannel;
        }

        return await guild.channels.create({
            name: 'logs',
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });
    }

    static async log(
        guild: Guild,
        title: string,
        author: User,
        reason: string,
        level: LogLevel,
        other: LogOtherItem[] = []
    ) {
        const channel = await Logger.getOrCreateLogsChannel(guild);

        const otherInfo = other
            .map((item) => `**${item.title}:** ${item.value}`)
            .join('\n');

        const description = `**Author:** ${author} | ${author.id} 
        **Reason:** ${reason}\n${otherInfo}`;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(level);

        channel.send({ embeds: [embed] });
    }
}

enum LogLevel {
    INFO = Colors.Aqua,
    WARNING = Colors.Orange,
    IMPORTANT = Colors.Red,
}

type LogOtherItem = {
    title: string;
    value: string;
};

export { Logger, LogLevel };
