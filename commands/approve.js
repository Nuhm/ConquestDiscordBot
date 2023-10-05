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
    const approvedById = interaction.user.id;

    // Fetch the GuildMember object for the user
    const guild = guilds.cache.get('1141856074543145071'); // Replace with your guild ID

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

      console.log("Role found:", role.name);

      if (!member.roles.cache.has(role.id)) {
        console.log("User doesn't have the required role");
        return;
      }

      // Call the approveSuggestion function to handle the approval
      try {
        await approveSuggestion(client, messageId, approvedById); // Pass the client, message ID, and user ID
        await interaction.reply({ content: 'Message approved and updated successfully.', ephemeral: true });
      } catch (error) {
        console.error('Error approving suggestion:', error);
        await interaction.reply({ content: 'An error occurred while approving and updating the message.', ephemeral: true });
      }
    } else {
      console.error('Message is not from a guild text channel.');
    }
  }
};
