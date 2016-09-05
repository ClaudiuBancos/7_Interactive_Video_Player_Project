/* JQUERY POINTER SHORTCUTS
============================*/

var $video = $("#video");
var $$video = $video[0];
var $videoDiv = $(".video_div");
var $$videoDiv = $videoDiv[0];
var $controlsBar = $(".controls_div");

var $play = $(".play_button");
var $pause = $(".pause_button");

var $RW = $(".rewind_icon");
var $FF = $(".fast_forward_icon");

var $volOn = $(".volume_on_icon");
var $volOff = $(".volume_off_icon");
var $fullScreen = $(".fullscreen_icon");

var $slider = $(".volume_slider");
var $$slider = $slider[0];
var $timestamp = $(".timestamp");
var $progress_bar = $(".progress_bar");
var $$progress_bar = $progress_bar[0];
var $buffering_bar = $(".buffering_bar");
var $$buffering_bar = $buffering_bar[0];

var $captions_icon = $(".captions_icon");

var $captions = $$video.textTracks;
var $$captions = $captions[0];
var $$captions = $captions[0];
var $cueSpans = $(".cue_span");




/* CONTROL BAR CONTROLS
========================= */

/* Disable default browser controls */
$video.prop("controls", false);

/* Hide controls that are supposed to be initially hidden */
$(".hidden").hide();

/* Show controls when mouse goes in, hide when mouse goes out */

$videoDiv.mouseleave(function(e) {
	if ($$video.paused === false) {
		$controlsBar.hide();
		$(".progress_and_controls").css("bottom", "0px");
	}
});

$videoDiv.mouseenter(function(e) {
	$(".progress_and_controls").css("bottom", "26px");
	$controlsBar.show();
});


/* DEFAULT YR#)(*)F#H)H)PFH_(#H_H */
$video.prop("muted", true);
$volOn.hide();
$volOff.show();
/* ======================= */



/* Play/Pause Buttons */
$play.click(function() {
	$$video.play();
});

$pause.click(function() {
	$$video.pause();
});


/* Just in case the video plays/pauses a different way. */
$video.on("pause", function() {
	$pause.hide();
	$play.show();
});

$video.on("play", function() {
	$play.hide();
	$pause.show();
});


/* Playback speed adjustment and display */
$$video.playbackRate = 1;
var $playbackSpeedSpan;

$RW.click(function() {
	if ($$video.playbackRate > 1) {
		$$video.playbackRate = $$video.playbackRate - 0.5;
	} else {
		$$video.playbackRate = $$video.playbackRate - 0.25;
	}
	$playbackSpeedSpan = $$video.playbackRate + "x";
	$(".playback_speed").text($playbackSpeedSpan);
});

$FF.click(function() {
	if ($$video.playbackRate >= 1) {
		$$video.playbackRate = $$video.playbackRate + 0.5;
	} else {
		$$video.playbackRate = $$video.playbackRate + 0.25;
	}
	$playbackSpeedSpan = $$video.playbackRate + "x";
	$(".playback_speed").text($playbackSpeedSpan);
});


/* Volume On/Off Button */
$volOff.click(function() {
	$video.prop("muted", false);
	$(this).hide();
	$volOn.show();
});

$volOn.click(function() {
	$video.prop("muted", true);
	$(this).hide();
	$volOff.show();
});

/* Volume Adjustment */
$$slider.value = 500;
$slider.on("input change", function() {
	$video.prop("muted", false);
	$$video.volume = $$slider.value/1000;
	if ($$video.volume === 0) {
		$video.prop("muted", true);
		$volOn.hide();
		$volOff.show();
	} else {
		$volOff.hide();
		$volOn.show();
	}
});


/* Captions Toggle Button */
$captions_icon.click(function() {
	if ($$captions.mode == "showing") {
		$$captions.mode = "hidden";
	} else {
		$$captions.mode = "showing";
	}
	if ($$video.paused === true) {
		$$video.play();
		$$video.pause();
	}
});


/* Full Screen Button */
var $isFullScreen = false;

$fullScreen.click(function() {
	if ($isFullScreen === true) {
		if(document.webkitFullscreenEnabled === true && document.webkitFullscreenElement !== null) {
			document.webkitCancelFullScreen();
		}
		if(document.msFullscreenEnabled === true && document.msFullscreenElement !== null) {
			document.msExitFullscreen();
		}
		if(document.mozFullScreen === true) {
			document.mozCancelFullScreen();
		}
	} else {
		if ($$videoDiv.msRequestFullscreen) {
	    	$$videoDiv.msRequestFullscreen();
	    } else if ($$videoDiv.mozRequestFullScreen) {
	    	$$videoDiv.mozRequestFullScreen();
	    } else if ($$videoDiv.webkitRequestFullscreen) {
	    	$$videoDiv.webkitRequestFullscreen();
	    }
	}
});


