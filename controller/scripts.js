window.addEventListener("load", function() {

  const videoSource = document.getElementById("videoSource");
  const camSource = document.getElementById("camSource");

  function gotDevices(deviceInfos) {
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === "videoinput") {
        const option = document.createElement("option");
        option.innerText = deviceInfo.label;
        option.value = deviceInfo.deviceId;
        videoSource.append(option);
      }
      if (deviceInfo.kind === "videoinput") {
        const option = document.createElement("option");
        option.innerText = deviceInfo.label;
        option.value = deviceInfo.deviceId;
        camSource.append(option);
      }
    }
  }

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

  videoSource.onchange = () => {
    localStorage.setItem("videoSource", JSON.stringify(videoSource.value));
  }

  camSource.onchange = () => {
    localStorage.setItem("camSource", JSON.stringify(camSource.value));
  }

  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }

  const interstitials = document.getElementById('interstitial').getElementsByTagName("a");
  for (const interstitial of interstitials) {
    interstitial.addEventListener('click', function(e){
      e.preventDefault();
      const props = JSON.parse(localStorage.getItem("interstitial"));
      props.style = this.dataset.style;
      localStorage.setItem("interstitial", JSON.stringify(props))
    });
  }

  const decorations = document.getElementById('decoration').getElementsByTagName("a");
  for (const decoration of decorations) {
    decoration.addEventListener('click', function(e){
      e.preventDefault();
      const props = JSON.parse(localStorage.getItem("decoration"));
      props.decoration = this.dataset.style;
      localStorage.setItem("decoration", JSON.stringify(props))
    });
  }

  const buttons = document.getElementsByTagName('button');
  for (const button of buttons) {
    button.addEventListener('click', function(e){
      e.preventDefault();
      if (!this.dataset.element) {
        JSON.parse(localStorage.getItem("switch")) == false ? localStorage.setItem("switch", JSON.stringify(true)) : localStorage.setItem("switch", JSON.stringify(false))
      } else {
        const element = this.dataset.element;
        const props = JSON.parse(localStorage.getItem(element)) || {}
        if (this.dataset.action == "clearTheme")
          delete props.style
        if (this.dataset.action == "opacity")
          props.opacity == 0 ? props.opacity = 1 : props.opacity = 0

        // if (this.dataset.action == "width")
        //   console.log(element, "data action is width")
        //   props.width == "cropped" ? delete props.width : props.width = "cropped"
        // directional values
        if (this.dataset.action == "hposition")
          props.hposition = this.dataset.direction;
        if (this.dataset.action == "vposition")
          props.vposition = this.dataset.direction;
        if (this.dataset.action == "dposition") {
          const posArray = this.dataset.direction.split("-")
          props.vposition = posArray[0]
          props.hposition = posArray[1]
        }
        localStorage.setItem(element, JSON.stringify(props))
      }      
    })
  }
})