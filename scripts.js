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
  const videoSelect = document.querySelector('select#videoSource');
  const camSelect = document.querySelector('select#camSource');
  const selectors = [videoSelect, camSelect];

  const props = localStorage;

  function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map(select => select.value);
    selectors.forEach(select => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      }
    }
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `camera ${camSelect.length + 1}`;
        camSelect.appendChild(option);
      }
    }
    selectors.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex];
      }
    });
  }

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

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
    const videoSource = videoSelect.value || JSON.parse(localStorage.getItem("videoSource"));
    localStorage.setItem("videoSource", JSON.stringify(videoSource))
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
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
  }

  videoSelect.onchange = startVideo;

  function startCam() {
    if (window.cam) {
      window.cam.getTracks().forEach(track => {
        track.stop();
      });
    }
    const camSource = camSelect.value || JSON.parse(localStorage.getItem("camSource"));
    localStorage.setItem("camSource", JSON.stringify(camSource))
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
    navigator.mediaDevices.getUserMedia(constraints).then(gotCam).then(gotDevices).catch(handleError);
  }

  camSelect.onchange = startCam;

  startVideo();
  startCam();

  // localStorage trawling
  let prevCamSource = JSON.parse(localStorage.getItem("camSource"));
  let prevVideoSource = JSON.parse(localStorage.getItem("videoSource"));

  setInterval(function(){
    for (let i = 0; i < localStorage.length; i++) {
      const el = localStorage.key(i);
      const element = document.getElementById(el);
      const props = JSON.parse(localStorage.getItem(el));
      if (el == "videoSource") {
        if (JSON.parse(localStorage.getItem(el)) != prevVideoSource) {
          // console.log("video prop has changed")
          prevVideoSource = JSON.parse(localStorage.getItem(el));
          startVideo;
        }
      }
      if (el == "camSource") {
        if (JSON.parse(localStorage.getItem(el)) != prevCamSource) {
          // console.log("cam prop has changed")
          prevCamSource = JSON.parse(localStorage.getItem(el));
          startCam;
        }
      }
      if (props) {
        if (props.opacity) {
          element.style.opacity = null;
        }
        element.style.opacity = props.opacity;
        if (props.image) {
          element.style.backgroundImage = "url(/assets/" + props.image + ")";
        } else {
          element.style.backgroundImage = null;
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
      }
    }
  }, 500);
});