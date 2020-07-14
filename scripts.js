/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';

window.addEventListener("load", function(){
  const videoElement = document.getElementById('video1');
  const camElement = document.getElementById('video2');

  const props = localStorage;

  navigator.mediaDevices.enumerateDevices().catch(handleError);

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function gotCam(stream) {
    window.cam = stream; // make stream available to console
    camElement.srcObject = stream;
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
      const el = localStorage.key(i); // "interstitial"
      const element = document.getElementById(el); // <div id="interstitial"></div>
      const props = JSON.parse(localStorage.getItem(el)); // {interstitial: {"opacity": 0}}
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

        // if (el == "topCamContainer" && props.width) {
        //   element.classList.add(props.width)
        // } else if (el == "topCamContainer") {
        //   element.classList.remove("cropped");
        // }

      }
    }
  }, 333);
});