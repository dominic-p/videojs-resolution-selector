Video.js Resolution Selector
============================
Add a resolution selector button to Video.js to allow users to manually adjust the video quality.

Usage
-----
You must be running Video.js 4.2.0 or higher for this plugin to function. You can download the latest source at the [main Video.js repo](https://github.com/videojs/video.js) or you can get production files from [videojs.com](http://videojs.com) or you can use the CDN files.

Add an extra attribute to your `<source />` elements.

	<video>
		<source data-res="480" src="..." type="..." />
		<source data-res="240" src="..." type="..." />
	</video>

Enable the plugin as described in the [video.js docs](https://github.com/videojs/video.js/blob/v4.5.2/docs/guides/plugins.md#step-3-using-a-plugin). You can also checkout the `example.html` file in this repo to see how the plugin is setup. Optionally, you can pass some settings to the plugin:

    videojs( '#my-video', { plugins : { resolutionSelector : {
    	force_types	: [ 'video/mp4', 'video/webm' ],
    	default_res	: "480"
    } } } );

`force_types` is an array. The plugin will check each resolution to make sure there is a source of each type at that resolution.

`default_res` must be a string. You can either specify a single resolution or a comma separated list (e.g. `"480,240"`). When using a list, the first available resolution in the list will be selected by default.

The plugin also triggers a `changeRes` event on the player instance anytime the resolution is changed, so your code can listen for that and take any desired action on resolution changes:

	videojs( '#my-video', { plugins : resolutionSelector : {} }, function() {
		
		var player = this;
		
		player.on( 'changeRes', function() {
			
			console.log( 'Current Res is: ' + player.getCurrentRes() );
		});
	});

The plugin provides a `changeRes` method on the `player` object. You can call it like so (after your player is ready): `player.changeRes( '480' )`.
	
Mobile devices
--------------
If you want this plugin to work on mobile devices, you need to enable the video.js controls because the native controls are default on iOS and Android.

	<video data-setup='{"customControlsOnMobile": true}'>
		...
	</video>
