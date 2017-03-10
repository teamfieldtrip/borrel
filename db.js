var Sequelize = require('sequelize');

var sequelize = new Sequelize('borrel','borrel','wFiLi1BAVJAffygI', {
	host: 'localhost',
	dialect: 'mysql',
});

var Player = sequelize.define('player', {
	coordinates: {
		type: Sequelize.STRING,
		field: 'coordinates'
	},
	spiritParticles: {
		type: Sequelize.INTEGER,
		field: 'spirit_particles'
	}
}, { freezeTableName: true });


console.log("Syncing Player");

Player.sync({force: true}).then(() => {
	return Player.create({
		coordinates: '2.5161531,2.56186168',
		spiritParticles: 5
	});
});

console.log("Done");
