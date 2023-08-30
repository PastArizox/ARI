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
    private static getLogsChannel(guild: Guild): BaseGuildTextChannel | null {
        const channels = guild.channels.cache;
        let result = null;
        channels.forEach((channel) => {
            if (
                channel.type == ChannelType.GuildText &&
                channel.name.toLowerCase().includes('Logs'.toLowerCase())
            ) {
                result = channel as BaseGuildTextChannel;
                return;
            }
        });
        return result;
    }

    private static async createLogsChannel(
        guild: Guild
    ): Promise<BaseGuildTextChannel> {
        const channel = await guild.channels.create({
            name: 'Logs',
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        return channel;
    }

    static async log(
        guild: Guild,
        title: string,
        author: User,
        reason: string,
        level: LogLevel,
        other: LogOtherItem[] = []
    ) {
        let channel = Logger.getLogsChannel(guild);
        if (!channel) {
            channel = await Logger.createLogsChannel(guild);
        }

        let description = `**Author:** ${author} | ${author.id} 
        **Reason:** ${reason}`;

        other.forEach((otherItem) => {
            description += `\n**${otherItem.title}:** ${otherItem.value}`;
        });

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
