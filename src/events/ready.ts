import { ActivityType, Client, Events } from 'discord.js';
import { EventType } from '../types';
import { ownerId } from '../secrets.json';

const event: EventType = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client<true>) {
        console.log(`Bot is ready !`);

        const user = await client.users.fetch(ownerId);

        client.user.setPresence({
            status: 'online',
            afk: false,
            activities: [
                {
                    name: user.username,
                    type: ActivityType.Listening,
                    url: 'https://open.spotify.com/track/63T7DJ1AFDD6Bn8VzG6JE8?si=73fa7a789eb746f2',
                },
            ],
        });

        console.log('===================================================');
        console.log(`Username: ${client.user.username}`);
        console.log(`UserID: ${client.user.id}`);
        console.log(`User status: ${client.user.presence.status}`);
        console.log(`Owner username: ${user.username}`);
        console.log(`Connected on ${client.guilds.cache.size} servers`);
        console.log('===================================================');
    },
};

module.exports = event;
