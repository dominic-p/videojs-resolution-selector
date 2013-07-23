/**
 * Video.js Resolution Selector
 *
 * This plugin for Video.js adds a resolution selector option
 * to the toolbar. Usage:
 *
 * <video>
 * 	<source data-res="480" src="..." />
 * 	<source data-res="240" src="..." />
 * </video>
 */

(function( _V_ ) {
	
	var methods = {
		
		extend : function( destination, source ) {
			
			for ( var prop in source ) {
				
				if ( typeof source[prop] == 'object' && null !== source[prop] ) {
					
					destination[prop] = methods.extend( destination[prop] || {}, source[prop] );
					
				} else {
					
					destination[prop] = source[prop];
				}
			}
			
			return destination;
		}
	};
	
	/***********************************************************************************
	 * Setup our resolution menu items
	 ***********************************************************************************/
	_V_.ResolutionMenuItem = _V_.MenuItem.extend({
		
		/** @constructor */
		init : function( player, options ){
			
			// Modify options for parent MenuItem class's init.
			options['label'] = options.res + 'p';
			options['selected'] = ( options.res === player.getCurrentRes() );
			
			_V_.MenuItem.call( this, player, options );
			
			this.resolution = options.res;
			
			// Toggle the selected class whenever the resolution changes
			player.on( 'changeRes', _V_.bind( this, function() {
				
				if ( this.resolution == player.getCurrentRes() ) {
					
					this.selected( true );
					
				} else {
					
					this.selected( false );
				}
			}));
		}
	});
	
	// Handle clicks on the menu items
	_V_.ResolutionMenuItem.prototype.onClick = function() {
		
		// Call the parent click handler
		_V_.MenuItem.prototype.onClick.call( this );
		
		var player = this.player(),
			current_time = player.currentTime(),
			is_paused = player.paused();
		
		// Do nothing if we aren't changing resolutions
		if ( player.getCurrentRes() == this.resolution ) { return; }
		
		// Change the source and make sure we don't start the video over
		player.src( player.availableRes[this.resolution] ).one( 'loadedmetadata', function() {
			
			player.currentTime( current_time );
			
			if ( !is_paused ) { player.play(); }
		});
		
		// Save the newly selected resolution in our player options property
		player.currentRes = this.resolution;
		
		// Update the classes to reflect the currently selected resolution
		player.trigger( 'changeRes' );
	};
	
	/***********************************************************************************
	 * Setup our resolution menu title item
	 ***********************************************************************************/
	 _V_.ResolutionTitleMenuItem = _V_.MenuItem;
	 
	 _V_.ResolutionTitleMenuItem.prototype.onClick = function() {}
	
	/***********************************************************************************
	 * Define our resolution selector button
	 ***********************************************************************************/
	_V_.ResolutionSelector = _V_.MenuButton.extend({
		
		/** @constructor */
		init : function( player, options ) {
			
			// Add our list of available resolutions to the player object
			player.availableRes = options.available_res;
			
			// Call the parent constructor
			_V_.MenuButton.call( this, player, options );
			
			// Hide the button if we have 2 or fewer items (one will be the title item)
			if ( this.items.length <= 2 ) {
				
				this.hide();
			}
		}
	});
	
	// Create a menu item for each available resolution
	_V_.ResolutionSelector.prototype.createItems = function() {
		
		var player = this.player(),
			items = [],
			current_res;
		
		// Add the menu title item
		items.push( new _V_.ResolutionTitleMenuItem( player, {
			
			el : _V_.Component.prototype.createEl( null, {
				
				className	: 'vjs-res-menu-title',
				innerHTML	: 'Video Quality'
				
			})
		}));
		
		// Add an item for each available resolution
		for ( current_res in player.availableRes ) {
			
			if ( 'length' == current_res ) { continue; }
			
			items.push( new _V_.ResolutionMenuItem( player, {
				res : current_res
			} ) );
		}
		
		return items;
	}
	
	// The main plugin function
	_V_.plugin( 'resolutionSelector', function( options ) {
		
		// Override default options with those provided
		var player = this,
			sources	= player.options().sources,
			i = sources.length,
			j,
			found_type,
			settings = methods.extend({
				
				default_res	: null,		// (string)	The resolution that should be selected by default
				force_types	: false		// (array)	List of media types. If passed, we need to have source for each type in each resolution or that resolution will not be an option
				
			}, options || {} ),
			available_res = { length : 0 },
			current_res,
			resolutionSelector;
		
		// Get all of the available resoloutions
		while ( i > 0 ) {
			
			i--;
			
			if ( ! 'data-res' in sources[i] ) { continue; }
			
			current_res = sources[i]['data-res'];
			
			if ( typeof available_res[current_res] !== 'object' ) {
				
				available_res[current_res] = [];
				available_res.length++;
			}
			
			available_res[current_res].push( sources[i] );
		}
		
		// Check for forced types
		if ( settings.force_types ) {
			
			// Loop through all available resoultions
			for ( current_res in available_res ) {
				
				i = settings.force_types.length;
				
				// For each resolution loop through the required types
				while ( i > 0 ) {
					
					i--;
					
					j = available_res[current_res].length;
					found_types = 0;
					
					// For each required type loop through the available sources to check if its there
					while ( j > 0 ) {
						
						j--;
						
						if ( settings.force_types[i] === available_res[current_res][j].type ) {
							
							found_types++;
						}
					} // End loop through current resolution sources
					
					if ( found_types < settings.force_types.length ) {
						
						delete available_res[current_res];
						available_res.length--;
						break;
					}
				} // End loop through required types
			} // End loop through resolutions
		}
		
		// Make sure we have at least 2 available resolutions before we add the button
		if ( available_res.length < 2 ) { return; }
		
		// Set the video to start out with the default res if it's available
		if ( settings.default_res && available_res[settings.default_res] ) {
			
			player.src( available_res[settings.default_res] );
			player.currentRes = settings.default_res;
		}
		
		// Helper function to get the current resolution
		player.getCurrentRes = function() {
			
			if ( typeof player.currentRes !== 'undefined' ) {
				
				return player.currentRes;
				
			} else {
				
				try {
				
					return res = player.options().sources[0]['data-res'];
				
				} catch(e) {
					
					return '';
				}
			}
		}
		
		current_res = player.getCurrentRes();
		
		if ( current_res ) { current_res += 'p'; }
		
		// Add the resolution selector button
		resolutionSelector = new _V_.ResolutionSelector( player, {
			
			el : _V_.Component.prototype.createEl( null, {
				
				className	: 'vjs-res-button vjs-menu-button vjs-control',
				innerHTML	: '<div class="vjs-control-content">' + current_res || 'Quality' + '</div>',
				role		: 'button',
				'aria-live'	: 'polite', // let the screen reader user know that the text of the button may change
				tabIndex	: 0
				
			} ),
			available_res	: available_res
		} );
		
		player.controlBar.addChild( resolutionSelector );
		
		//player.controlBar.el().appendChild( resolutionSelector.el() );
	});

})( videojs );