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
const { approveSuggestion } = require('./methods/suggestionApproval');

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

client.on('ready', () => {
  console.log('Bot is ready!');
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
  // Check if the reaction is "✅" and the user is not a bot
  if (reaction.emoji.name === '✅' && !user.bot) {
    const message = reaction.message;

    // Check if the message is in the suggestion channel
    if (message.channel.id === '1141856075717558396') {
      // Call the approveSuggestion function to handle the approval
      try {
        await approveSuggestion(client, message.id); // Pass the client and message ID
      } catch (error) {
        console.error('Error approving suggestion:', error);
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
