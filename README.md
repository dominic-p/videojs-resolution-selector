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

`force_types` is an array. The plugin will check each resolution to make sure there is a source of each type at that resolution. `default_res` is pretty self explanatory.

The plugin also triggers a `changeRes` event on the player instance anytime the resolution is changed, so your code can listen for that and take any desired action on resolution changes:

	videojs( '#my-video', { plugins : resolutionSelector : {} }, function() {
		
		var player = this;
		
		player.on( 'changeRes', function() {
			
			console.log( 'Current Res is: ' + player.getCurrentRes() );
		});
	});

Things to Work On
-----------------
- It would be really cool if this supported an "auto" option that used MPEG-DASH and/or HLS to enable adaptive resolution videos in addition to manual selection.
- We're relying on several `for...in` style loops. This isn't ideal, and it should be changed.
- Add a generic `change_res` method on the `player` object to allow resolution to be changed via js instead of just `onClick`
- Implement a preload system to make changing resolutions smoother (see [issue #7](https://github.com/dominic-p/videojs-resolution-selector/issues/7))
- Right now, this only works for HTML5 videos. In theory, it could be made to [work with Flash](http://help.videojs.com/discussions/questions/605-advise-for-setting-up-video-quality-resolution-selector#comment_15079585) (or even YouTube with some tweaking).
