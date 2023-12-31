require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    [GatewayIntentBits.GuildMessages],
    [GatewayIntentBits.MessageContent],
    [GatewayIntentBits.GuildMessageReactions],
  ],
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { findClosestMatch, getPlayerStats } = require('./utils'); // Import the functions

const commands = [
  require('./commands/stats'),
  require('./commands/leaderboard'),
  require('./commands/suggestion'),
  require('./commands/approve'),
  require('./commands/testsummarywebhook')
];

// Import the approveSuggestion function from the correct path
const { approveSuggestion, rejectSuggestion } = require('./methods/suggestionManagement');

// Set up the command handler
const commandsArray = commands.map(command => command.data);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commandsArray,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', async () => {
  console.log('Bot is ready!');

  // Replace 'YOUR_GUILD_ID' with your server's ID
  const guild = client.guilds.cache.get('1141856074543145071');

  if (!guild) {
    console.error('Guild not found.');
    return;
  }

  await guild.roles.fetch();
  await guild.channels.fetch();

  const suggestionChannel = guild.channels.cache.get('1141856075717558396'); // Replace with your suggestion channel ID

  if (!suggestionChannel) {
    console.error('Suggestion channel not found.');
    return;
  }

  try {
    // Load the list of suggestion message IDs from suggestionIDs.json
    const suggestionMessageIDs = require('./data/suggestionIDs.json');

    for (const messageID of suggestionMessageIDs) {
      const message = await suggestionChannel.messages.fetch(messageID);
      if (!message) {
        console.error(`Message with ID ${messageID} not found.`);
        continue;
      }
    }
  } catch (error) {
    console.error('Error fetching and processing messages:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.find(cmd => cmd.data.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  const message = await reaction.message.fetch();
  // Check if the reaction is "✅" and the user is not a bot
  if ((reaction.emoji.name === '✅' && !user.bot) || (reaction.emoji.name === '❎' && !user.bot)) {
    const message = reaction.message;

    // Check if the message is in the suggestion channel
    if (message.channel.id === '1141856075717558396') {
      const approvedById = user.id; // Get the user ID who reacted

      // Fetch the GuildMember object for the user
      const guild = client.guilds.cache.get('1141856074543145071'); // Replace with your guild ID

      if (!guild) {
        console.error('Guild not found.');
        return;
      }

      if (message.guild) {
        const member = guild.members.cache.get(user.id);
        //console.log(member);

        const roleName = "Helper";
        const role = guild.roles.cache.find((r) => r.name.toLowerCase() === roleName.toLowerCase());

        if (!role) {
          console.log("There is no role with the name:", roleName);
          return; // Exit the function if the role is not found
        }

        if (!member.roles.cache.has(role.id)) {
          console.log("User doesn't have the required role");
          return;
        }

        if (reaction.emoji.name === '✅' && !user.bot) {
          try {
            await approveSuggestion(client, message.id, approvedById); // Pass the client, message ID, and user ID
          } catch (error) {
            console.error('Error approving suggestion:', error);
          }
        }

        if (reaction.emoji.name === '❎' && !user.bot) {
          try {
            await rejectSuggestion(client, message.id, rejectedById); // Pass the client, message ID, and user ID
          } catch (error) {
            console.error('Error rejecting suggestion:', error);
          }
        }
      } else {
        console.error('Message is not from a guild text channel.');
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);