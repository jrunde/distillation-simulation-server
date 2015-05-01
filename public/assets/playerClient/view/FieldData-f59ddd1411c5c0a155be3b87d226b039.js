/*
 * File: app/view/FieldData.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.SeasonData', {
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
	constructor: function (config) {
	}

});


//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FieldData', {
//------------------------------------------------------------------------------

    id: 'fieldData',
    
	// TEMP: Whips up some FAKE data
    //--------------------------------------------------------------------------
	constructor: function (config) {
		this.seasons = new Array();
	},

    //--------------------------------------------------------------------------
	getNumSeasons: function() {
		return this.seasons.length;
	},

  loadFromServer: function(json){
    this.seasons = new Array();

    for (var y = 0; y < json.years.length; y++) {
        var fields = json.years[y].fields
        this.fields = new Array();
        
        for (var i = 0; i < fields.length; i++) {
            var serverCrop = fields[i].crop.toLowerCase()
            
            var price = 0
            if (serverCrop == "corn") price = json.years[y].cornPrice
            else if(serverCrop == "grass") {
                serverCrop = "switchgrass"
                price = json.years[y].grassPrice
            } 
            
            else if(serverCrop == "alfalfa") {
                serverCrop = "alfalfa"
                price = json.years[y].alfalfaPrice
            }
            
            this.fields.push({
                x: fields[i].x,
                y: fields[i].y,
                crop: serverCrop,
                income: fields[i].income,
                price: price,
                envScore: fields[i].fieldEnvScore,
                costs: fields[i].costs,
                som: fields[i].som,
                bci: fields[i].bci,
                gbi: fields[i].gbi,
                n2o: fields[i].n2o,
                respiration: fields[i].respiration,
                emissions: fields[i].emissions,
                water: fields[i].water,
                fertilize: fields[i].fertilize,
                till: fields[i].till,
                yield: fields[i].yield,
                netEnergy: fields[i].netEnergy,
                productionEnergy: fields[i].productionEnergy,
                refinementEnergy: fields[i].refinementEnergy,
                refineryEnergyIn: fields[i].refineryEnergyIn,
                refineryEnergyOut: fields[i].refineryEnergyOut
            });
        };
        this.seasons.push(this.fields)
    }
  }
});

