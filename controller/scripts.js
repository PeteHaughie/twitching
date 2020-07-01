window.addEventListener("load", function() {

  function gotDevices(deviceInfos) {
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === "videoinput")
        console.log(deviceInfo)
    }
  }

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
  
  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }

  const buttons = document.getElementsByTagName('button')
  for (const button of buttons) {
    button.addEventListener('click', function(e){
      e.preventDefault()
      const element = this.dataset.element
      const props = JSON.parse(localStorage.getItem(element)) || {}
      if (this.dataset.action == "opacity")
        props.opacity == 0 ? props.opacity = 1 : props.opacity = 0
      if (this.dataset.action == "hposition")
        props.hposition = this.dataset.direction
      if (this.dataset.action == "vposition")
        props.vposition = this.dataset.direction
      if (this.dataset.action == "dposition") {
        props.vposition = this.dataset.direction.split("-")[0]
        props.hposition = this.dataset.direction.split("-")[1]
      }
      localStorage.setItem(element, JSON.stringify(props))
    })
  }
})