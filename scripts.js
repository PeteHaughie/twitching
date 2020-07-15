/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';

window.addEventListener("load", function(){
  const videoElement = document.createElement('video');
        videoElement.setAttribute('playsinline', true);
        videoElement.setAttribute('autoplay', true);
        videoElement.setAttribute('width', 1280);
        videoElement.setAttribute('height', 720);
  const camElement = document.createElement('video');
        camElement.setAttribute('playsinline', true);
        camElement.setAttribute('autoplay', true);
        camElement.setAttribute('width', 300);
        camElement.setAttribute('height', 150);

  const videoCanvas = document.getElementById('canvas1');
        videoCanvas.setAttribute('width', 1280);
        videoCanvas.setAttribute('height', 720);
  const camCanvas = document.getElementById('canvas2');
        camCanvas.setAttribute('width', 300);
        camCanvas.setAttribute('height', 150);

  const videoContext = videoCanvas.getContext('2d');
  const camContext = camCanvas.getContext('2d');

  const props = localStorage;

  navigator.mediaDevices.enumerateDevices().catch(handleError);

  function updateCanvas(canvas, video, alt) {
    setInterval(() => {
      if (document.getElementById("container").classList.contains("switch")) {
        canvas.drawImage(alt, 0, 0, video.width, video.height);
      } else {
        canvas.drawImage(video, 0, 0, video.width, video.height);
      }
    }, 30);
  }

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    videoElement.addEventListener('play', function(){
      updateCanvas(videoContext, videoElement, camElement);
    });
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function gotCam(stream) {
    window.cam = stream; // make stream available to console
    camElement.srcObject = stream;
    camElement.addEventListener('play', function() {
      updateCanvas(camContext, camElement, videoElement);
    });
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }

  function startVideo() {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const videoSource = JSON.parse(localStorage.getItem("videoSource"));
    const constraints = {
      video: {
        deviceId: videoSource ? {
          exact: videoSource
        } : undefined,
        width: {
          ideal: 1280
        },
        height: {
          ideal: 720
        },
        maxWidth: 1280,
      }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
  }

  function startCam() {
    if (window.cam) {
      window.cam.getTracks().forEach(track => {
        track.stop();
      });
    }
    const camSource = JSON.parse(localStorage.getItem("camSource"));
    const constraints = {
      video: {
        deviceId: camSource ? {
          exact: camSource
        } : undefined,
        width: {
          ideal: 1280
        },
        height: {
          ideal: 720
        },
        maxWidth: 1280,
      }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotCam).catch(handleError);
  }

  startVideo();
  startCam();

  // localStorage trawling
  let prevCamSource = JSON.parse(localStorage.getItem("camSource"));
  let prevVideoSource = JSON.parse(localStorage.getItem("videoSource"));

  setInterval(function(){
    for (let i = 0; i < localStorage.length; i++) {
      const el = localStorage.key(i);

      if (el == "switch") {
        JSON.parse(localStorage.getItem(el)) == true ? document.getElementById("container").classList.add("switch") : document.getElementById("container").classList.remove("switch");
      } else {
        const element = document.getElementById(el);
        const props = JSON.parse(localStorage.getItem(el));
        if (el == "videoSource") {
          if (JSON.parse(localStorage.getItem(el)) != prevVideoSource) {
            prevVideoSource = JSON.parse(localStorage.getItem(el));
            startVideo();
          }
        }
        if (el == "camSource") {
          if (JSON.parse(localStorage.getItem(el)) != prevCamSource) {
            prevCamSource = JSON.parse(localStorage.getItem(el));
            startCam();
          }
        }
        if (element && props) {
          if (props.opacity)
            element.classList.remove("invisible");
          else
            element.classList.add("invisible");
  
          if (props.style) {
            const classes = element.classList;
            for (let i = 0; i < classes.length; i++) {
              if (classes[i] != "invisible") {
                element.classList.remove(classes[i]);
              }
            }
            element.classList.add(props.style);
          }
  
          if (props.hposition) {
            if (props.hposition == "left") {
              element.classList.remove("right")
            }
            if (props.hposition == "right") {
              element.classList.add("right")
            }
          }
  
          if (props.vposition) {
            if (props.vposition == "top") {
              element.classList.remove("bottom")
            }
            if (props.vposition == "bottom") {
              element.classList.add("bottom")
            }
          }
  
          if (props.decoration) {
            if (!element.classList.contains(props.decoration)) {
              element.classList.add("invisible")
              setTimeout(function() {
                element.classList = "";
              }, 300);
              setTimeout(function() {
                element.classList.add(props.decoration)
              }, 300);
            }
          }
      }

        // if (el == "topCamContainer" && props.width) {
        //   element.classList.add(props.width)
        // } else if (el == "topCamContainer") {
        //   element.classList.remove("cropped");
        // }

      }
    }
  }, 333);
});