/*
 * File: app/view/InformationPanel.js
 */


Ext.define('BiofuelsGlobal.view.InformationPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.informationPanel',
    name: "",
    requires: [
        'BiofuelsGlobal.view.DisplayBox'
    ],

    //--------------------------------------------------------------------------
    initNetworkEvents: function() {
        var app = BiofuelsGlobal;
        
        app.network.registerListener('joinRoom', this.joinedRoom, this);
        app.network.registerListener('getFarmData', this.update, this);
        app.network.registerListener('getGameInfo', this.handleEconomicGraphs, this);
    },

    //--------------------------------------------------------------------------
    joinedRoom: function(json) {
      this.setTitle(json.userName + "'s Farm's Yearly Totals");
    },

    update: function(json){
        console.log(json)
    
        if(!this.rendered){
            delete this
            return
        }
      
        var year = json.years.length - 1
        var thisYear = json.years[year]
        
        Ext.getCmp("global-sustainability-score").setVal(Math.round(thisYear.sustainabilityScore * 100))
        Ext.getCmp("global-sustainability-rank").setVal(thisYear.sustainabilityRank)
        Ext.getCmp("global-economics-score").setAlt(Math.round(thisYear.capital * 100) / 100)
        Ext.getCmp("global-economics-score").setVal(Math.round(thisYear.economicScore * 100))
        Ext.getCmp("global-economics-rank").setVal(thisYear.economicRank)
        Ext.getCmp("global-environment-score").setVal(Math.round(thisYear.runningEnvironmentScore * 100))
        Ext.getCmp("global-environment-score").setAlt(Math.round(thisYear.environmentScore * 100))
        Ext.getCmp("global-environment-rank").setVal(thisYear.environmentRank)
        Ext.getCmp("global-energy-score").setVal(Math.round(thisYear.runningEnergyScore * 100))
        Ext.getCmp("global-energy-score").setAlt(Math.round(thisYear.energyScore * 100))
        Ext.getCmp("global-energy-rank").setVal(thisYear.energyRank)

        for (var i = 0; i < json.years.length; i++) {
            thisYear = json.years[i]
        
            var envData = {
                'year': i,
                'id': i,
                'rank': thisYear.environmentRank,
                'soil fertility': Math.round(thisYear.som * 100 / 4),
                'beneficial bugs': Math.round(thisYear.bci * 100) / 4,
                'emissions': Math.round(thisYear.emissionsSubscore * 100) /4,
                'farm water': Math.round(thisYear.farmWater * 100),
                'water quality': Math.round(thisYear.farmWater * 100 / 4),
                'farm emissions': Math.round(thisYear.totalEmissions),
                'average emissions': Math.round(thisYear.avgEmissions),
                'average water': Math.round(thisYear.avgWater * 100),
            }

            var sum = thisYear.environmentWeight + thisYear.economyWeight + thisYear.energyWeight
            var sustainData = {
                'year': i,
                'id': i,
                'rank': thisYear.sustainabilityRank,
                'environment': Math.round(thisYear.environmentScore * 100 * thisYear.environmentWeight / sum),
                'economy': Math.round(thisYear.economicScore * 100 * thisYear.economyWeight / sum),
                'energy': Math.round(thisYear.energyScore * 100 * thisYear.energyWeight / sum),
                'percent environment': Math.round(thisYear.environmentScore * 100),
                'percent economy': Math.round(thisYear.economicScore * 100),
                'percent energy': Math.round(thisYear.energyScore * 100),
            }

            var yieldData = {
                'year': i,
                'id': i,
            }
            yieldData.corn = Math.round(thisYear.cornYield * 100) / 100;
            yieldData.alfalfa = Math.round(thisYear.alfalfaYield * 100) / 100;
            yieldData.grass = Math.round(thisYear.grassYield * 100) / 100;

            var energyData = {
            'year': i,
            'id': i,
            }
            energyData.corn = Math.round(thisYear.cornEnergy);
            energyData.grass = Math.round(thisYear.grassEnergy);
            energyData.alfalfa = Math.round(thisYear.alfalfaEnergy);

            var econData = {
                'year': i,
                'corn': Math.round(thisYear.cornIncome * 100) / 100,
                'grass': Math.round(thisYear.grassIncome * 100) / 100,
                'alfalfa': Math.round(thisYear.alfalfaIncome * 100) / 100,
                'id': i,
            }

            var pricesData = {
                'year': i,
                'corn': thisYear.cornPrice,
                'grass': thisYear.grassPrice,
                'alfalfa': thisYear.alfalfaPrice,
                'id': i,
            }
           
            var demandData = {
                'year': i,
                'feed_demand': thisYear.feed_demand,
                'fuel_demand': thisYear.fuel_demand,
                'feed_supply': thisYear.feed_supply,
                'fuel_supply': thisYear.fuel_supply,
                'id': i,
            }

            envStore = Ext.data.StoreManager.lookup('environmentHistoryStore')

            if (envStore.getCount() > 0) {
                var minResp = envStore.getAt(0).get('soil respiration'); // initialise to the first record's id value.
                envStore.each(function(rec) { // go through all the records
                    minResp = Math.min(minResp, rec.get('soil respiration'));
                });
            }

            Ext.data.StoreManager.lookup('environmentHistoryStore').loadRawData(envData, true)
            Ext.data.StoreManager.lookup('sustainabilityStore').loadRawData(sustainData, true)
            Ext.data.StoreManager.lookup('farmYieldStore').loadRawData(yieldData, true)
            Ext.data.StoreManager.lookup('farmEnergyStore').loadRawData(energyData, true)
            Ext.data.StoreManager.lookup('economicsStore').loadRawData(econData, true)
            Ext.data.StoreManager.lookup('pricesStore').loadRawData(pricesData, true)
            Ext.data.StoreManager.lookup('demandStore').loadRawData(demandData, true)
        
        }
        
        minResp = Math.min(minResp, envData["soil respiration"])
        Ext.getCmp('emissionsChart').axes.items[1].minimum = minResp - 20
    },

    initComponent: function () {
        var me = this;

        this.environmentStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'environmentHistoryStore',
            fields: ['year', 'soil fertility', 'water quality', 'farm water', 'average water', 'beneficial bugs', 'emissions', 'farm emissions', 'average emissions', 'rank'],
            data: []
        });

        this.environmentStore.loadRawData([
            {'year': 0, 'id': 0}, 
            {'year': 1, 'id': 1},
            {'year': 2, 'id': 2}, 
            {'year': 3, 'id': 3}, 
            {'year': 4, 'id': 4}, 
            {'year': 5, 'id': 5}, 
        ], true)

        this.sustainabilityStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'sustainabilityStore',
            fields: ['year', 'environment', 'economy', 'energy', 'rank', 'percent environment', 'percent economy', 'percent energy'],
        });

        // for some reason loading the data on creation doesn't work with the IDs
        this.sustainabilityStore.loadRawData([
            {'year': 0, 'id': 0, 'environment': 0, 'economy': 0, 'energy': 0}, 
            {'year': 1, 'id': 1, 'environment': 0, 'economy': 0, 'energy': 0}, 
            {'year': 2, 'id': 2, 'environment': 0, 'economy': 0, 'energy': 0}, 
            {'year': 3, 'id': 3, 'environment': 0, 'economy': 0, 'energy': 0}, 
            {'year': 4, 'id': 4, 'environment': 0, 'economy': 0, 'energy': 0}, 
            {'year': 5, 'id': 5, 'environment': 0, 'economy': 0, 'energy': 0}, 
        ], true)

        this.farmYieldStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'farmYieldStore',
            fields: ['year', 'corn', 'grass', 'alfalfa'],
            data: []
        });

        this.farmEnergyStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'farmEnergyStore',
            fields: ['year', 'corn', 'grass', 'alfalfa'],
            data: []
        });

        this.econStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'economicsStore',
            fields: ['year', 'alfalfa', 'grass', 'corn'],
            data: []
        });

        this.pricesStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'pricesStore',
            fields: ['year', 'corn', 'grass', 'alfalfa'],
            data: []
        });
           
        this.demandStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'demandStore',
            fields: ['year', 'feed_demand', 'fuel_demand', 'feed_supply', 'fuel_supply'],
            data: []
        });

        this.econStore.loadRawData([
            {'year': 0, 'id': 0,}, 
            {'year': 1, 'id': 1,}, 
            {'year': 2, 'id': 2,}, 
            {'year': 3, 'id': 3,}, 
            {'year': 4, 'id': 4,}, 
            {'year': 5, 'id': 5,}, 
        ], true);

        this.initNetworkEvents();

        Ext.applyIf(me, {
            items: [
                {
                    // NOTE: Hidden Panel to allow all visible items to collapse.
                    xtype: 'panel',
                    hidden: true,
                    collapsed: false
                },
                { // Sustainability Panel
                    xtype: 'sustainabilitypanel',
                    collapsed: false,
                    collapseFirst: false,
                },
                { // Economy Panel
                    xtype: 'economypanel',
                    collapsed: true,
                    collapseFirst: false,
                },
                { // Energy Panel
                    xtype: 'energypanel',
                    collapsed: true,
                    collapseFirst: false,
                },
                { // Environment Panel
                    xtype: 'environmentpanel',
                    name: this.name,
                    collapsed: true,
                    collapseFirst: false,
                },
            ]
        });

        me.callParent(arguments);
        this.handleEconomicGraphs();
    },
    
    handleEconomicGraphs: function () {
        
        // handle dynamic market economy graphs
        var on = Ext.getCmp('viewport').dynamic
        var conPanel = Ext.getCmp('economy-tab-panel');
        var feedTab = Ext.getCmp('feed-demand-tab');
        var fuelTab = Ext.getCmp('fuel-demand-tab');
        if(on){
            feedTab.tab.show();
            fuelTab.tab.show();
        } else {
            if(conPanel.getActiveTab()==feedTab || conPanel.getActiveTab()==fuelTab){
                conPanel.setActiveTab(0);
            }
            feedTab.tab.hide();
            fuelTab.tab.hide();
        }

    }
});
