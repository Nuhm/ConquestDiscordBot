const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'suggestion',
    description: 'Post a suggestion',
    options: [
      {
        type: 3, // STRING
        name: 'suggestion',
        description: 'Suggestion',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion');
    const words = suggestion.split(/\s+/); // Split input into words using whitespace as the delimiter

    if (words.length <= 5) { // Check if the number of words is less than or equal to 5
        await interaction.reply({ content: 'Suggestion should be longer than 5 words.', ephemeral: true });
        return;
    }
    try {
      const suggestionChannelId = '1141856075717558396'; // Replace with the ID of your suggestions channel
      // Fetch the suggestions channel
      const suggestionChannel = await interaction.client.channels.fetch(suggestionChannelId);

      if (!suggestionChannel) {
          await interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });
          return;
      }

      const authorName = interaction.user.username; // Get the author's username
      const authorAvatarURL = interaction.user.displayAvatarURL({ format: 'png', size: 4096 }); // Get the author's profile image URL
      const serverIconURL = interaction.guild.iconURL({ format: 'png', size: 4096 }); // Get the server icon URL

      const embed = new EmbedBuilder()
        .setColor('#f5f5f5')
        .setTitle('Suggestion')
        .setDescription(suggestion)
        .setAuthor({ name: authorName, iconURL: authorAvatarURL})
        .setTimestamp()
        .setFooter({ text: 'Conquest Suggestion', iconURL: serverIconURL });

      // Send the suggestion in the suggestions channel
      const suggestionMessage = await suggestionChannel.send({ embeds: [embed] });
      suggestionMessage.react('👍');
      suggestionMessage.react('👎');

      // Send a response to the user
      await interaction.reply({ content: 'Suggestion submitted successfully.', ephemeral: true });
    } catch (error) {
      console.error('Error posting suggestion:', error);
      await interaction.reply({ content: 'An error occurred while posting the suggestion.', ephemeral: true });
    }
  },
};