const { CommandInteraction } = require('discord.js');
const { findClosestMatch, getPlayerStats } = require('../utils'); // Import necessary functions from a utilities file

module.exports = {
  data: {
   name: 'stats',
   description: 'Get player stats',
   options: [
      {
         type: 3, // STRING
         name: 'player',
         description: 'Player name',
         required: true,
      },
   ],
  },
  async execute(interaction) {
    const playerName = interaction.options.getString('player');
    if (!playerName) {
      await interaction.reply({ content: 'Please provide a player name.', ephemeral: true });
      return;
    }

    try {
      const closestMatch = await findClosestMatch(playerName);
      if (closestMatch) {
        const stats = await getPlayerStats(closestMatch);
        if (stats) {
          await interaction.reply({content: `Stats for ${closestMatch}: Kills: ${stats.kills}, Deaths: ${stats.deaths}`, ephemeral: true});
        } else {
          await interaction.reply({content: `Player stats not found for ${closestMatch}.`, ephemeral: true});
        }
      } else {
        await interaction.reply({content: `No close matches found for ${playerName}.`, ephemeral: true});
      }
    } catch (error) {
      console.error('Error finding closest match or fetching player stats:', error);
      await interaction.reply({content: `An error occurred while finding the closest match or fetching player stats.`, ephemeral: true});
    }
  },
};
