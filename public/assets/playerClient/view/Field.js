/*
 * File: app/view/Field.js
 *
 * Visual representation of a field
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.Field', {
//------------------------------------------------------------------------------

	requires: [
		'Biofuels.view.CornPlantSprite',
		'Biofuels.view.AlfalfaPlantSprite',
		'Biofuels.view.GrassPlantSprite',
		'Biofuels.view.ToggleSprite',
		'Biofuels.view.AttributesPopup'
	],

  //--------------------------------------------------------------------------
	constructor: function (config) {
		this.crop = new Array();
		var farm = Ext.getCmp('Farm')
		if (Biofuels.view.Farm.fieldNum == null) {
			Biofuels.view.Farm.fieldNum = 0
		}
		this.fieldNum = Biofuels.view.Farm.fieldNum
		Biofuels.view.Farm.fieldNum ++
		this.cropType = "none";
	},

	//--------------------------------------------------------------------------
	attachTo: function(toSurface, atX, atY) {
		var paths = [{
			type: 'rect',
			width: 160,
			height: 120,
			radius: 10,
			x: atX,
			y: atY,
			fill: '#864',
			stroke: '#364',
			'stroke-width': 10
		},
		{
			type: 'image',
			src: 'resources/field_overlay.png',
			x: atX,
			y: atY,
			width: 160,
			height: 120,
		}];
        
		this.surface = toSurface;
		this.atX = atX;
		this.atY = atY;

		var result = toSurface.add(paths);
		this.sprites = result;
		for (var index = 0; index < result.length; index++) {
			result[index].show(true);
		}

		this.addPlantingIcon(toSurface, atX + 5, atY + 105);
		this.addManagementIcons(toSurface, atX + 55, atY + 105);
	},

	//--------------------------------------------------------------------------
	addManagementIcons: function(surface, atX, atY) {

		this.fertilizer = Ext.create('Biofuels.view.ToggleSprite');

        var fieldNum = this.fieldNum;
		regularclick = this.fertilizer.onClick
		this.fertilizer.onClick = function(){
			regularclick.call(this, arguments);
			message = {
                event: 'setFieldManagement',
                field: fieldNum,
                technique: "fertilizer",
                value: (this.stateValue == 1)
            }
            Biofuels.network.send(JSON.stringify(message));
        }

        this.fertilizer.addToSurface(surface, [{
            type: 'image',
            src: 'resources/fertilizer_yes_icon.png',
            state: true,
            x: atX,
            y: atY,
            opacity: 0,
            technique: "fertilizer",
            width: 30,
            height: 30,
            zIndex: 1000
        }], 'resources/fertilizer_no_icon.png', 'resources/fertilizer_yes_icon.png', 'fertilizer');
    
        var me = this
        Ext.Ajax.request({
            method: 'GET',
            url: "help_text",
            params: {target: "Fertilizer"},
            success: function(result){
                msg = JSON.parse(result.responseText).text
                var tip = Ext.create('Ext.tip.ToolTip', {
                    target: me.fertilizer.sprite,
                    html: msg,
                    anchorToTarget: true,
                    anchor: 'right',
                    showDelay: Biofuels.helpDelay
                });
            }
        })

        this.till = Ext.create('Biofuels.view.ToggleSprite');
        regularclick = this.till.onClick
        this.till.onClick = function(){
            regularclick.call(this, arguments);
            message = {
                event: 'setFieldManagement',
                field: fieldNum,
                technique: "tillage",
                value: (this.stateValue == 1)
            }
            Biofuels.network.send(JSON.stringify(message));
		}

        this.till.addToSurface(surface, [{
            type: 'image',
            src: 'resources/till_yes_icon.png',
            state: true,
            x: atX + 35,
            y: atY,
            opacity: 0,
            technique: "till",
            width: 30,
            height: 30,
            zIndex: 1000
        }], 'resources/till_no_icon.png', 'resources/till_yes_icon.png', 'till');
	},

	//--------------------------------------------------------------------------
	showManagementIcons: function() {
    
        var seasons = Ext.getCmp('farm').fields[0].fieldData.seasons
        var last = seasons[seasons.length - 1][this.fieldNum].crop
        var lFert = seasons[seasons.length - 1][this.fieldNum].fertilize
        var lTill = seasons[seasons.length - 1][this.fieldNum].till

        if (!this.cropType.localeCompare("grass")) {
            var established = (last == "switchgrass");
        }
        if (!this.cropType.localeCompare("alfalfa")){
            var established = (last == "alfalfa");
        }
        
        if (Ext.getCmp('farm').fields[0].fieldData.seasons.length == 1) {
            this.till.setState(true)
            this.till.opacity = 1;
            this.till.show();
           
            this.fertilizer.setState(true)
            this.fertilizer.opacity = 1;
            this.fertilizer.show();
        } else {
        
            if(!established){
                if (!lTill) this.till.setState(false)
                this.till.opacity = 1;
                this.till.show();
            }
            if (!lFert) this.fertilizer.setState(false)
            this.fertilizer.opacity = 1;
            this.fertilizer.show();
        }
	},

	//--------------------------------------------------------------------------
	hideManagementIcons: function() {
		this.fertilizer.hide();
		this.till.hide();
	},

	//--------------------------------------------------------------------------
	setManagementTechnique: function(technique, state) {
		
        var targetObj = null;
		if (technique=="fertilizer") {
			var targetObj = this.fertilizer;
		}
		else if (technique=="tillage") {
			var targetObj = this.till;
		}

		if (targetObj) {
            if ((targetObj.stateValue == 1) != state) {
                targetObj.changeState();
            }
        }
	},

	//--------------------------------------------------------------------------
	addPlantingIcon: function(surface, atX, atY) {
		var path = [{
			type: 'image',
			src: 'resources/planting_icon.png',
			x: atX,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
		}];

		var result = surface.add(path);
		this.plantingIcon = result[0];

		this.plantingIcon.show(true);
		this.setPlantingIconListeners();

		this.popup = Ext.create('Biofuels.view.PlantPopup');
		this.popup.createForSurface(this.surface, atX, atY);
	},

	//--------------------------------------------------------------------------
	setPlantingIconListeners: function() {
		this.plantingIcon.on({
			mouseover: this.onMouseOver,
			mouseout: this.onMouseOut,
			scope: this.plantingIcon
		});
		
		this.plantingIcon.on({
			click: this.onClick,
			scope: this
		});
        
        var me = this;
        Ext.Ajax.request({
			method: 'GET',
			url: "help_text",
			params: {target: "Planting Icon"},
			success: function(result){
				msg = JSON.parse(result.responseText).text
				var tip = Ext.create('Ext.tip.ToolTip', {
					target: me.plantingIcon.el,
					html: msg,
					anchorToTarget: true,
					anchor: 'right',
					showDelay: Biofuels.helpDelay
				});
			}
		})
	},

	//--------------------------------------------------------------------------
	showPlantingIcon: function() {
    
		this.plantingIcon.stopAnimation().show(true).animate({
			duration: 100,
			to: {
				opacity: 1
			}
		});

		this.setPlantingIconListeners();
	},

	//--------------------------------------------------------------------------
	hidePlantingIcon: function() {
    
		this.plantingIcon.stopAnimation().animate({
			duration: 100,
			to: {
				opacity: 0
			},
			callback: this.doHide,
			scope: this.plantingIcon
		});
        
		this.plantingIcon.clearListeners();
	},

	//--------------------------------------------------------------------------
	doHide: function() {
		this.hide(true);
	},

	//--------------------------------------------------------------------------
	onMouseOver: function(evt, target) {
		this.stopAnimation().animate({
			duration:100,
			to: {
				scale: {
					x: 1.5,
					y: 1.5
				},
				opacity: 1
			}
		});


	},

	//--------------------------------------------------------------------------
	onMouseOut: function(evt, target) {
		this.stopAnimation().animate({
			duration:100,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 1
			}
		});

		if(this.infoPopup)
			this.infoPopup.hide()
	},

	// cropType: grass, corn, none, cancel
	//--------------------------------------------------------------------------
	onPlantingClickHandler: function(cropType) {
		var msg = {
			event: 'plantField',
			field: this.fieldNum,
			crop: cropType
		};
		Biofuels.network.send(JSON.stringify(msg))
		this.plant(cropType)
		this.fadeCrops()
	},

	//--------------------------------------------------------------------------
  plant: function(cropType){
    if (!cropType.localeCompare("cancel")) return;
    
    if (this.cropType != cropType) {
      this.removeOldCrop();
      if (!cropType.localeCompare("corn")) {
      	this.plantPatternRows(this.surface, 'Biofuels.view.CornPlantSprite');
      }
      else if (!cropType.localeCompare("grass")) {
        this.plantPatternAlternating(this.surface, 'Biofuels.view.GrassPlantSprite');
      }
      else if (!cropType.localeCompare("alfalfa")) {
        this.plantPatternAlternating(this.surface, 'Biofuels.view.AlfalfaPlantSprite');
      }
      this.cropType = cropType;
    }
  },

  delayPlant: function(cropType, delay){
    Ext.defer(this.plant(cropType), delay)
  },

	//--------------------------------------------------------------------------
	onClick: function(evt, target) {
		this.popup.showPopup(this.onPlantingClickHandler, this);
	},

	//--------------------------------------------------------------------------
	removeOldCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].removeFromSurface();
		}
		this.crop.length = 0;
	},

	//--------------------------------------------------------------------------
	showCrop: function() {
    
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].sprite.show(true);
		}
	},

	//--------------------------------------------------------------------------
	hideCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].sprite.hide(true);
		}
	},

	//--------------------------------------------------------------------------
	plantPatternRows: function(surface, createType) {
		var cx = 0, cy = 0;

		for (var plants = 0; plants < 16; plants++ ) {
			var rAtX = cx + this.atX + 12;
			var rAtY = cy + this.atY - 22;

			var aPlant = Ext.create(createType);
			aPlant.addToSurface(surface, rAtX, rAtY, 1000 + Math.random() * 500);

			cx += 35;
			if (cx >= 120) {
				cx = 0;
				cy += 30;
			}
			this.crop.push(aPlant);
		}
        
        var stage = Ext.getCmp('farm').currentStage
        if (stage == "Plant" || stage == "Manage") this.fadeCrops();
	},

	//--------------------------------------------------------------------------
	plantPatternAlternating: function(surface, createType) {
		var cx = 0, cy = 0;
        
        var stage = Ext.getCmp('farm').currentStage
        var seasons = Ext.getCmp('farm').fields[0].fieldData.seasons
        var last = seasons[seasons.length - 1][this.fieldNum].crop
        var established = (last == "switchgrass" || last == "alfalfa")
        
        for (var plants = 0; plants < 14; plants++ ) {
			var rAtX = cx + this.atX + 12;
			var rAtY = cy + this.atY - 22;

			var aPlant = Ext.create(createType);
			aPlant.addToSurface(surface, rAtX, rAtY, 1200 + Math.random() * 800);
        
            if ((stage == "Plant" || stage == "Manage") && established) aPlant.harvest();
            else if (stage == "Harvest"); 
            
			cx += 35;
			if (cx > 105) {
				cx -= 140;
				cx += (35 / 2);
				cy += 30;
			}
			this.crop.push(aPlant);
		}   

        if (stage == "Plant" || stage == "Manage") this.fadeCrops();
	},

	//--------------------------------------------------------------------------
    fadeCrops: function(){
		for (var i = 0; i < this.crop.length; i++) {
			this.crop[i].setOpacity(0.4)
		};
    },

	//--------------------------------------------------------------------------
    unfadeCrops: function(){
		for (var i = 0; i < this.crop.length; i++) {
			this.crop[i].setOpacity(1)
		};
    },


    growAndHarvestCrops: function(){
        this.growCrops();
        for (var i = 0; i < this.crop.length; i++) {
            this.crop[i].scheduleHarvest(4000 + i*50);
        };
    },

	//--------------------------------------------------------------------------
    growCrops: function(){
		this.unfadeCrops();
		for (var i = 0; i < this.crop.length; i++) {
			this.crop[i].grow(4000);
        };
    },

	//--------------------------------------------------------------------------
    harvestCrops: function() {
		for (var i = 0; i < this.crop.length; i++) {
			this.crop[i].scheduleHarvest(i*50);
		};
    }
});

