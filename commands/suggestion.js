const { EmbedBuilder } = require('discord.js');

const { addSuggestionID } = require('../methods/suggestionApproval');

const cooldowns = new Map();

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
    const authorId = interaction.user.id;

    // Check if the user is on cooldown
    if (cooldowns.has(authorId)) {
      const cooldownTime = cooldowns.get(authorId);
      const now = Date.now();
      const timeLeft = (cooldownTime - now) / 1000; // Convert to seconds

      if (timeLeft > 0) {
        await interaction.reply({ content: `You are on cooldown. Please wait ${timeLeft.toFixed(1)} seconds.`, ephemeral: true });
        return;
      }
    }

    const suggestion = interaction.options.getString('suggestion');
    const words = suggestion.split(/\s+/); // Split input into words using whitespace as the delimiter

    if (words.length <= 5) { // Check if the number of words is less than or equal to 5
        await interaction.reply({ content: 'Suggestion should be longer than 5 words.', ephemeral: true });
        return;
    }
    try {
      const cooldownTimeMs = 15000; // 15 seconds
      const cooldownExpiry = Date.now() + cooldownTimeMs;
      cooldowns.set(authorId, cooldownExpiry);

      const suggestionChannelId = '1141856075717558396'; // Replace with the ID of your suggestions channel
      // Fetch the suggestions channel
      const suggestionChannel = await interaction.client.channels.fetch(suggestionChannelId);

      if (!suggestionChannel) {
          await interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });
          return;
      }

      const authorName = interaction.user.username; // Get the author's username
      const authorAvatarURL = interaction.user.displayAvatarURL({ format: 'png', size: 4096 }); // Get the author's profile image URL
      const serverIconURL = 'https://cdn.discordapp.com/attachments/1141856075251978428/1144995467189567529/cqicon.png?ex=6516d920&is=651587a0&hm=c3a9e5e6b8f5bd10ff9214655379614992abd049274da4921e7cc9080f21b9f4&';
      const embed = new EmbedBuilder()
        .setColor('#f5f5f5')
        .addFields(
          { name: 'Suggestion:', value: suggestion },
          { name: 'Suggested By:', value: `<@${interaction.user.id}>` },
        )
        .setAuthor({ name: `${authorName}`, iconURL: authorAvatarURL})
        .setTimestamp()
        .setFooter({ text: `Bot provided by Mikey`, iconURL: serverIconURL });

      // Send the suggestion in the suggestions channel
      const suggestionMessage = await suggestionChannel.send({ embeds: [embed] });
      suggestionMessage.react('👍');
      suggestionMessage.react('👎');
      suggestionMessage.react('✅');

      // Save the suggestion ID when a suggestion is created
      await addSuggestionID(suggestionMessage.id);

      // Send a response to the user
      await interaction.reply({ content: 'Suggestion submitted successfully.', ephemeral: true });
    } catch (error) {
      console.error('Error posting suggestion:', error);
      await interaction.reply({ content: 'An error occurred while posting the suggestion.', ephemeral: true });
    }
  },
};