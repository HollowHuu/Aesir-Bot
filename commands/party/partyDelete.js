const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('partydelete')
		.setDescription('deletes your party (should not be used normally)'),
	async execute({ interaction: interaction, db: db }) {
        // enter command here
		const user = interaction.user;

        const party = db.prepare('SELECT * FROM party WHERE id = ?').get(user.id);
        if(!party) {
            interaction.reply({content: "You don't have a party.", ephemeral: true});
            return;
        }

        console.log(party.channel)
        try{
            let channel = await interaction.guild.channels.fetch(party.channel)
            console.log(channel);
            channel.delete();
        } catch {
            console.log('channel not found')
        }

        db.prepare('DELETE FROM party WHERE id = ?').run(user.id);

        interaction.reply({ content: 'Deleted your party!', ephemeral: true});


	},
};