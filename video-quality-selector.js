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
	
	// Setup our resolution menu items
	_V_.ResolutionMenuItem = _V_.MenuItem.extend({
		
		/** @constructor */
		init : function( player, options ){
			
			// Modify options for parent MenuItem class's init.
			options['label'] = options.res + 'p';
			options['selected'] = options.res === player.getCurrentRes();
			
			_V_.MenuItem.call( this, player, options );
		}
	});
	
	_V_.ResolutionMenuItem.prototype.onClick = function() {
		
		// Call the parent click handler
		_V_.MenuItem.prototype.onClick.call( this );
		
		
	};
	
	// Define our resolution selector button
	_V_.ResolutionSelector = _V_.Button.extend({
		
		/** @constructor */
		init : function( player, options ) {
			
			_V_.Button.call( this, player, options );
			
			// Add our list of available resolutions to the player object
			player.availableRes = options.available_res;
			
			console.log( this );
			
			/*
			// Hide the button if we have 1 or fewer items
			if ( this.items.length <= 1 ) {
				
				this.hide();
			}*/
		}
	});
	
	// Create a menu item for each available resolution
	_V_.ResolutionSelector.prototype.createItems = function() {
		
		var items = [],
			current_res;
		
		for ( current_res in this.availableRes ) {
			
			items.push( new _V_.ResolutionMenuItem() );
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
					found_type = false;
					
					// For each required type loop through the available sources to check if its there
					while ( j > 0 ) {
						
						j--;
						
						if ( settings.force_types[i] === available_res[current_res][j].type ) {
							
							found_type = true;
							break;
						}
					} // End loop through current resolution sources
					
					if ( ! found_type ) {
						
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
		
		player.getCurrentRes = function() {
			
			return player.currentRes || '';
		}
		
		// Add the resolution selector button
		resolutionSelector = new _V_.ResolutionSelector( player, {
			
			el : _V_.Component.prototype.createEl( null, {
				
				className	: 'vjs-res-button vjs-control',
				innerHTML	: '<div class="vjs-control-content">1080p</div>',
				role		: 'button',
				'aria-live'	: 'polite', // let the screen reader user know that the text of the button may change
				tabIndex	: 0
				
			} ),
			available_res	: available_res
		} );
		
		player.controlBar.el().appendChild( resolutionSelector.el() );
	});

})( videojs );