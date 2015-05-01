/*
 * File: app/view/InformationPanel.js
 */
 
Ext.define('Biofuels.view.InformationPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.informationPanel',
    requires: [
        'Biofuels.view.DisplayBox',
    ],
    title: 'Your Farm\'s Yearly Totals',
    titleAlign: 'center',

    //--------------------------------------------------------------------------
    initNetworkEvents: function () {
        var app = Biofuels;
        app.network.registerListener('joinRoom', this.joinedRoom, this);
        app.network.registerListener('getFarmData', this.update, this);
    },

    //--------------------------------------------------------------------------
    joinedRoom: function (json) {
        this.setTitle("Your Farm's Yearly Totals");
    },

    update: function (json) {
        var year = json.years.length - 1
        var thisYear = json.years[year]
        
        Ext.getCmp("sustainability-score").setVal(Math.round(thisYear.sustainabilityScore * 100))
        Ext.getCmp("sustainability-rank").setVal(thisYear.sustainabilityRank)
        Ext.getCmp("economics-score").setAlt(Math.round(thisYear.capital * 100) / 100)
        Ext.getCmp("economics-score").setVal(Math.round(thisYear.economicScore * 100))
        Ext.getCmp("economics-rank").setVal(thisYear.economicRank)
        Ext.getCmp("environment-score").setVal(Math.round(thisYear.runningEnvironmentScore * 100))
        Ext.getCmp("environment-score").setAlt(Math.round(thisYear.environmentScore * 100))
        Ext.getCmp("environment-rank").setVal(thisYear.environmentRank)
        Ext.getCmp("energy-score").setVal(Math.round(thisYear.runningEnergyScore * 100))
        Ext.getCmp("energy-score").setAlt(Math.round(thisYear.energyScore * 100))
        Ext.getCmp("energy-rank").setVal(thisYear.energyRank)


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
            energyData.corn = Math.round(thisYear.cornEnergy/1000);
            energyData.grass = Math.round(thisYear.grassEnergy/1000);
            energyData.alfalfa = Math.round(thisYear.alfalfaEnergy/1000);

            var econData = {
                'year': i,
                'corn': Math.round(thisYear.cornIncome * 100) / 100,
                'grass': Math.round(thisYear.grassIncome * 100) / 100,
                'alfalfa': Math.round(thisYear.alfalfacropIncome * 100) / 100,
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
        var size = Ext.getBody().getViewSize()
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
            tools: [{
                xtype: 'button',
                id: 'helpButton',
                text: 'Help',
                handler: function () {
                    window.open('https://docs.fieldsoffuel.discovery.wisc.edu/farm-scores-and-graphs');
                }
            }, {
                xtype: 'tbspacer',
                width: 10
            }, {
                xtype: 'button',
                text: 'Bug',
                tooltip: {
                    text: "Report Bug"
                },
                handler: function () {
                    var bug = Ext.create('Biofuels.view.BugWindow').show()
                    var x = (size.width - bug.width) / 2
                    var y = (size.height - bug.height) / 2
                    bug.setPosition(x, y)
                }
            }, {
                xtype: 'tbspacer',
                width: 10
            }, {
                xtype: 'button',
                text: 'Quit',
                tooltip: {
                    text: "Quit Game"
                },
                handler: function () {
                    confirm = Ext.Msg.show({
                        title: 'Remember Session?',
                        msg: 'Do you want to save this game so you can come back to it later?',
                        width: 300,
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function (button) {
                            if (button === 'yes') {
                                window.location = '/'
                            } else if (button === 'no') {
                                Biofuels.network.clearSession()
                                console.log(Ext.getCmp('farm').farmerName)
                                var msg = {
                                    event: 'kickPlayer',
                                    player: Ext.getCmp('farm').farmerName
                                }
                                Biofuels.network.send(JSON.stringify(msg))
                                window.location = '/'
                            } else {}
                        }
                    });
                    var x = (size.width - confirm.width) / 2
                    var y = (size.height - confirm.height) / 2
                    confirm.setPosition(x, y)
                }
            }],
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
                    collapsed: true,
                    collapseFirst: false,
                },
            ]
        });

        me.callParent(arguments);
    }
});
