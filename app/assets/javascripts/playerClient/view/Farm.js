/*
 * File: app/view/Farm.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.Farm', {
//------------------------------------------------------------------------------

    extend: 'Ext.draw.Component',
    alias: 'widget.Farm',
    // renderTo: Ext.getBody(),
    id: 'farm',

    // Some basic constants
	//--------------------------------------------------------------------------
    FARM_WIDTH: 445,
	FARM_HEIGHT: 600,

	MAX_FIELDS: 6,
	MAX_FIELDS_PER_ROW: 2,

	FIELD_START_X: 40,
	FIELD_START_Y: 30,

	FIELD_SPACE_X: 200,
	FIELD_SPACE_Y: 160,

	HEALTH_ICON_SIZE: 50,

	//--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = Biofuels;

        app.network.registerListener('changeSettings', this.changeSettings, this);
        app.network.registerListener('getGameInfo', this.updateGameInfo, this);
        app.network.registerListener('advanceStage', this.advanceStage, this);
        app.network.registerListener('getFarmData', this.updateFarmData, this);
        app.network.registerListener('togglePause', this.setPause, this);
        app.network.registerListener('kickPlayer', this.checkKick, this);
    },

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;
        this.farmerName = null;

        this.store1 = Ext.create('Ext.data.JsonStore', {
            storeId: 'loadStore',
            fields: ['plantStage'],
            data: [
              {'plantStage':false}
            ]
        });

        this.initNetworkEvents();

        this.wrapupWindow = Ext.create('Biofuels.view.RoundWrapup')
        this.wrapupWindow.initNetworkEvents()

        // specifies the location as the center of the icon
        // NOTE: here because relies on this.vars being fully init'd?
        this.HEALTH_ICON_X = this.FARM_WIDTH / 2;
        this.HEALTH_ICON_Y = this.FARM_HEIGHT - 105;

        Ext.applyIf(me, {
            items: [{
				type: 'rect',
				width: this.FARM_WIDTH,
				height: this.FARM_HEIGHT,
				fill: '#385'
			}],
		});

        me.callParent(arguments);

        this.fields = new Array();
    },

    setPause: function(json){

        if (WsConnection.webSocket.gameChannel.slice(0,4) == "gen_") return
        if (json.state) {
            var size = Ext.getCmp('viewport').size
            var x = (size.width - 125) / 2
            var y = (size.height - 55) / 2
            Ext.MessageBox.show({msg:'Waiting for Moderator'}).setPosition(x, y);
        }
        else {
            if (!Ext.MessageBox.hidden) Ext.MessageBox.hide();
        }
    },

    //--------------------------------------------------------------------------
    checkKick: function(json) {
        if (json.player == this.farmerName) {
            var size = Ext.getCmp('viewport').size
            var x = (size.width - 125) / 2
            var y = (size.height - 55) / 2
            Ext.MessageBox.alert('','You have been removed from the game',
                function(){
                    Biofuels.network.clearSession()
                    window.location = "/"
                }
            ).setPosition(x, y);
        }
    },

	//--------------------------------------------------------------------------
	createFields: function(num) {

		var count = num;

		if (this.fields.length <= 0) {
			this.addFarmHealthIcon(this.HEALTH_ICON_X, this.HEALTH_ICON_Y,
									this.HEALTH_ICON_SIZE);
		}
        

		if (this.fields.length < this.MAX_FIELDS) {
			if (this.fields.length + count > this.MAX_FIELDS) {
				count = this.MAX_FIELDS - this.fields.length;
			}
            
			var atX = 0;
			var atY = 0;
			// bah, space out
			for (var index = 0; index < this.fields.length; index++ ) {
				atX++;
				if (atX >= this.MAX_FIELDS_PER_ROW) {
					atX = 0;
					atY++;
				}
			} 
			for (var index = 0; index < count; index++ )
			{
				var field = this.addField(atX * this.FIELD_SPACE_X + this.FIELD_START_X,
										atY * this.FIELD_SPACE_Y + this.FIELD_START_Y, index);
				atX++;
				if (atX >= this.MAX_FIELDS_PER_ROW) {
					atX = 0;
					atY++;
				}
			}
		}
    },

    // load farm data from server to update farm
    updateFarmData: function(json){
        console.log(json)
        var me = this;
        this.farmerName = json.farmerName
        Ext.defer(function() {

            var newFields = json.years[json.years.length - 1].fields;
            for(var i = 0; i < newFields.length; i++){
                var crop = newFields[i].crop.toLowerCase();
            
                // if continuous from last season
                if (me.fields.length > i) {
                
                    // plant the appropriate crops
                    if (crop == "corn") me.fields[i].fieldVisuals.plant("fallow");
                    else me.fields[i].fieldVisuals.plant(crop);
                
                    // set the proper management techniques
                    me.fields[i].fieldVisuals.setManagementTechnique("fertilizer", newFields[i].fertilize);
                    me.fields[i].fieldVisuals.setManagementTechnique("tillage", newFields[i].till);
                } 
            
                // if new fields are added or farm is refreshed
                else {
                    me.createFields(1);
                    me.fields[i].fieldData.loadFromServer(json);
                
                    // if we're in the planting stage
                    if (me.currentStage == "Plant") {
                        if (crop == "corn") me.fields[i].fieldVisuals.plant("fallow");
                        else me.fields[i].fieldVisuals.plant(crop);
                    }
                
                    // otherwise
                    else {
                        crop = newFields[i].currentCrop.toLowerCase();
                        me.fields[i].fieldVisuals.plant(crop);
                    }
                }
            }
        }, 900);  
    
        // if it is not year 0, set the field health charts accordingly
        // TODO: is this code doing anything?
        if (json.years.length != 1) {
            var newFields = json.years[json.years.length - 1].fields;
            for (var i = 0; i < this.fields.length; i++) {
                this.fields[i].fieldChart.setSoilHealth(newFields[i].som / 190)
                this.fields[i].fieldChart.setBCI(newFields[i].bci)
                this.fields[i].fieldData.loadFromServer(json);
            }
        }
    },
  
    updateGameInfo: function(json) {
        this.currentStage = json.stage
        this.currentYear = json.year
        this.helpPopupsOn = json.helpPopupsOn
        this.displayStageContent(false)
    },

    advanceStage: function(json){
        this.currentStage = json.stageName
        this.currentYear = json.year
        this.displayStageContent(true)
    },
    
    displayStageContent: function(displayWrapUp) {
        var me = this;
        if (!me.popupWindow) {
            Ext.defer(function() {
                if (me.currentStage == "Plant"){
                    me.showPlantingIcons()
                    me.grown = false;
                    me.wrappedup = false;
            
                    if (me.currentYear != 1 && displayWrapUp) me.wrapupWindow.show()
                    // this seems a little funky...
                    if (!me.planted){
                
                        if(me.currentYear > 1){
                            for (var i = 0; i < me.fields.length; i++) {
                                me.fields[i].fieldVisuals.harvestCrops();
                            };
                            var holder = Ext.getCmp('holderPanel')
                        }
                    }

                    me.planted = true;
                } else me.hidePlantingIcons()

                if (me.currentStage == "Manage") me.showFieldManagementIcons()
                else me.hideFieldManagementIcons()

                if (me.currentStage == "Grow"){
                    if (!me.grown){
                        for (var i = 0; i < me.fields.length; i++) {
                            me.fields[i].fieldVisuals.growCrops();
                        };
                    }
                    me.grown = true;
                }

                if (me.currentStage == "Round Wrap Up"){
                    me.planted = false;

                    if (!me.wrappedup){
                        for (var i = 0; i < me.fields.length; i++) {
                            me.fields[i].fieldVisuals.growCrops();
                        };
                        me.wrappedup = true;
                    }
                }
            }, 1500);
        }
    },

    // Create a new field object (visual representation + underlying data) then
    //	attach it to the farm draw surface
	//--------------------------------------------------------------------------
	addField: function(atX, atY, index) {
    
		var aField = {
			fieldVisuals: Ext.create('Biofuels.view.Field'),
			fieldData: Ext.create('Biofuels.view.FieldData'),
			fieldChart: Ext.create('Biofuels.view.FieldOverlay')
		};
		aField.fieldVisuals.attachTo(this.surface, atX, atY);
		aField.fieldChart.attachTo(aField.fieldData, this.surface, atX, atY);
        aField.fieldChart.index = index;
		
        this.fields.push(aField);
		return aField;
	},

	// place centered at atX, atY
	//-----------------------------------------------------------------------
    addFarmHealthIcon: function(atX, atY, radius) {
    	var path = [{
			type: 'image',
			src: 'resources/field_health_icon.png',
			x: atX - radius / 2,
			y: atY - radius / 2,
			opacity: 0.5,
			width: radius,
			height: radius,
			zIndex: 1000
    	}];

  		var result = this.surface.add(path);
		for (var index = 0; index < result.length; index++) {
			result[index].show(true);
		}

		// Hrm, I guess must add the event on the topmost sprite element?
		result[0].on({
				mouseover: this.onMouseOver,
				mouseout: this.onMouseOut,
				scope: result[0]
		});
		result[0].on({
				click: this.onClick,
				scope: this
		});

		this.healthIcon = result[0];
		var healthI = this.healthIcon;
		Ext.Ajax.request({
			method: 'GET',
			url: "help_text",
			params: {target: healthI.attr.src},
			success: function(result){
				msg = JSON.parse(result.responseText).text
				var tip = Ext.create('Ext.tip.ToolTip', {
					target: healthI.el,
					html: msg,
					anchorToTarget: true,
					anchor: 'left',
					showDelay: Biofuels.helpDelay
				});
			}
		})
    },

    //-----------------------------------------------------------------------
    onMouseOver: function(evt, target) {
    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1.1,
					y: 1.1
				},
				opacity: 1
			}
    	});
	},

    //-----------------------------------------------------------------------
    onMouseOut: function(evt, target) {

    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 0.5
			}
    	});
	},

    //-----------------------------------------------------------------------
    onClick: function(evt, target) {

    	var years = this.getNumberSeasons();

    	if (!this.popupWindow) {
    		this.hideCrops();
    		this.hideFieldManagementIcons();
    		this.popupWindow = Ext.create('Biofuels.view.FieldHealthPopup');
    		this.popupWindow.setSliderCallback(years, this.onDrag, this.onChange, this);
    		//this.popupWindow.setCheckboxCallbacks(this.soilHealthChanged,
    							//this.yieldsChanged, this.showCropsChanged, this);
            this.showFieldHealthPopup();

    		this.popupWindow.on({
				close: function(window, eOpts) {
                    this.hideFieldHealthPopup()
                    
					if(this.currentStage == "Plant"){
                        for (var i = 0; i < this.fields.length; i++) {
                            this.fields[i].fieldVisuals.showPlantingIcon()
                        };
                    }

                    this.showCrops();

					if(this.currentStage == "Manage") this.showFieldManagementIcons();

					this.popupWindow = null;
					this.healthIcon.show(true);
				},
				scope: this
    		});

    		this.healthIcon.hide();
    		this.popupWindow.show();

    		var x = target.getX();
    		var y = target.getY();

    		x -= (this.popupWindow.getWidth() * 0.5);
    		y -= (this.popupWindow.getHeight() * 0.5);
    		this.popupWindow.setPosition(x, y);
    		this.setFieldSeason(0);
    	}
	},

    //-----------------------------------------------------------------------
    showFieldHealthPopup: function() {
        for (var index = 0; index < this.fields.length; index++ ) {
            this.fields[index].fieldChart.show();
        }
    },

    //-----------------------------------------------------------------------
    hideFieldHealthPopup: function() {
        for (var index = 0; index < this.fields.length; index++ ) {
            this.fields[index].fieldChart.hide();
        }
    },
    
    //-----------------------------------------------------------------------
	switchFieldHealthPopup: function(category) {
        if (category == "economy") {
            for (var index = 0; index < this.fields.length; index++ ) {
                this.fields[index].fieldChart.hideEnergy();
                this.fields[index].fieldChart.hideEnvironment();
                this.fields[index].fieldChart.showEconomy();
            }
        } else if (category == "energy") {
            for (var index = 0; index < this.fields.length; index++ ) {
                this.fields[index].fieldChart.hideEconomy();
                this.fields[index].fieldChart.hideEnvironment();
                this.fields[index].fieldChart.showEnergy();
            }
        } else if (category == "environment") {
            for (var index = 0; index < this.fields.length; index++ ) {
                this.fields[index].fieldChart.hideEconomy();
                this.fields[index].fieldChart.hideEnergy();
                this.fields[index].fieldChart.showEnvironment();
            }
        }
        else return
    },

	//-----------------------------------------------------------------------
	showCrops: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			var field = this.fields[index].fieldVisuals;
			field.showCrop();
		}
	},

	//-----------------------------------------------------------------------
	hideCrops: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			var field = this.fields[index].fieldVisuals;
			field.hidePlantingIcon();
			field.hideCrop();
		}
	},
    
    //-----------------------------------------------------------------------
	showPlantingIcons: function() {

		for (var i = 0; i < this.fields.length; i++) {
            this.fields[i].fieldVisuals.showPlantingIcon();
        };
	},

	//-----------------------------------------------------------------------
	hidePlantingIcons: function() {
    
		for (var i = 0; i < this.fields.length; i++) {
            this.fields[i].fieldVisuals.hidePlantingIcon();
        };
	},

	//-----------------------------------------------------------------------
	showFieldManagementIcons: function() {
        
		for (var index = 0; index < this.fields.length; index++ ) {
            this.fields[index].fieldVisuals.showManagementIcons();
		}
	},

	//-----------------------------------------------------------------------
	hideFieldManagementIcons: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			this.fields[index].fieldVisuals.hideManagementIcons();
		}
	},

	//-----------------------------------------------------------------------
	onDrag: function(slider) {
		this.setFieldSeason(slider.getValue());
	},
    
	onChange: function(slider) {
        this.popupWindow.updateYearLabel(slider.getValue());
		this.setFieldSeason(slider.getValue());
	},

	//-----------------------------------------------------------------------
	getNumberSeasons: function() {

		if (this.fields.length <= 0) {
			return 1;
		}
		else {
			return this.fields[0].fieldData.getNumSeasons();
		}
	},

	//-----------------------------------------------------------------------
	setFieldSeason: function(newYear) {

		for (var index = 0; index < this.fields.length; index++ ) {
		  this.fields[index].fieldChart.setCurrentSeason(newYear, index, this.popupWindow.getCurrentChecked());
		}
	}

});
