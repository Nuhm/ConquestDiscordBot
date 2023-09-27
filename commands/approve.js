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

    try {
      await approveSuggestion(interaction, messageId); // Pass the interaction object
      // Send a response to the user
      await interaction.reply({ content: 'Message approved and updated successfully.', ephemeral: true });
    } catch (error) {
      console.error('Error approving message:', error);
      await interaction.reply({ content: 'An error occurred while approving and updating the message.', ephemeral: true });
    }
  },
};
