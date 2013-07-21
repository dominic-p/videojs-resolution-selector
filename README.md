Video.js Resolution Selector
============================
Add a resolution selector button to Video.js to allow users to manually adjust the video quality.

Usage
-----
Add an extra attribute to your `<source />` elements.

	<video>
		<source data-res="480" src="..." type="..." />
		<source data-res="240" src="..." type="..." />
	</video>

Optionally, you can pass some settings to the plugin:

    plugins : { resolutionSelector : {
    	force_types	: [ 'video/mp4', 'video/webm' ],
    	default_res	: "480"
    }

`force_types` is an array. The plugin will check each resolution to make sure there is a source of each type at that resolution. `default_res` is pretty self explanatory.

Things to Work On
-----------------
- It would be really cool if this supported an "auto" option that used MPEG-DASH and/or HSL to enable adaptive resolution videos in addition to manual selection.
