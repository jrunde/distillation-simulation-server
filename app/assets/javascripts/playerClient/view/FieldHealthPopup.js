/*
 * File: app/view/FieldHealthPopup.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FieldHealthPopup', {
//------------------------------------------------------------------------------

    extend: 'Ext.window.Window',
    alias: 'widget.fieldHealthPopup',
    height: 150,
    width: 410,
    title: 'Field Changes Over Time',
    titleAlign: 'center',
    layout: 'fit',
    resizable: false,
    floating: true,
    titleCollapse: true,
    constrainHeader: true,

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
                itemId: 'checkboxPanel',
                width: 400,
				layout: {
					type: 'absolute',
                    align: 'center'
				},
				items: [
          
          // NOT SURE HOW TO PROPERLY IMPLEMENT RADIO BUTTONS
/*
          {
          xtype:'radiogroup',
          width: 330,
          // height:???
          x: 30,
          y: 15,
          columns: 3,
          vertical: false,
          items: [{
            boxLabel: 'Economy',
            name: 'rb',
            itemId: 'economy',
            value: 'economy',
            checked: true,
                    handler: function () {
                        var farm = Ext.getCmp('farm')
                        var economy = me.getComponent('checkboxPanel').getComponent('economy')
                        var energy = me.getComponent('checkboxPanel').getComponent('energy')
                        var environment = me.getComponent('checkboxPanel').getComponent('environment')

                        if (!economy.getValue()) return
                        if (energy.getValue()) energy.setValue(false)
                        if (environment.getValue()) economy.setValue(false)
                        
                        farm.switchFieldHealthPopup("economy")
                    }
          },{
            boxLabel: 'Energy',
            itemId: 'energy',
            value: 'energy',
            name: 'rb',
            checked: false,
                    change: function () {                        
                        var farm = Ext.getCmp('farm')
                        var economy = me.getComponent('checkboxPanel').getComponent('economy')
                        var energy = me.getComponent('checkboxPanel').getComponent('energy')
                        var environment = me.getComponent('checkboxPanel').getComponent('environment')

                        if (!energy.getValue()) return
                        if (economy.getValue()) economy.setValue(false)
                        if (environment.getValue()) environment.setValue(false)
                        
                        farm.switchFieldHealthPopup("energy")
                    }
  			},{
  				boxLabel: 'Environment',
          itemId: 'environment',
          value: 'environment',
          name: 'rb',
  				checked: false,
                    change: function () {
                        var farm = Ext.getCmp('farm')
                        var economy = me.getComponent('checkboxPanel').getComponent('economy')
                        var energy = me.getComponent('checkboxPanel').getComponent('energy')
                        var environment = me.getComponent('checkboxPanel').getComponent('environment')

                        if (!environment.getValue()) return
                        if (energy.getValue()) energy.setValue(false)
                        if (economy.getValue()) economy.setValue(false)
                        
                        farm.switchFieldHealthPopup("environment")
                    }
        }],
//      listeners: {
//        checkchange: function(obj, value){
//          if (!economy.getValue()) return
//          if (energy.getValue()) energy.setValue(false)
//          if (environment.getValue()) environment.setValue(false)
//          console.log('here, here!')
//          console.log(this.getValue().rb)
//          if(this.getValue().rb == "economy"){
//            farm.switchFieldHealthPopup("economy")
//          } else if (this.getValue.rb == "energy"){
//            farm.switchFieldHealthPopup("energy")
//          } else if (this.getValue.rb == "environment"){
//            farm.switchFieldHealthPopup("environment")
//          }
//          //alert(this.getValue().rb);
//        }
//      }
        },
*/
//---------------------------------------------------------------------
// Checkbox field

        {
					xtype: 'checkboxfield',
					itemId: 'economy',
					x: 30,
					y: 15,
					width: 110,
					hideLabel: true,
					boxLabel: 'Economy',
					checked: false,
                    handler: function () {
                        var farm = Ext.getCmp('farm')
                        var economy = me.getComponent('checkboxPanel').getComponent('economy')
                        var energy = me.getComponent('checkboxPanel').getComponent('energy')
                        var environment = me.getComponent('checkboxPanel').getComponent('environment')

                        if (!economy.getValue()) return
                        if (energy.getValue()) energy.setValue(false)
                        if (environment.getValue()) environment.setValue(false)
                        
                        farm.switchFieldHealthPopup("economy")
                    }
				},
				{
					xtype: 'checkboxfield',
					itemId: 'energy',
					x: 165,
					y: 15,
					width: 110,
					hideLabel: true,
					boxLabel: 'Energy',
					checked: false,
                    handler: function () {                        
                        var farm = Ext.getCmp('farm')
                        var economy = me.getComponent('checkboxPanel').getComponent('economy')
                        var energy = me.getComponent('checkboxPanel').getComponent('energy')
                        var environment = me.getComponent('checkboxPanel').getComponent('environment')

                        if (!energy.getValue()) return
                        if (economy.getValue()) economy.setValue(false)
                        if (environment.getValue()) environment.setValue(false)
                        
                        farm.switchFieldHealthPopup("energy")
                    }
				},
				{
					xtype: 'checkboxfield',
                    itemId: 'environment',
					x: 280,
					y: 15,
					width: 110,
					hideLabel: true,
					boxLabel: 'Environment',
					checked: true,
                    handler: function () {
                        var farm = Ext.getCmp('farm')
                        var economy = me.getComponent('checkboxPanel').getComponent('economy')
                        var energy = me.getComponent('checkboxPanel').getComponent('energy')
                        var environment = me.getComponent('checkboxPanel').getComponent('environment')
 
                        if (!environment.getValue()) return
                        if (energy.getValue()) energy.setValue(false)
                        if (economy.getValue()) economy.setValue(false)
                        
                        farm.switchFieldHealthPopup("environment")
                    }
				},

          
