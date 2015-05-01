Ext.define('Biofuels.view.SustainabilityPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sustainabilitypanel',
    title: 'Sustainability',
    cls: 'my-panel',
    layout: 'fit',
    bodyStyle: 'background-color: #89a',
    hideCollapseTool: true,
    listeners: {
        afterrender: function(c) { 
            Ext.Ajax.request({
                method: 'GET',
                url: "help_text",
                params: {target: "Sustainability Panel"},
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
                            window.open('https://docs.fieldsoffuel.discovery.wisc.edu/sustainability/');
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
                        params: {target: "Sustainability Score"},
                        success: function(result){
                            scorebox = Ext.create('Biofuels.view.DisplayBox', {
                                blable: 'Avg Score',
                                units: '%',
                                btip: JSON.parse(result.responseText).text,
                                id: 'sustainability-score'
                            })
                            c.header.insert(5,scorebox)
            
                            Ext.Ajax.request({
                                method: 'GET',
                                url: "help_text",
                                params: {target: "Sustainability Rank"},
                                success: function(result){
                                    rankbox = Ext.create('Biofuels.view.DisplayBox', {
                                        blable: 'Rank',
                                        btip: JSON.parse(result.responseText).text,
                                        id: 'sustainability-rank'
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
      xtype: 'container',
      layout: 'fit',
      items: [
          {
            xtype: 'chart',
            // height: 226,
            // width: 404,
            animate: true,
            insetPadding: 20,
            store: 'sustainabilityStore',
            theme: 'Category4',
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
                      'environment',
                      'economy',
                      'energy',
                    ],
                    minimum: 0,
                    maximum: 100,
                    position: 'left',
                    title: 'Overall Score'
                }
            ],
            series: [
                {
                    type: 'column',
                    
                    // Is this supposed to be here? Looks like a mistake...
//                    label: {
//                        display: 'outside',
//                        field: 'rank',
//                    },

                    xField: 'year',
                    yField: [
                        'environment',
                        'economy',
                        'energy',
                    ],
                    stacked: true,
                    tips: {
                      trackMouse: true,
                      width: 160,
                      height: 70,
                      layout: 'fit',
                      renderer: function(storeItem, item) {
                        this.setTitle("\n energy: " + storeItem.get("percent energy") + "%\n economy: " + storeItem.get("percent economy") + "%\n environment: " + storeItem.get("percent environment") + "%");
                      },
                    },
                }
              ]
            },
          ]
        }
    ],
    
    initComponent: function() {
        var me = this;	
        me.callParent(arguments)
    }
});
