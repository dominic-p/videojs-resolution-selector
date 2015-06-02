#Video.js Resolution Selector
Add a resolution selector button to Video.js to allow users to manually adjust the video quality.

##Install
You can use bower (`bower install videojs-resolution-selector`), npm (`npm install videojs-resolution-selector`), or simply download the source from this repo. You must be running Video.js 4.7.3 or higher for this plugin to function. You can download the latest source at the [main Video.js repo](https://github.com/videojs/video.js), or you can get production files from [videojs.com](http://videojs.com), or you can use the CDN files.

##Usage
Add an extra attribute to your `<source />` elements.
```html
<video>
	<source data-res="480" src="..." type="..." />
	<source data-res="240" src="..." type="..." />
</video>
```

Enable the plugin as described in the [video.js docs](https://github.com/videojs/video.js/blob/v4.5.2/docs/guides/plugins.md#step-3-using-a-plugin). Optionally, you can pass some settings to the plugin:
```javascript
videojs( '#my-video', { plugins : { resolutionSelector : {
	force_types	: [ 'video/mp4', 'video/webm' ],
	default_res	: "480"
} } } );
```

`force_types` is an array. The plugin will check each resolution to make sure there is a source of each type at that resolution.

`default_res` must be a string. You can either specify a single resolution or a comma separated list (e.g. `"480,240"`). When using a list, the first available resolution in the list will be selected by default.

The plugin also triggers a `changeRes` event on the player instance anytime the resolution is changed, so your code can listen for that and take any desired action on resolution changes:
```javascript
videojs( '#my-video', { plugins : { resolutionSelector : {} } }, function() {
	
	var player = this;
	
	player.on( 'changeRes', function() {
		
		console.log( 'Current Res is: ' + player.getCurrentRes() );
	});
});
```
The plugin provides a `changeRes` method on the `player` object. You can call it like so (after your player is ready): `player.changeRes( '480' )`.

##Simple Example
```html
<!DOCTYPE html>
<html>
<head>
	<link href="//vjs.zencdn.net/4.5/video-js.css" rel="stylesheet" />
	<script src="//vjs.zencdn.net/4.5/video.js"></script>
	<link href="video-quality-selector.css" rel="stylesheet" type="text/css" />
	<script src="video-quality-selector.js"></script>
</head>
<body>
	<video id="example-2" class="video-js vjs-default-skin" controls width="640" height="360" data-setup='{ "plugins" : { "resolutionSelector" : { "default_res" : "480" } } }'>
		<source src="video-360.mp4" type="video/mp4" data-res="360" />
		<source src="video-480.mp4" type="video/mp4" data-res="480" />
	</video>
</body>
</html>
```
Please see example.html for a more advanced example.

##Styling the Button
By default, the button will not be visible. You will either need to include the styles from `video-quality-selector.css` (after the default Video.js styles to override them), or use your own icon for the button. To match the rest of the Video.js controls, I recommend using an icon font to style the button, but it's up to you.

##Mobile devices
If you want this plugin to work on mobile devices, you need to enable the video.js controls because the native controls are default on iOS and Android.

```html
<video data-setup='{"customControlsOnMobile": true}'>
    ...
</video>
```
