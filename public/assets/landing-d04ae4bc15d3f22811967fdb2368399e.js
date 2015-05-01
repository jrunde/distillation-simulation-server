
// FIXME: goes to URL via javascript linkage, a.k.a.: window.location = URL;
// This has a couple of limits/issues...example, mousing over does not change the
//	cursor icon like a normal link should...You also cannot specify things like this:
//			data-method="delete" rel="nofollow"
// One alternative might be to consider using SVG Xlinks: http://www.w3.org/wiki/SVG_Links
//	If it's even possible in ExtJS??

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.Landing', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.landing',

    // TODO: Any size should be ok here since the draw component uses a viewBox which should proportionally scale
    //	to whatever size the client window ends up...

	height: Ext.getBody().getViewSize().height,
	width: Ext.getBody().getViewSize().width,
	layout: 'fit',
	// title: 'Temp Window',

	bodyStyle: 'background-color: #112', // dark blue

	//--------------------------------------------------------------------------
	listeners: {
		// surface on the draw component is not available right away, lame...so wait til we render...
		afterRender: function(self, eOpts) {
			self.addAnimatedElements();
		}
	},

	//--------------------------------------------------------------------------
	addAnimatedElements: function() {

		// draw component surface is ready now so we can add sprites programmatically
		var drawSurface = this.getComponent('drawComp').surface;

		// -> Add animated P L A Y
		this.addAnimatedLetter(drawSurface,
								{x: 20, y: 80}, // at pos
								{x: 45, y: 75}, // size
								'game/resources/play_p.png',
								'/game/play');

		this.addAnimatedLetter(drawSurface,
								{x: 60, y: 80}, // at pos
								{x: 30, y: 75}, // size
								'game/resources/play_l.png',
								'/game/play');

		this.addAnimatedLetter(drawSurface,
								{x: 85, y: 95}, // at pos
								{x: 48, y: 60}, // size
								'game/resources/play_a.png',
								'/game/play');

		this.addAnimatedLetter(drawSurface,
								{x: 130, y: 95}, // at pos
								{x: 47, y: 73}, // size
								'game/resources/play_y.png',
								'/game/play');

		// -> Add Player links....
		this.addPlayerLink(drawSurface,
								{x: 20, y: 360},
								'Join Multiplayer Game',
								'/game/play', 14);

		// // -> Add Player links....
		// this.addPlayerLink(drawSurface,
		// 						{x: 40, y: 280},
		// 						'Logout',
		// // FIXME: doesn't handle...data-method="delete" rel="nofollow"
		// 						'/users/sign_out');

		// this.addPlayerLink(drawSurface,
		// 						{x: 40, y: 310},
		// 						'Change User',
 	// 							'/player/change_user');

		// -> Add Discrete links....
		//	Why discrete? Well, just don't want to draw too much attention to them? Maybe?
		//		though I'm sure players will still spot them and click on them anyway...
		this.addDiscreteLink(drawSurface,
								{x: 400, y: 350},
								'Create New Game',
								'/game/moderator');

		this.addDiscreteLink(drawSurface,
								{x: 400, y: 365},
								'View Scoreboard',
								'/game/global');

		this.addDiscreteLink(drawSurface,
								{x: 400, y: 380},
								'Help',
								'/help/home.html');

    // Chrome text
    var sprite = Ext.create('Ext.draw.Sprite', {
      type: 'text',
      text: "Works best with Google Chrome",
      fill: '#610B1F',
      font: '10px',
      x: 20,
      y: 385
    });

    drawSurface.add(sprite);
    sprite.show(true);
	},

	//--------------------------------------------------------------------------
	addAnimatedLetter: function(surface, pos, size, img, url) {

		var sprite = Ext.create('Ext.draw.Sprite', {
			type: 'image',
			src: img,
			width: size.x,
			height: size.y,
			x: pos.x,
			y: pos.y
		});

		surface.add(sprite);
		sprite.show(true);
		sprite.on({
			mouseover: function(targ, evt, eOpts) {
				targ.stopAnimation().animate({
					to: {
						scale: {
							x: 1.2,
							y: 1.4
						}
					},
					duration: 100
				});
			},
			mouseout: function(targ, evt, eOpts) {
				targ.stopAnimation().animate({
					to: {
						scale: {
							x: 1.0,
							y: 1.0
						}
					},
					duration: 500
				});
			},
			click: function() {
				// FIXME: consider replacing the click with SVG Xlinks?
				window.location = url;
			}
		});
	},

	// Downside of this approach is that we don't get a cursor change on mouseover?
	//--------------------------------------------------------------------------
	addPlayerLink: function(surface, pos, text, url, size) {
		if(!size)
			size = 14

		var sprite = Ext.create('Ext.draw.Sprite', {
			type: 'text',
			text: text,
			fill: '#fb4', // orange
			font: size + 'px helvetica',
			x: pos.x,
			y: pos.y
		});

		surface.add(sprite);
		sprite.show(true);
		sprite.on({
			mouseover: function(targ, evt, eOpts) {
				targ.stopAnimation().animate({
					to: {
						scale: {
							x: 1.1,
							y: 1.2
						}
					},
					duration: 100
				});
			},
			mouseout: function(targ, evt, eOpts) {
				targ.stopAnimation().animate({
					to: {
						scale: {
							x: 1,
							y: 1
						}
					},
					duration: 300
				});
			},
			click: function(targ, evt, eOpts) {
				// FIXME: consider replacing the click with SVG Xlinks?
				window.location = url;
			}
		});
	},

	// Not sure this is worth doing but just trying to make players less likley to follow these links?
	// Feel free to remove if you disagree..
	//--------------------------------------------------------------------------
	addDiscreteLink: function(surface, pos, text, url) {

		var sprite = Ext.create('Ext.draw.Sprite', {
			type: 'text',
			text: text,
			fill: '#89f', // blue
			// text shows up instantly before anything else renders so it really stands out...wanted to fade it in
			opacity: 0,
			font: '11px helvetica',
			x: pos.x,
			y: pos.y
		});

		var defaultOpacity = 0.3; // mostly faded out to make it sorta discrete

		surface.add(sprite);
		sprite.show(true).animate({
			to: {
				opacity: defaultOpacity,
			},
			duration: 2000
		});

		sprite.on({
			mouseover: function(targ, evt, eOpts) {
				targ.stopAnimation().animate({
					to: {
						opacity: 1
					},
					duration: 100
				});
			},
			mouseout: function(targ, evt, eOpts) {
				targ.stopAnimation().animate({
					to: {
						opacity: defaultOpacity
					},
					duration: 300
				});
			},
			click: function(targ, evt, eOpts) {
				// FIXME: consider replacing the click with SVG Xlinks?
				window.location = url;
			}
		});
	},

	//--------------------------------------------------------------------------
	initComponent: function() {
		var me = this;
		var size = Ext.getBody().getViewSize()
		if (window.chrome) {
			var ua = navigator.userAgent;
			if (/chrome/i.test(ua)) {
				var uaArray = ua.split(' ')
				version = uaArray[uaArray.length - 2].substr(7).substr(0,2)
			}
			if (version == "34") {
				var alert = Ext.Msg.alert('Browser Requirements', "We've detected that you are using version 34 of Google Chrome as a web browser. This version of Chrome contains bugs that will cause Fields of Fuel to function improperly. We recommend using a different version of Chrome or an up-to-date version of Firefox or Safari. We expect this issue to be resolved by the end of May.");
				var x = (size.width - alert.width) / 2
				var y = (size.height - alert.height) / 2
				alert.setPosition(x,y)
			}
		}

		var win = Ext.create('Ext.window.Window', {
            height: 315,
            width: 575,
            layout: { type: 'absolute' },
            resizable: false,
            closable: false,
            modal: true,
            constrainHeader: true,
            title: 'Version Information',
            items: [{
                    xtype: 'label',
                    text: 'Welcome to Fields of Fuel, a multiplayer game designed to explore the sustainability issues associated with bioenergy crop production.',
                    style: {
			fontSize: '18px',
		    },
		    x: 25,
                    y: 25,
                    width: 520,
                },
		{   xtype: 'label',
		    text: 'This game is currently under development. To explore new features, you can play the Beta Version of the game, which can be found at fieldsoffuelproto.discovery.wisc.edu. Would you like to continue with the Basic Version or switch to the Beta Version?',
		    style: {
			fontSize: '18px',
		    },
		    x: 25,
		    y: 100,
		    width: 520,
		},
                {
                    xtype: 'button',
                    x: 110,
                    y: 220,
                    width: 150,
                    scale: 'medium',
                    text: 'Continue',
                    enabled: false,
                    scope: this,
                    handler: function() {
			win.close()
			}
                },
                {
                    xtype: 'button',
                    x: 285,
                    y: 220,
                    width: 150,
                    scale: 'medium',
                    text: 'Switch',
                    scope: this,
                    handler: function() {
                        window.location = 'http://fieldsoffuelproto.discovery.wisc.edu'
                    }
                }
            ]
        }).show()
		
		Ext.applyIf(me, {
			items: [{
				xtype: 'draw',
				itemId: 'drawComp',
				width: 500,
				height: 400,
				items: [{
					type: 'image',
					src: 'game/resources/farm.png',
					width: 500,
					height: 400
				}]
			}]
		});

		me.callParent(arguments);
	}
});

Ext.onReady(function(){
	Ext.create('Biofuels.view.Landing',{
		renderTo: Ext.getBody()
	}).show()
});
