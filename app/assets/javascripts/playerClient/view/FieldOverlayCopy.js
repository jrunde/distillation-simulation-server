/*
 * File: app/view/FieldOverlay.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FieldOverlay', {
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    attachTo: function(fieldData, surface, atX, atY) {
    	this.surface = surface;
    	this.fieldData = fieldData;

    	this.atX = atX;
    	this.atY = atY;

    	this.soilScalar = 1.5;
    	this.yieldPos = {
    		x: atX + 20,
    		y: atY + 55
    	};

    	// Soil 'health' color layer
  	this.underlay = surface.add([{
			type: 'rect',
			width: 160,
			height: 120,
			radius: 10,
			x: atX,
			y: atY,
			fill: '#ff0',
			opacity: 0.5,
			zIndex: 500
		}]);

		this.cropSprites = {
			corn: 'resources/corn_icon.png',
			switchgrass: 'resources/grass_icon.png',
      // coverCrop: 'resources/cover_crop_icon.png',
      alfalfa: 'resources/alfalfa_icon.png'
			fallow: 'resources/alfalfa_icon.png'
		};

		this.cropSprite = surface.add([{
			type: 'image',
			src: 'resources/corn_icon.png',
			x: atX-15,
			y: atY-15,
			width: 40,
			height: 40,
			zIndex: 3000
		}]);

		this.fertilizerSprite = surface.add([{
			type: 'image',
			src: 'resources/fertilizer_yes_icon.png',
			x: atX-10,
			y: atY+25,
			width: 30,
			height: 30,
			zIndex: 3000
		}]);

		this.tillSprite = surface.add([{
			type: 'image',
			src: 'resources/till_yes_icon.png',
			x: atX-10,
			y: atY+55,
			width: 30,
			height: 30,
			zIndex: 3000
		}]);

		var testPath = "M" + (atX + 20) + " " + (this.yieldPos.y) +
				"L";

		var seasonStep = 120 / (this.fieldData.seasons.length-1);

		for (var index = 0; index < this.fieldData.seasons.length; index++) {
			testPath += (this.yieldPos.x + seasonStep * index)  + " " +
				(this.yieldPos.y + this.fieldData.seasons[index].soil * -this.soilScalar) + " ";
		}

		var testGrid1 = "M" + (this.yieldPos.x) + " " + (atY + 15) +
						"v85 h120 v-85";
		var testGrid2 = "M" + (this.yieldPos.x) + " " + (this.yieldPos.y) +
						"h120";
		var testGridBg = "M" + (this.yieldPos.x) + " " + (atY + 15) +
						"v85 h120 v-85z";
		this.yieldGridBG = surface.add([{
			type: 'path',
			path: testGridBg,
			'stroke-width': 0,
			fill: '#ffa',
			opacity: 0.5,
			zIndex: 4000
		}]);
		this.yieldGrid = surface.add([{
			type: 'path',
			path: testGrid1,
			stroke: '#000',
			'stroke-width': 1,
			opacity: 0.6,
			zIndex: 4500
		},{
			type: 'path',
			path: testGrid2,
			stroke: '#000',
			'stroke-width': 1,
			opacity: 0.6,
			zIndex: 4500
		}]);


		this.yieldPath = surface.add([{
			type: 'path',
			path: testPath,
			stroke: "#fff",
			'stroke-width': 2,
			zIndex: 5000
		}]);

		this.yieldMarker = surface.add([{
			type: 'circle',
			radius: 3,
			stroke: '#ed3',
			'stroke-width': 1,
			fill: '#346',
			x: (this.yieldPos.x),
			y: (this.yieldPos.y),
			zIndex: 6000
		}]);
    },

    //--------------------------------------------------------------------------
    animateShow: function(object, duration, opacity) {

    	object.stopAnimation().show(true).animate({
    		duration: duration,
    		to: {
    			opacity: opacity
    		}
    	});
    },

    //--------------------------------------------------------------------------
    doHide: function() {

    	this.hide(true);
    },

    //--------------------------------------------------------------------------
    animateHide: function(object) {

    	object.stopAnimation().animate({
			duration: 100,
			to: {
				opacity: 0
			},
			callback: this.doHide,
			scope: object
    	});
    },

    //--------------------------------------------------------------------------
    showYields: function() {

    	this.animateShow(this.yieldGrid[0], 	100, 0.6);
    	this.animateShow(this.yieldGrid[1], 	100, 0.3);
    	this.animateShow(this.yieldGridBG[0], 	100, 0.5);
    	this.animateShow(this.yieldPath[0], 	100, 1);
    	this.animateShow(this.yieldMarker[0], 	100, 1);
    },

    //--------------------------------------------------------------------------
    hideYields: function() {

    	this.animateHide(this.yieldGrid[0]);
    	this.animateHide(this.yieldGrid[1]);
    	this.animateHide(this.yieldGridBG[0]);
    	this.animateHide(this.yieldPath[0]);
    	this.animateHide(this.yieldMarker[0]);
    },

    //--------------------------------------------------------------------------
    showSoilHealth: function() {

    	this.animateShow(this.underlay[0], 100, 0.5);
    },

    //--------------------------------------------------------------------------
    hideSoilHealth: function() {

    	this.animateHide(this.underlay[0]);
    },

    //--------------------------------------------------------------------------
    showCrop: function() {

    	this.animateShow(this.cropSprite[0], 200, 1);
    	this.animateShow(this.fertilizerSprite[0], 200, 1);
    	this.animateShow(this.tillSprite[0], 200, 1);
    },

    //--------------------------------------------------------------------------
    hideCrop: function() {

    	this.animateHide(this.cropSprite[0]);
    	this.animateHide(this.fertilizerSprite[0]);
    	this.animateHide(this.tillSprite[0]);
    },

    //--------------------------------------------------------------------------
    show: function(year) {

    	this.showSoilHealth();
    	this.showCrop();
    	this.showYields();
    },

    //--------------------------------------------------------------------------
    hide: function() {

    	this.hideSoilHealth();
    	this.hideCrop();
    	this.hideYields();
    },

    //--------------------------------------------------------------------------
    animateTo: function(item, opacity, fill, time) {

    	var config;

    	if (time && typeof time != 'undefined') {
    		config.duration = time;
    	}
    	else {
    		config.duration = 100;
    	}

    	if (opacity) {
    		config.to.opacity = opacity;
    	}
    	if (fill) {
    		config.to.fill = fill;
    	}

    	item.stopAnimation().animate(config);
    },

    //--------------------------------------------------------------------------
    setCurrentSeason: function(year) {
      if (this.fieldData.seasons.length == 0){
        console.log("no seasons!")
        return;
      }

    	var newYear = (this.fieldData.seasons.length - 1) + year;
    	var season = this.fieldData.seasons[newYear];

    	var fillColor = '#ff0';

    	if (season.soil <= 30) {
    		fillColor = '#f00';
    	}
    	else if (season.soil >= 100) {
    		fillColor = '#0f0';
    	}
    	else if (season.soil < 50) {
    		fillColor = 'rgb(255,' + (255 + season.soil * 25) + ',0)';
    	}
    	else if (season.soil > 50) {
    		fillColor = 'rgb(' + (255 - season.soil * 25) + ',255,0)';
    	}

    	this.underlay[0].stopAnimation().animate({
			duration: 200,
			to: {
				fill: fillColor,
				opacity: 0.5
			}
    	});

    	this.cropSprite[0].setAttributes({
    			src: this.cropSprites[season.crop]
    		}, true);

		var seasonStep = 120 / (this.fieldData.seasons.length-1);

    	this.yieldMarker[0].stopAnimation().animate({
			duration: 200,
			to: {
				x: (this.yieldPos.x + seasonStep * newYear),
				y: (this.yieldPos.y + season.soil * -this.soilScalar),
				opacity: 1
    		}
    	});

		// fertilizer
    	var targetOpacity = 0;
    	if (season.fertilizer) {
    		targetOpacity = 1;
    	}
    	this.fertilizerSprite[0].stopAnimation().animate({
    		duration: 200,
    		to: {
    			opacity: targetOpacity
    		}
    	});

    	// till
    	targetOpacity = 0;
    	if (season.till) {
    		targetOpacity = 1;
    	}
    	this.tillSprite[0].stopAnimation().animate({
    		duration: 200,
    		to: {
    			opacity: targetOpacity
    		}
    	});
    }

});