/* On Full Screen Change */
document.onmozfullscreenchange = function(e) {
	if (document.mozFullScreen === true) {
		$isFullScreen = true;
	} else {
		$isFullScreen = false;
	}
};

document.onwebkitfullscreenchange = function(e) {
	if (document.webkitFullscreenElement !== null) {
		$isFullScreen = true;
	} else {
		$isFullScreen = false;
	}
};

document.onmsfullscreenchange = function(e) {
	console.log("FULL SCREEN CHANGE");
	if (document.msFullscreenElement !== null) {
		$isFullScreen = true;
	} else {
		$isFullScreen = false;
	}
};



/* BUFFERING BAR SELF-UPDATE
=============================*/

$video.on("progress", function() {
	$$buffering_bar.value = Math.floor($$video.buffered.end(0));
});

function updateBufferingBar() {
	$$buffering_bar.value = Math.floor($$video.buffered.end(0));
}

$("body").on("mousemove", function(event) {
	if ($$buffering_bar.value === 0) {
		updateBufferingBar();
	}
});




/* TIMESTAMP AND PROGRESS BAR INITIALIZATION 
=============================================*/

var $duration;
var runMe = true;

do {
	$duration = Math.floor($$video.duration);
	$timestamp.text("0:00 / 0:" + $duration);
	runMe = false;
} while (runMe);

$video.on("loadedmetadata", function() {
	$duration = Math.floor($$video.duration);
	$timestamp.text("0:00 / 0:" + $duration);
	$$video.volume = $$slider.value/1000;
	$$progress_bar.value = 0;
});




/* CLICK ON PROGRESS BAR 
=========================*/

var holding_down = false;

$progress_bar.mousedown(function(e) {
	$duration = Math.floor($$video.duration);
	var click_location = e.pageX;
	var bar_location = $progress_bar.offset().left;
	var location_on_bar = click_location - bar_location;
	$$video.currentTime = location_on_bar / $progress_bar.width() * $duration;
	holding_down = true;
});


$progress_bar.mousemove(function(e) {
	if (holding_down) {
		var bar_location = $progress_bar.offset().left;
		var mouse_location = e.pageX;
		var location_on_bar = mouse_location - bar_location;
		$$video.currentTime = location_on_bar / $progress_bar.width() * $duration;
	}
});

$progress_bar.mouseup(function(e) {
	if (holding_down) {
		holding_down = false;
	}
});

$progress_bar.mouseleave(function(e) {
	if (holding_down) {
		holding_down = false;
	}
});




/* CLICK ON TRANSCRIPT
========================*/

var $cueID;
var $jumpTime;
var $doubleUpdate = false;
$cueSpans.click(function(e) {
	$cueID = this.id.replace("C","");
	$cueID = $cueID - 1;
	$jumpTime = $$captions.cues[$cueID].startTime;
	$jumpTime = $jumpTime + 0.01;
	$$video.currentTime = $jumpTime;
	$doubleUpdate = true;
});






/* TIMESTAMP, PROGRESS BAR, AND TRANSCRIPT
HIGHLIGHTING SELF-UPDATE ON VIDEO TIMEUPDATE
==============================================*/

var $currentTime;
var $activeCueID;
var $currentCue;
var $previousCue = "C0";

$video.on("timeupdate", function() {					// Yes, this function only works for videos under 1 minute.
	$currentTime = Math.floor($$video.currentTime);		// Clearly I would need a more general function if I ever
	
	if ($currentTime < 10) {							// expected my player to play longer videos.
		$timestamp.text("0:0" + $currentTime + " / 0:" + $duration);
	} else {
		$timestamp.text("0:" + $currentTime + " / 0:" + $duration);
	}
	$$progress_bar.value = $currentTime;
	$activeCueID = $$captions.activeCues[0].id;
	$currentCue = "C" + $activeCueID;
	if ($previousCue !== $currentCue) {
		$("#" + $previousCue).css("background-color", "white");
		$("#" + $currentCue).css("background-color", "yellow");
	}
	$previousCue = $currentCue;
	$currentCue = "C0";

	if ($$video.paused && $doubleUpdate) {
		$$video.play();
		$$video.pause();
		$doubleUpdate = false;
	}
});