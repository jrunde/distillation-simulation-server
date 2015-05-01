/* TODO: 1) send data from server via event 'getWrapupInfo'...
 		data format is expected to be:

		some_data: {
			prev: {
				// scores
				sustainabilityScore: blah,
				energyScore: blah,
				environmentScore: blah,
				economicsScore: blah
				// TODO MAYBE? could pass in previous ranks if we cared...
			},
			current: {
				// scores
				sustainabilityScore: blah,
				energyScore: blah,
				environmentScore: blah,
				economicsScore: blah,
				// ranks
				sustainabilityRank: blah,
				energyRank: blah,
				environmentRank: blah,
				economicsRank: blah
			}
		}

TODO: 2) Close button is not hooked up
TODO: 3) misc polish/bug fixes/etc
*/



Ext.define('Biofuels.view.RoundWrapup', {
    extend: 'Ext.window.Window',
    alias: 'widget.roundwrapup',

    height: 270,
    width: 560,
    layout: {
        type: 'absolute'
    },
    closable: false, // force using close button on window...
    title: 'Round Wrap-Up',
    modal: true,
    constrainHeader: true,

    //--------------------------------------------------------------------------
    initNetworkEvents: function() {
        Biofuels.network.registerListener('getFarmData', this.setWrapupInfo, this);
    },

    //--------------------------------------------------------------------------
	setWrapupInfo: function(json){
        var currentYear = json.years[json.years.length - 1]
        var previousYear = json.years[json.years.length - 2]
        
		// prepend 'cur' onto component names...use the current group...display rank
		this.setYearDetail('cur', currentYear, true);

		if (typeof previousYear != 'undefined') {
			// prepend 'prev' onto component names...use the previous group...don't display rank
			this.setYearDetail('last', previousYear, false);

			// only set up/down arrows if we have a prev year to compare with...
			this.setComparisonImages(previousYear, currentYear);
		}

		// allow to close button after form data came in from the server
		Ext.getCmp('close_button').enable();
	},

    //--------------------------------------------------------------------------
	tryAwardMedal: function(componentName, rank) {

		// TODO: verify that the compares will happen numerically? Or are these string compares??
    medal = ''
		if (rank <= 3) {
			var medal = 'resources/medal_third.png';
			if (rank == 2) {
				medal = 'resources/medal_second.png';
			}
			else if (rank == 1) {
				medal = 'resources/medal_first.png';
			}
    }
		Ext.getCmp(componentName).setSrc(medal);
	},

    //--------------------------------------------------------------------------
    setYearDetail: function(idPreTag, subJson, showRank) {

    if(subJson.economicScore > 10)
      subJson.economicScore = 0

    if(subJson.sustainabilityScore > 10)
      subJson.sustainabilityScore = (subJson.environmentScore + subJson.energyScore) / 2

		Ext.getCmp(idPreTag + '_sust_score').setText(Math.round(subJson.sustainabilityScore * 1000) / 10);
		Ext.getCmp(idPreTag + '_energy_score').setText(Math.round(subJson.energyScore * 1000) / 10);
		Ext.getCmp(idPreTag + '_env_score').setText(Math.round(subJson.environmentScore * 1000) / 10);
		Ext.getCmp(idPreTag + '_income_score').setText(Math.round(subJson.economicScore * 1000) / 10);

		if (showRank) {
			Ext.getCmp('sust_rank').setText(subJson.sustainabilityRank);
			this.tryAwardMedal('sust_rank_medal', subJson.sustainabilityRank);

			Ext.getCmp('energy_rank').setText(subJson.energyRank);
			this.tryAwardMedal('energy_rank_medal', subJson.energyRank);

			Ext.getCmp('env_rank').setText(subJson.environmentRank);
			this.tryAwardMedal('env_rank_medal', subJson.environmentRank);

			Ext.getCmp('income_rank').setText(subJson.economicRank);
			this.tryAwardMedal('income_rank_medal', subJson.economicRank);
		}
    },

    //--------------------------------------------------------------------------
    setImg: function(componentName, image) {
    	Ext.getCmp(componentName).setSrc(image);
    },

    //--------------------------------------------------------------------------
    setComparisonImages: function(prev, cur) {

    	var up = 'resources/up_arrow.png';
    	var down = 'resources/down_arrow.png';

        this.setImg('sust_img', (prev.sustainabilityScore < cur.sustainabilityScore) ? up : down);
        this.setImg('energy_img', (prev.energyScore < cur.energyScore) ? up : down);
        this.setImg('env_img', (prev.environmentScore < cur.environmentScore) ? up : down);
        this.setImg('income_img', (prev.economicScore < cur.economicScore) ? up : down);
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;
        
        var size = Ext.getBody().getViewSize()
        var x = (size.width - me.width) / 2
        var y = (size.height - me.height) / 2
        me.setPosition(x, y)

        Ext.applyIf(me, {
            items: [
            { // vertical/left labels ---------
				xtype: 'label',
				x: 60,
				y: 30,
				height: 20,
				width: 160,
				style: {'text-align': 'right'},
				text: 'Overall Sustainability Score'
			},
			{
				xtype: 'label',
				x: 60,
				y: 80,
				height: 20,
				width: 160,
				style: {'text-align': 'right'},
				text: 'Energy Production Score'
			},
			{
				xtype: 'label',
				x: 90,
				y: 120,
				height: 20,
				width: 120,
				style: {'text-align': 'right'},
				text: 'Environmental Score'
			},
			{
				xtype: 'label',
				x: 10,
				y: 160,
				height: 20,
				width: 200,
				style: {'text-align': 'right'},
				text: 'Economic Score'
			},
			{ // horizontal/top labels ---------
				xtype: 'label',
				x: 155,
				y: 10,
				height: 20,
				width: 200,
				style: {'text-align': 'center'},
				text: 'Last Year'
			},
			{
				xtype: 'label',
				x: 235,
				y: 10,
				height: 20,
				width: 200,
				style: {'text-align': 'center'},
				text: 'This Year'
			},
			{
				xtype: 'label',
				x: 355,
				y: 10,
				height: 20,
				width: 200,
				style: {'text-align': 'center'},
				text: 'Rank in Group'
			},
			{ // Sustainability group ---------
				xtype: 'label',
				id: 'last_sust_score',
				x: 240,
				y: 30,
				text: ''
			},
			{
				xtype: 'label',
				id: 'cur_sust_score',
				x: 330,
				y: 30,
				text: ''
			},
			{
				xtype: 'image',
				id: 'sust_img',
				x: 370,
				y: 20,
				height: 40,
				width: 40
			},
			{
				xtype: 'label',
				id: 'sust_rank',
				x: 460,
				y: 30,
				text: ''
			},
			{
				xtype: 'image',
				id: 'sust_rank_medal',
				x: 505,
				y: 20,
				height: 40,
				width: 40
			},
			{ // Energy group ---------
				xtype: 'label',
				id: 'last_energy_score',
				x: 240,
				y: 80,
				text: ''
			},
			{
				xtype: 'label',
				id: 'cur_energy_score',
				x: 330,
				y: 80,
				text: ''
			},
			{
				xtype: 'image',
				id: 'energy_img',
				x: 370,
				y: 70,
				height: 40,
				width: 40
			},
			{
				xtype: 'label',
				id: 'energy_rank',
				x: 460,
				y: 80,
				text: ''
			},
			{
				xtype: 'image',
				id: 'energy_rank_medal',
				x: 505,
				y: 70,
				height: 40,
				width: 40
			},
			{ // Environmental group ---------
				xtype: 'label',
				id: 'last_env_score',
				x: 240,
				y: 120,
				text: ''
			},
			{
				xtype: 'label',
				id: 'cur_env_score',
				x: 330,
				y: 120,
				text: ''
			},
			{
				xtype: 'image',
				id: 'env_img',
				x: 370,
				y: 110,
				height: 40,
				width: 40
			},
			{
				xtype: 'label',
				id: 'env_rank',
				x: 460,
				y: 120,
				text: ''
			},
			{
				xtype: 'image',
				id: 'env_rank_medal',
				x: 505,
				y: 110,
				height: 40,
				width: 40
			},
			{ // Income group ---------
				xtype: 'label',
				id: 'last_income_score',
				x: 240,
				y: 160,
				text: ''
			},
			{
				xtype: 'label',
				id: 'cur_income_score',
				x: 330,
				y: 160,
				text: ''
			},
			{
				xtype: 'image',
				id: 'income_img',
				x: 370,
				y: 150,
				height: 40,
				width: 40
			},
			{
				xtype: 'label',
				id: 'income_rank',
				x: 460,
				y: 160,
				text: ''
			},
			{
				xtype: 'image',
				id: 'income_rank_medal',
				x: 505,
				y: 150,
				height: 40,
				width: 40
			},
			{ // Close Button
				xtype: 'button',
				id: 'close_button',
				x: 310,
				y: 190,
				scale: 'medium',
				text: 'Contine to Next Season',
				disabled: true, // prevent clicking and closing until data appears
        handler: function(){
          me.hide();
        }
				// TODO: add close handler
			}]
        });

        me.callParent(arguments);
    }

});

