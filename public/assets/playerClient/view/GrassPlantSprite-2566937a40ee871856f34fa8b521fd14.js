/*
 * File: app/view/GrassPlantSprite.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.GrassPlantSprite', {
//------------------------------------------------------------------------------

	extend: 'Biofuels.view.BasePlantSprite',

	constructor: function (config) {
		this.randomSpriteConfigList = Array([{
			type: 'image',
			src: 'resources/grass_plant.png',
			width: 30,
			height: 50,
			zIndex: 750
		},
		{
			type: 'image',
			src: 'resources/grass_plant_2.png',
			width: 30,
			height: 50,
			zIndex: 750
		}]);
		
		this.harvestedSprite = 'resources/grass_plant_harvested.png';
	}	
	
});

