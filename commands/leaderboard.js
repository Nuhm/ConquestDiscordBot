const { CommandInteraction, MessageActionRow, MessageButton } = require('discord.js');
const { getLeaderboard } = require('../utils'); // Import necessary functions from a utilities file

const itemsPerPage = 10; // Number of leaderboard entries per page

module.exports = {
  data: {
    name: 'leaderboard',
    description: 'View the leaderboard',
    options: [
      {
        type: 4, // INTEGER
        name: 'page',
        description: 'Page number',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const page = interaction.options.getInteger('page') || 1;
    if (page < 1) {
      await interaction.reply({ content: 'Page number must be greater than or equal to 1.', ephemeral: true });
      return;
    }

    try {
      const leaderboard = await getLeaderboard(page, itemsPerPage);
      const totalPages = Math.ceil(leaderboard.length / itemsPerPage);

      if (page > totalPages) {
        await interaction.reply({ content: 'Page not found. There are no more pages.', ephemeral: true });
        return;
      }

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const leaderboardPage = leaderboard.slice(startIndex, endIndex);

      const leaderboardMessage = formatLeaderboard(leaderboardPage, page, totalPages);

      await interaction.reply({ content: leaderboardMessage, ephemeral: true });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      await interaction.reply({ content: 'An error occurred while fetching the leaderboard.', ephemeral: true });
    }
  },
};

function formatLeaderboard(entries, currentPage, totalPages) {
   let leaderboardMessage = `**Leaderboard - Page ${currentPage}/${totalPages}**\n\n`;
 
   entries.forEach((entry, index) => {
     leaderboardMessage += `${index + 1}. ${entry.username}: Kills: ${entry.kills}, Deaths: ${entry.deaths}\n`;
   });
 
   return leaderboardMessage;
 }
 
