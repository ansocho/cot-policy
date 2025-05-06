window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "https://homes.cs.washington.edu/~kpar/nerfies/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    // preloadInterpolationImages();

    // $('#interpolation-slider').on('input', function(event) {
    //   setInterpolationImage(this.value);
    // });
    // setInterpolationImage(0);
    // $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    // bulmaSlider.attach();

    document.getElementById("single-task-result-video").playbackRate = 2.0;
    document.getElementById("multi-task-result-video").playbackRate = 2.0;
})


const videoSourcesBySection = {
  1: {
    1: { nfe: 1, path: "media/videos/cups_CFM_NFE=1_euler_failure.mp4", type: "video/mp4" },
    5: { nfe: 5, path: "media/videos/cups_CFM_NFE=5_euler_failure.mp4", type: "video/mp4" },
    10: { nfe: 10, path: "media/videos/cups_CFM_NFE=10_euler_success.mp4", type: "video/mp4" }
  },
  2: {
    1: { nfe: 1, path: "media/videos/pushT_CFM_NFE=1_euler_failure.mp4", type: "video/mp4" },
    5: { nfe: 5, path: "media/videos/pushT_CFM_NFE=5_euler_failure.mp4", type: "video/mp4" },
    10: { nfe: 10, path: "media/videos/pushT_CFM_NFE=10_euler_failure.mp4", type: "video/mp4" },
    20: { nfe: 20, path: "media/videos/pushT_CFM_NFE=20_euler_success.mp4", type: "video/mp4" }
  }
};

const staticSourcesBySection = {
  1: "media/videos/cups_COT_NFE=1_euler_success.mp4",
  2: "media/videos/pushT_COT_NFE=1_euler_success.mp4"
};

function updateVariableVideo(section, nfeKey) {
  const sectionId = section.getAttribute('data-video-id');
  const sourceData = videoSourcesBySection[sectionId][nfeKey];

  const video = section.querySelector('.variable-video');
  const source = video.querySelector('source');
  const nfeValueDisplay = section.querySelector('.nfe-value');

  nfeValueDisplay.textContent = sourceData.nfe;

  const currentTime = video.currentTime;
  const wasPlaying = !video.paused;

  source.src = sourceData.path;
  video.load();

  video.addEventListener('loadedmetadata', function onceLoaded() {
    video.currentTime = 0//currentTime;
    if (wasPlaying) video.play();
    video.removeEventListener('loadedmetadata', onceLoaded);
  });
}

function initializeVideos() {
  const allSections = document.querySelectorAll('.video-section-set');
  allSections.forEach(section => {
    const sectionId = section.getAttribute('data-video-id');
    const nfeOptions = Object.keys(videoSourcesBySection[sectionId]).map(Number).sort((a, b) => a - b);

    const slider = section.querySelector('.nfe-slider');
    slider.min = 0;
    slider.max = nfeOptions.length - 1;
    slider.step = 1;

    // Store the mapping from slider index to actual NFE key
    section.nfeOptions = nfeOptions;

    const staticVideo = section.querySelector('.static-video');
    const staticSource = staticVideo.querySelector('source');
    staticSource.src = staticSourcesBySection[sectionId];
    staticVideo.load();

    // Initialize video with first NFE
    updateVariableVideo(section, nfeOptions[slider.value]);

    slider.addEventListener('input', function () {
      const nfeKey = section.nfeOptions[this.value];
      updateVariableVideo(section, nfeKey);
    });
  });
}

window.addEventListener('DOMContentLoaded', initializeVideos);