//---------------------------------------------------------------------
// SLIDER
//
				{
					xtype: 'slider',
					itemId: 'yearSlider',
                    x: 30,
                    y: 50,
					width: 340,
					value: 0,
					maxValue: 0,
					minValue: -10,
				},
				{
                    xtype: 'button',
                    itemId: 'prevYearLabel',
                    text: '< Previous Year',
                    x: 30,
                    y: 75,
                    width: 125,
                    handler: function(){
                        slider = this.up().getComponent('yearSlider');
                        slider.setValue(slider.getValue() - 1)
                    }
                },
                {
                    xtype: 'label',
                    itemId: 'nowLabel',
                    labelAlign: 'center',
                    x: 198,
                    y: 75,
                    text: 'Now',
                },
                {
                    xtype: 'button',
                    itemId: 'nextYearLabel',
                    text: 'Next Year >',
                    x: 245,
                    y: 75,
                    width: 125,
                    handler: function(){
                        slider = this.up().getComponent('yearSlider');
                        slider.setValue(slider.getValue() + 1)
                    }
                },
                ]
			}],
            tools: [{
                type: 'help',
                tooltip: 'Help Understanding Field Metrics',
                handler: function(event, toolEl, panel) {
                    window.open("https://docs.fieldsoffuel.discovery.wisc.edu/field-scores-and-info/");
                }
            }]
        });
        

        me.callParent(arguments);
        Ext.getCmp('farm').switchFieldHealthPopup("environment")
    },

    //--------------------------------------------------------------------------
    setCheckboxCallbacks: function(soilHealthCB, yieldsCB, cropCB, scope) {

    	var panelBody = this.items.items[0];

    	// economy
       	var check = panelBody.getComponent('economy');

    	check.on({
    		change: soilHealthCB,
    		scope: scope
    	});
    	soilHealthCB.call(scope, check, check.getValue());

    	// energy
    	check = panelBody.getComponent('energy');
    	check.on({
    		change: yieldsCB,
    		scope: scope
    	});
    	yieldsCB.call(scope, check, check.getValue());

    	// environment
    	check = panelBody.getComponent('environment');
    	check.on({
    		change: cropCB,
    		scope: scope
    	});
    	cropCB.call(scope, check, check.getValue());
    },

    //--------------------------------------------------------------------------
    setSliderCallback: function(years, dragCB, changeCB, scope) {

    	var panelBody = this.items.items[0];
       	var slider = panelBody.getComponent('yearSlider');

		this.setSliderNumYears(years);

    	slider.on({
    		drag: dragCB,
    		change: changeCB,
    		scope: scope
    	});

    	changeCB.call(scope, slider);
    },

    updateYearLabel: function(value){
      val = value - this.items.items[0].getComponent('yearSlider').minValue
      this.items.items[0].getComponent('nowLabel').setText(val)
    },

    //--------------------------------------------------------------------------
    setSliderNumYears: function(maxYears) {

    	// FIXME: there some kind of recursive 'get child by itemId' call??
    	var panelBody = this.items.items[0];
       	var slider = panelBody.getComponent('yearSlider');
       	var label1 = panelBody.getComponent('prevYearLabel');
        var label2 = panelBody.getComponent('nextYearLabel');
       	var label3 = panelBody.getComponent('nowLabel');
        if (typeof slider == 'undefined' || typeof label1 == 'undefined' ||
          typeof label2 == 'undefined') {
          return;
        }

       	if (maxYears <= 1) {
       		slider.hide();
       		label1.hide();
       		label2.hide();
            label3.hide();
       	} else {
       		slider.show();
       		label1.show();
            label2.show();
       		label3.show();
       		slider.setMinValue((maxYears - 1) * -1);
       		slider.setValue(0);
            label3.setText(maxYears - 1) // not sure if this code ever executes
       	}
    },
    
    getCurrentChecked: function() {
    
        if (this.getComponent('checkboxPanel').getComponent('economy').getValue())
            return 0
        if (this.getComponent('checkboxPanel').getComponent('energy').getValue())
            return 1
        if (this.getComponent('checkboxPanel').getComponent('environment').getValue())
            return 2
    }

});
