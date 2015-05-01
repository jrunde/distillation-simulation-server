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
      // console.log(surface.getXY())

      this.atX = atX;
      this.atY = atY;

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
      fill: '#FF6900',
      opacity: 0.5,
      zIndex: 500
    }]);

    this.cropSprites = {
      corn: 'resources/corn_icon.png',
      switchgrass: 'resources/grass_icon.png',
      alfalfa: 'resources/alfalfa_icon.png',
      fallow: 'resources/nothing_icon.png'
    };
    
    this.cropSprite = surface.add([{
      type: 'image',
      src: '',
      x: atX-15,
      y: atY-15,
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    // economy field values
    this.netIncomeText = surface.add([{
      x:atX + 5,
      y:atY + 95,
      type: "text",
      text: "(Net Income)",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.incomeText = surface.add([{
      x:atX + 5,
      y:atY + 55,
      type: "text",
      text: "(Revenue)",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.costsText = surface.add([{
      x:atX + 5,
      y:atY + 75,
      type: "text",
      text: "(Costs)",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.priceText = surface.add([{
      x:atX + 5,
      y:atY + 35,
      type: "text",
      text: "(Crop Price)",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    // energy field values
    this.yieldText = surface.add([{
      x:atX + 5,
      y:atY + 35,
      type: "text",
      text: "yield",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.energyText = surface.add([{
      x:atX + 5,
      y:atY + 95,
      type: "text",
      text: "Net Energy",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.productionText = surface.add([{
      x:atX + 5,
      y:atY + 75,
      type: "text",
      text: "Production Energy",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.refinementText = surface.add([{
      x:atX + 5,
      y:atY + 55,
      type: "text",
      text: "Refinement Energy",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);

    // environment field values
    this.bciText = surface.add([{
      x:atX + 5,
      y:atY + 55,
      type: "text",
      text: "Beneficial Bugs",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);

    this.emissionsText = surface.add([{
      x:atX + 5,
      y:atY + 75,
      type: "text",
      text: "tons CO2 equivalent",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);

    this.soilText = surface.add([{
      x:atX + 5,
      y:atY + 35,
      type: "text",
      text: "26% Soil Health",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.waterText = surface.add([{
      x:atX + 5,
      y:atY + 95,
      type: "text",
      text: "Water Quality",
      fill: "black",
      font: "14px monospace",
      width: 40,
      height: 40,
      zIndex: 3000
    }]);
    
    this.fertilizerSprite = surface.add([{
      type: 'image',
      src: 'resources/fertilizer_yes_icon.png',
      x: atX+25,
      y: atY-10,
      width: 30,
      height: 30,
      zIndex: 3000
    }]);

    this.tillSprite = surface.add([{
      type: 'image',
      src: 'resources/till_yes_icon.png',
      x: atX+55,
      y: atY-10,
      width: 30,
      height: 30,
      zIndex: 3000
    }]);

    this.fieldHistoryStore = Ext.create('Ext.data.JsonStore', {
        fields: ['year','corn','grass', 'SOC', 'yield'],
    });

    this.chart = Ext.create('Ext.chart.Chart',
    {
        // FIXME: yeah, basically render it to the FarmHolderPanel...
        renderTo: surface.el.dom.parentElement.parentElement,
        animate: true,
        height: 135,
        width: 160,
        // Overlay magic starts here...float, no shadow, place at x, y, etc
        floating: true,
        shadow: false,
        x: atX * 1.1124 + 5,
        y: atY * 1.1217 + 5,
        store: this.fieldHistoryStore,
        insetPadding: 1,
        axes: [{
            type: 'Category',
            fields: ['year'],
            position: 'bottom',
            title: 'Year',
            label: {
              padding: 0 // only helps a bit with getting title up closer to the year #'s
            }
        },
        {
          type: 'Numeric',

            fields: ['corn','grass'],
            position: 'left',
            title: 'yield (ha)',
            minimum: 0,
            maximum: 20,
        }],
        series: [{
          type: 'line',
          highlight: {
             size: 4,
             radius: 6
          },
          tips: {
            trackMouse: true,
            width: 90,
            height: 55,
            layout: 'fit',
            renderer: function(storeItem, item) {
              this.setTitle("year: " + storeItem.get("year") + " yield: " + storeItem.get("corn"));
            },
          },
          axis: 'left',
          xField: 'year',
          yField: 'corn',
          title: 'corn',
          style: {
            fill: "#F9EA01",
            stroke: "#F9EA01"
          },
          smooth: 3
        },
        {
          type: 'line',
          highlight: {
             size: 4,
             radius: 6
          },
          tips: {
            trackMouse: true,
            width: 90,
            height: 55,
            layout: 'fit',
            renderer: function(storeItem, item) {
              this.setTitle("year: " + storeItem.get("year") + " yield: " + storeItem.get("grass"));
            },
          },
          axis: 'left',
          xField: 'year',
          yField: 'grass',
          title: 'grass',
          minimum: 0,
          maximum: 20,
          style: {
            fill: "#008000",
            stroke: "#008000"
          },
          smooth: 3
        }]
      });
      this.chart.hide();
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

    getEnvironmentColor: function(score){
          var color = null
      if(score < .1)
        color = '#FF0500'
      else if(score < .2)
        color = '#FF3700'
      else if(score < .3)
        color = '#FF6900'
      else if(score < .4)
        color = '#FF9B00'
      else if(score < .5)
        color = '#FFCD00'
      else if(score < .6)
        color = '#FFFF00'
      else if(score < .7)
        color = '#C6F700'
      else if(score < .8)
        color = '#8EEF00'
      else if(score < .9)
        color = '#56E700'
      else
        color = '#1EE000'

      return color
    },
    
    getEnergyColor: function(score){
          var color = null
      if(score < 0)
        color = '#FF0500'
      else if(score < 7)
        color = '#FF3700'
      else if(score < 14)
        color = '#FF6900'
      else if(score < 21)
        color = '#FF9B00'
      else if(score < 28)
        color = '#FFCD00'
      else if(score < 35)
        color = '#FFFF00'
      else if(score < 42)
        color = '#C6F700'
      else if(score < 49)
        color = '#8EEF00'
      else if(score < 56)
        color = '#56E700'
      else
        color = '#1EE000'

      return color
    },
    
    getEconomicColor: function(score){
          var color = null
      if(score < -500)
        color = '#FF0500'
      else if(score < 1500)
        color = '#FF3700'
      else if(score < 3500)
        color = '#FF6900'
      else if(score < 5500)
        color = '#FF9B00'
      else if(score < 7000)
        color = '#FFCD00'
      else if(score < 9500)
        color = '#FFFF00'
      else if(score < 11500)
        color = '#C6F700'
      else if(score < 13500)
        color = '#8EEF00'
      else if(score < 15500)
        color = '#56E700'
      else
        color = '#1EE000'

      return color
    },

    setSoilHealth: function(percent){
      atX = this.soilText[0].x
      atY = this.soilText[0].y

      this.soilText[0].setAttributes({
        text:Math.round(percent*190)
      }, false)
      // this.soilText[0].redraw()
    },

    setBCI: function(score){
      this.bciText[0].setAttributes({
        text: Math.round(score*1000)/10
      }, false)
    },

    //--------------------------------------------------------------------------
    showEconomy: function() {
        this.animateShow(this.incomeText[0], 200, 1);
        this.animateShow(this.priceText[0], 200, 1);
        this.animateShow(this.costsText[0], 200, 1);
        this.animateShow(this.netIncomeText[0], 200, 1);
        
        var year = this.fieldData.seasons.length + this.year - 1
        var season = this.fieldData.seasons[year][this.index]
        
        this.underlay[0].stopAnimation().animate({
            duration: 200,
            to: {
                fill: this.getEconomicColor(Math.round(season.income - season.costs)),
                opacity: 0.5
            }
        });
    },
    
    //--------------------------------------------------------------------------
    hideEconomy: function() {
        this.animateHide(this.incomeText[0], 200, 1);
        this.animateHide(this.priceText[0], 200, 1);
        this.animateHide(this.costsText[0], 200, 1);
        this.animateHide(this.netIncomeText[0], 200, 1);
    },
    
    //--------------------------------------------------------------------------
    showEnergy: function() {
        this.animateShow(this.yieldText[0], 200, 1);
        this.animateShow(this.energyText[0], 200, 1);
        this.animateShow(this.productionText[0], 200, 1);
        this.animateShow(this.refinementText[0], 200, 1);
        
        var year = this.fieldData.seasons.length + this.year - 1
        var season = this.fieldData.seasons[year][this.index]
        
        this.underlay[0].stopAnimation().animate({
            duration: 200,
            to: {
                fill: this.getEnergyColor(season.netEnergy),
                opacity: 0.5
            }
        });
    },
    
    //--------------------------------------------------------------------------
    hideEnergy: function() {
        this.animateHide(this.yieldText[0], 200, 1);
        this.animateHide(this.energyText[0], 200, 1);
        this.animateHide(this.productionText[0], 200, 1);
        this.animateHide(this.refinementText[0], 200, 1);
    },
    
    //--------------------------------------------------------------------------
    showEnvironment: function() {
        this.animateShow(this.bciText[0], 200, 1);
        this.animateShow(this.emissionsText[0], 200, 1);
        this.animateShow(this.soilText[0], 200, 1);
        this.animateShow(this.waterText[0], 200, 1);
        
        if (!this.year) this.year = 0
        var year = this.fieldData.seasons.length + this.year - 1
        var season = this.fieldData.seasons[year][this.index]
        
        this.underlay[0].stopAnimation().animate({
            duration: 200,
            to: {
                fill: this.getEnvironmentColor(season.envScore),
                opacity: 0.5
            }
        });
    },
    
    //--------------------------------------------------------------------------
    hideEnvironment: function() {
        this.animateHide(this.bciText[0], 200, 1);
        this.animateHide(this.emissionsText[0], 200, 1);
        this.animateHide(this.soilText[0], 200, 1);
        this.animateHide(this.waterText[0], 200, 1);
    },

    //--------------------------------------------------------------------------
    show: function() {
        this.animateShow(this.cropSprite[0], 200, 1);
        var fillColor = this.underlay[0].fill
        this.animateShow(this.underlay[0], 100, 0.5);
        this.underlay[0].stopAnimation().animate({
            duration: 200,
            to: {
                fill: fillColor,
                opacity: 0.5
            }
        });
        this.showEnvironment();
    },

    //--------------------------------------------------------------------------
    hide: function() {
        this.animateHide(this.cropSprite[0], 200, 1);
        this.animateHide(this.fertilizerSprite[0], 200, 1);
        this.animateHide(this.tillSprite[0], 200, 1);
        this.animateHide(this.underlay[0]);
        this.hideEnvironment();
        this.hideEconomy();
        this.hideEnergy();
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
    setCurrentSeason: function(year, index, check) {
    
      this.index = index;
      this.year = year;
      
      if (this.fieldData.seasons.length == 0) return;

      var newYear = this.fieldData.seasons.length - 1 + year;
      var season = this.fieldData.seasons[newYear][index];
      var income = Math.round(season.income);
      var netIncome = Math.round(season.income - season.costs);
      
      // determine which checkbox to display field color for
      var fillColor;
      if (check == 0) fillColor = this.getEconomicColor(netIncome);
      else if (check == 1) fillColor = this.getEnergyColor(season.netEnergy);
      else fillColor = this.getEnvironmentColor(season.envScore);

      // display underlay color
      this.underlay[0].stopAnimation().animate({
        duration: 200,
        to: {
            fill: fillColor,
            opacity: 0.5
        }
      });
      
      // crop
      this.cropSprite[0].setAttributes({
          src: this.cropSprites[season.crop]
      }, true);
      
      // fertilizer
      if (season.fertilize) this.fertilizerSprite[0].setAttributes({src: 'resources/fertilizer_yes_icon.png'});
      else this.fertilizerSprite[0].setAttributes({src: 'resources/fertilizer_no_icon.png'});
      
      // till
      if (season.till) this.tillSprite[0].setAttributes({src: 'resources/till_yes_icon.png'});
      else this.tillSprite[0].setAttributes({src: 'resources/till_no_icon.png'});
      
      // show the fertilizer option sprites
      this.animateShow(this.fertilizerSprite[0], 200, 1);
      this.animateShow(this.tillSprite[0], 200, 1);
      
      var sub = ""
      if (netIncome < 0) {
        sub = "-"
        netIncome = Math.abs(netIncome)
      }
      
      // netIncome
      this.netIncomeText[0].setAttributes({
          // ideally this would not be summed, but passed in as part of the json message
          text: "=" + sub + "$" + Math.round(netIncome) + " (Net Income)"
      }, true);
      
      // income
      this.incomeText[0].setAttributes({
          text: "$" + Math.round(income) + " (Revenue)"
      }, true);
      
      // costs
      this.costsText[0].setAttributes({
          text: "-$" + Math.round(season.costs) + " (Costs)"
      }, true);
      
      // price
      this.priceText[0].setAttributes({
          text: "$" + Math.round(season.price) + " (Crop Price)"
      }, true);
      
      // SOC value
      this.soilText[0].setAttributes({
          // text: Math.round((season.som/3000)*100) + "% Soil Health"
          text: Math.round((season.som*100)/100) + " Soil Fert (N)"
      }, true);

      // BCI value
      this.bciText[0].setAttributes({
          text: Math.round((season.bci*1000)/10) + "% Beneficial Bugs"
      }, true);

      // Emissions Value
      var emissionsVal
      if(Math.round(season.emissions) >= 0){
        emissionsVal = Math.round(season.emissions);
      } else {
        emissionsVal = 0;
      }
      this.emissionsText[0].setAttributes({

          text: emissionsVal + " tons CO2 eq"
      }, true);
      
      // water quality
      this.waterText[0].setAttributes({
          text: Math.round((season.water*1000)/10) + "% Water Quality"
      }, true);

      // yield
      var text = "0 tons/acre";
      if(season.yield)
        //text = Math.round(season.yield / 40 * 100)/100 + " tons/acre";
        text = Math.round(season.yield * 100 * 0.00110231 / 2.47105)/100 + " tons/acre";
      this.yieldText[0].setAttributes({
          text: text
      }, true);
      
      // net energy
      this.energyText[0].setAttributes({
      text: "=" + Math.round((season.netEnergy + 0.0001) * 10) / 10  + " GJ/acre (Net)   "
      }, true);
      
      // production energy
      this.productionText[0].setAttributes({
          // text: Math.round(-(season.productionEnergy + season.refineryEnergyIn + 0.0001) * 10) / 10 + " GJ/acre (Inputs)"
          text: "  " + Math.round(-(season.productionEnergy + season.refineryEnergyIn) * 10) / 10 + " GJ/acre (In) "
      }, true);
      
      // refinement energy
      var REO = Math.round(season.refineryEnergyOut * 10) / 10;
      var blankLength = 5 - REO.toString().length;
      // console.log("REO.toString().length = " + REO.toString().length);
      // console.log(Array(5 - REO.toString().length).join(" ") + REO + " GJ/acre (Out)");
      this.refinementText[0].setAttributes({
          // text: Math.round((season.refineryEnergyOut + 0.0001) * 10) / 10 + " GJ/acre (Outputs)"
          // text: Math.round(season.refineryEnergyOut * 10) / 10 + " GJ/acre (Out)"
        text: Array(blankLength).join(" ") + REO + " GJ/acre (Out)"
      }, true);
    }
});

