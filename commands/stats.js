const { CommandInteraction, EmbedBuilder } = require('discord.js');
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
      const serverIconURL = 'https://cdn.discordapp.com/attachments/1141856075251978428/1144995467189567529/cqicon.png?ex=6516d920&is=651587a0&hm=c3a9e5e6b8f5bd10ff9214655379614992abd049274da4921e7cc9080f21b9f4&';
      if (closestMatch) {
        const stats = await getPlayerStats(closestMatch);
        
        const headshotAccuracy = ((stats.headshots / stats.kills) * 100).toFixed(2);
        if (stats) {
          const embed = new EmbedBuilder()
            .setColor('#f5f5f5')
            .setTitle(`${closestMatch}\'s Stats`)
            .addFields(
              { name: 'Total Kills:', value: `${stats.kills}`, inline: true, },
              { name: 'Total Deaths:', value: `${stats.deaths}`, inline: true, },
              { name: 'KDR:', value: `${stats.kdr.toFixed(2)}`, inline: true, },
              { name: 'Headshot Kills:', value: `${stats.headshots}`, inline: true, },
              { name: 'Headshot Accuracy:', value: `${headshotAccuracy} %`, inline: true, },
            )
            .setTimestamp()
            .setFooter({ text: 'Bot provided by Mikey', iconURL: serverIconURL });
      
          // Send the suggestion in the suggestions channel
          await interaction.reply({ embeds: [embed] });
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
