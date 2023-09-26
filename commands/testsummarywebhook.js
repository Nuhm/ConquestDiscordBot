const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'test',
    description: 'testing',
  },
  async execute(interaction) {
    const testChannelId = '1156347201509916703'; // Replace with the ID of your suggestions channel
    // Fetch the suggestions channel
    const testChannel = await interaction.client.channels.fetch(testChannelId);
  
    if (!testChannel) {
          await interaction.reply({ content: 'Test channel not found.', ephemeral: true });
          return;
    }
    
    const embed = new EmbedBuilder()
        .setColor('#f5f5f5')
        .setTitle('Game Ended')
        .setAuthor({ name: "Result", iconURL: "https://i.imgur.com/sldQb5G.jpeg", url: "https://www.pornhub.com/"})
        .setDescription("suggestion")
        .addFields(
          { name: 'Map:', value: 'Dust II' },
          { name: 'Gamemode:', value: 'FFA (Free For All)' },
          { name: 'Game Start:', value: '5am', inline: true, },
          { name: 'Game Finish:', value: '7am', inline: true, },
        )
        .setImage('https://i.imgur.com/AuVBTzT.png')
        .setTimestamp()
        .setFooter({ text: 'Conquest Suggestion', iconURL: "https://www.pornhub.com/" });
  
    // Send the suggestion in the suggestions channel
    await testChannel.send({ embeds: [embed] });
  },
};