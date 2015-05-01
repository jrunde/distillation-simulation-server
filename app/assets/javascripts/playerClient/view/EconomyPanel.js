Ext.define('Biofuels.view.EconomyPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.economypanel',
    title: 'Economics',
    layout: 'fit',
    hideCollapseTool: true,
    bodyStyle: 'background-color: #89a',
    listeners: {
        afterrender: function(c) { 
            Ext.Ajax.request({
                method: 'GET',
                url: "help_text",
                params: {target: "Economy Panel"},
                success: function(result){
                    msg = JSON.parse(result.responseText).text
                    var tool = Ext.create('Ext.panel.Tool', {
                        type: (c.collapsed ? 'plus' : 'minus'),
                        tooltip: {
                            text: msg,
                            showDelay: 250
                        },
                        toolOwner: c,
                        handler: function(evt, toolEl, owner, tool) {
                            if (tool.type == 'plus') {
                                owner.expand();
                                tool.setType('minus');
                            } else {
                                owner.collapse();
                                tool.setType('plus');
                            }
                        }
                    })
                    c.header.insert(0,tool);
                    
                    var space1 = Ext.create('Ext.toolbar.Spacer', {
                        type: 'tbspacer', 
                        width: 1,
                    })
                    c.header.insert(2,space1)
                    
                    var button = Ext.create('Ext.Button', {
                        text: ' ? ',
                        handler: function() {
                            window.open('https://docs.fieldsoffuel.discovery.wisc.edu/farm-scores-and-graphs/#economics_graphs');
                        }
                    })
                    c.header.insert(3, button)
                                                        
                    var space2 = Ext.create('Ext.toolbar.Spacer', {
                        type: 'tbspacer', 
                        width: 280,
                    })
                    c.header.insert(4,space2)
                    
                    Ext.Ajax.request({
                        method: 'GET',
                        url: "help_text",
                        params: {target: "Economics Score"},
                        success: function(result){
                            scorebox = Ext.create('Biofuels.view.DisplayBox', {
                                btip: JSON.parse(result.responseText).text,
                                id: 'economics-score',
                                blable: 'Avg Score',
                                altPreUnits: '$',
                                units: '%',
                                altlable: 'Capital',
                                id: 'economics-score',
                                useAlt: true,
                            })
                            c.header.insert(5,scorebox)

                            Ext.Ajax.request({
                                method: 'GET',
                                url: "help_text",
                                params: {target: "Economics Rank"},
                                success: function(result){
                                    rankbox = Ext.create('Biofuels.view.DisplayBox', {
                                        blable: 'Rank',
                                        btip: JSON.parse(result.responseText).text,
                                        id: 'economics-rank'
                                    })
                                    c.header.insert(6,rankbox)
                                }
                            })
                        }
                    })
                }
            })
        }
    },

  items: [
  {
    xtype: 'tabpanel',
    id: 'economy-tab-panel',
    layout: 'fit',
    items: [ 
    {
      xtype: 'chart',
      title: 'Prices',
      background: {
        fill: '#89a'
      },
      theme: 'Category5',
      store: 'pricesStore',
      animate: true,
      legend: {
        position: 'right'
      },
      axes: [
          {
              type: 'Category',
              fields: [
                  'year'
              ],
              position: 'bottom',
              title: 'Year'
          },
          {
              type: 'Numeric',
              fields: [
                  'corn',
                  'alfalfa',
                  'grass'
              ],
              position: 'left',
              title: 'Price ($ / Ton)'
          }
      ],
      series: [
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: [
                'grass'
            ],
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 65,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>grass price: $" + storeItem.get("grass"));
              },
            },
          },
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: [
                'corn'
            ],
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 55,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>corn price: $" + storeItem.get("corn"));
              },
            },
          },
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: [
                'alfalfa'
            ],
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 55,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>alfalfa price: $" + storeItem.get("alfalfa"));
              },
            },
          },
      ]

    },
    {
      id: 'revenue-tab',
      xtype: 'chart',
      title: 'Revenue',
      background: {
        fill: '#89a'
      },
      theme: 'Category5',
      insertPadding: 20,
      store: 'economicsStore',
      animate: true,
      legend: {
        position: 'right'
      },
      axes: [{
          type: 'Numeric',
          position: 'left',
          fields: ['alfalfa','grass','corn'],
          title: 'Revenue ($)',
          minimum: 0,
          adjustMinimumByMajorUnit: 0
      }, {
          type: 'Category',
          position: 'bottom',
          fields: ['year'],
          title: 'Year',
      }],
      series: [
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: [
                'grass'
            ],
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 65,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>grass: $" + storeItem.get("grass"));
              },
            },
          },
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: [
                'corn'
            ],
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 55,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>corn: $" + storeItem.get("corn"));
              },
            },
          },
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: [
                'alfalfa'
            ],
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 55,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>alfalfa: $" + storeItem.get("alfalfa"));
              },
            },
          },
      ]
    },
    {
      xtype: 'chart',
      id: "feed-demand-tab",
      title: 'Feed Market',
      background: {
        fill: '#89a'
      },
      theme: 'Category5',
      store: 'demandStore',
      animate: true,
      legend: {
        position: 'right'
      },
      axes: [
          {
              type: 'Category',
              position: 'bottom',
              fields: ['year'],
              title: 'Year',
          },
          {
              type: 'Numeric',
              fields: ['feed_demand', 'feed_supply'],
              position: 'left',
              title: 'Feed Demand (Tons)',
              hidden: true,
              adjustMinimumByMajorUnit: 0
          }
      ],
      series: [
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: ['feed_demand'],
            title: ['Demand'],
            shadowAttributes: [],
            //dash: [10,10],
            style: {
              'stroke-width': 2,
              'stroke-dasharray': [5,5],
              stroke: '#00f'
            },
            markerConfig: {
              type: 'circle',
              radius: 4,
              'fill': '#00f'
            },
            axis: 'left',
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 65,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>feed demand: Tons" + storeItem.get("feed"));
              },
            },
          },
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            shadowAttributes: [],
            style: {
              'stroke-width': 2,
              'stroke-dasharray': [5,5],
              stroke: '#ff6600'
            },
            markerConfig: {
              type: 'circle',
              radius: 4,
              'fill': '#ff6600'
            },
            xField: 'year',
            yField: ['feed_supply'],
            title: ['Supply'],
            axis: 'left',
            smooth: 3,
            tips: {
              trackMouse: true,
              width: 135,
              height: 65,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>feed demand: Tons" + storeItem.get("feed"));
              },
            },
          },
      ]
    },
    {
      xtype: 'chart',
      id: "fuel-demand-tab",
      title: 'Fuel Market',
      background: {
        fill: '#89a'
      },
      theme: 'Category5',
      store: 'demandStore',
      animate: true,
      legend: {
        position: 'right'
      },
      axes: [
          {
              type: 'Category',
              fields: [
                  'year'
              ],
              position: 'bottom',
              title: 'Year'
          },
          {
              type: 'Numeric',
              fields: ['fuel_demand', 'fuel_supply'],
              position: 'left',
              title: 'Fuel Demand (litres)',
              hidden: true
          },
      ],
      series: [
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            xField: 'year',
            yField: ['fuel_demand'],
            title: ['Demand'],
            style: {stroke: '#00f'},
            markerConfig: {
              type: 'circle',
              radius: 4,
              'fill': '#00f'
            },
            axis:'left',
            smooth: 3,
            tips: {
              trackMouse: false,
              width: 135,
              height: 55,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>fuel demand: liters" + storeItem.get("fuel"));
              },
            },
          },
          {
            type: 'line',
            highlight: {
               size: 4,
               radius: 6
            },
            style: {stroke: '#ff6600'},
            markerConfig: {
              type: 'circle',
              radius: 4,
              'fill': '#ff6600'
            },
            xField: 'year',
            yField: ['fuel_supply'],
            title: ['Supply'],
            axis: 'left',
            smooth: 3,
            tips: {
              trackMouse: false,
              width: 135,
              height: 65,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("year: " + storeItem.get("year") + "<br>feed demand: Tons" + storeItem.get("feed"));
              },
            },
          },
      ]

    }]
  }
  ],
});
/*
turnOnDemandTab(function() {
  console.log("Dynamic markets = " + json.dynamicMarket);
  if(json.dynamicMarket){
    tabs.child('#Demand').tab.show();
  }
});
*/

