Ext.define('BiofuelsModerator.view.AdvancedPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.advancedpanel',

    height: 548,
    width: 629,
    // title: '',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'panel',
                            height: 494,
                            width: 625,
                            layout: {
                                type: 'absolute'
                            },
                            title: 'Economics',
                            items: [
                                {
                                    xtype: 'slider',
                                    x: 40,
                                    y: 30,
                                    width: 440,
                                    fieldLabel: 'Complexity',
                                    value: 0,
                                    increment: 1,
                                    maxValue: 2
                                },
                                {
                                    xtype: 'numberfield',
                                    x: 40,
                                    y: 100,
                                    width: 530,
                                    fieldLabel: 'Energy Price ($/Gj)',
                                    labelPad: 100
                                },
                                {
                                    xtype: 'numberfield',
                                    x: 40,
                                    y: 150,
                                    width: 530,
                                    fieldLabel: 'Producer Fixed Cost ($/year)',
                                    labelPad: 60,
                                    labelWidth: 140
                                },
                                {
                                    xtype: 'numberfield',
                                    x: 40,
                                    y: 300,
                                    width: 530,
                                    fieldLabel: 'Producer Variable Cost constant',
                                    labelPad: 20,
                                    labelWidth: 180
                                },
                                {
                                    xtype: 'numberfield',
                                    x: 40,
                                    y: 250,
                                    width: 530,
                                    fieldLabel: 'Market Stickiness (1-100)',
                                    labelPad: 100
                                },
                                {
                                    xtype: 'button',
                                    x: 350,
                                    y: 350,
                                    height: 30,
                                    width: 220,
                                    text: 'Apply',
                                    handler: function(){
                                      var msg = {
                                        event: "applyAdvancedSettings",
                                        complexity: this.up().items.items[0].getValue()
                                      }

                                      BiofuelsModerator.network.send(JSON.stringify(msg))
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            height: 494,
                            width: 625,
                            layout: {
                                type: 'absolute'
                            },
                            title: 'Energy',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    x: 40,
                                    y: 70,
                                    width: 560,
                                    fieldLabel: 'Corn Kernel Energy (Mj/Ton)',
                                    labelWidth: 120
                                },
                                {
                                    xtype: 'numberfield',
                                    x: 40,
                                    y: 120,
                                    width: 560,
                                    fieldLabel: 'Corn Stover Energy (Mj/Ton)',
                                    labelWidth: 120
                                },
                                {
                                    xtype: 'numberfield',
                                    x: 40,
                                    y: 170,
                                    width: 560,
                                    fieldLabel: 'Switchgrass Energy (Mj/Ton)',
                                    labelWidth: 120
                                },
                                {
                                    xtype: 'button',
                                    x: 390,
                                    y: 270,
                                    height: 30,
                                    width: 210,
                                    text: 'Apply'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
