const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'approve',
    description: 'Approve a message',
    options: [
      {
        type: 3, // STRING
        name: 'message_id',
        description: 'ID of the message to approve',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const suggestionChannelId = '1141856075717558396'; // Use optional chaining to access 'id'

    try {
      if (!suggestionChannelId) {
        await interaction.reply({ content: 'Invalid channel.', ephemeral: true });
        return;
      }

      const suggestionChannel = await interaction.client.channels.fetch(suggestionChannelId);

      if (!suggestionChannel) {
        await interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });
        return;
      }

      // Fetch the original message using the message ID
      const originalMessage = await suggestionChannel.messages.fetch(messageId);

      // Check if the original message exists and has embeds
      if (!originalMessage || !originalMessage.embeds || originalMessage.embeds.length === 0) {
        await interaction.reply({ content: 'Message not found or has no embeds.', ephemeral: true });
        return;
      }

      // Extract the author information from the original message
      const authorName = originalMessage.embeds[0].author ? originalMessage.embeds[0].author.name : 'Unknown Author';
      const authorAvatarURL = originalMessage.embeds[0].author ? originalMessage.embeds[0].author.iconURL : null;

      // Get the server icon URL
      const serverIconURL = interaction.guild.iconURL({ format: 'png', size: 4096 });

      // Create a new MessageEmbed with the updated content
      const updatedEmbed = new EmbedBuilder()
        .setColor('#55ff55')
        .setTitle(originalMessage.embeds[0].title)
        .setDescription(originalMessage.embeds[0].description)
        .setAuthor({ name: authorName, iconURL: authorAvatarURL})
        .setTimestamp()
        .setFooter({ text: 'Approved', iconURL: serverIconURL });

      // Edit the original message to replace the embed with the updated one
      originalMessage.edit({ embeds: [updatedEmbed] });

      // Send a response to the user
      await interaction.reply({ content: 'Message approved and updated successfully.', ephemeral: true });
    } catch (error) {
      console.error('Error approving message:', error);
      await interaction.reply({ content: 'An error occurred while approving and updating the message.', ephemeral: true });
    }
  },
};
