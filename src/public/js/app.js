const socket = new io();

const myFace = document.getElementById("myFace");
const muteButton = document.getElementById("mute");
const cameraButton = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((aDevice) => aDevice.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    renderCameraSelect(cameras, currentCamera);
    console.log(cameras);
  } catch (error) {
    console.log(error);
  }
}

function renderCameraSelect(cameras, currentCamera) {
  cameras.forEach((aCamera) => {
    const option = document.createElement("option");
    option.value = aCamera.deviceId;
    option.innerText = aCamera.label;
    if (currentCamera.label === aCamera.label) {
      option.selected = true;
    }
    cameraSelect.appendChild(option);
  });
}

async function getMedia(deviceId) {
  const defaultConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };
  const userConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? userConstraints : defaultConstraints
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

getMedia();

function muteClickHandler() {
  myStream
    .getAudioTracks()
    .forEach((aTrack) => (aTrack.enabled = !aTrack.enabled));
  if (muted) {
    muteButton.innerText = "Mute";
    muted = false;
  } else {
    muteButton.innerText = "Unmute";
    muted = true;
  }
}
function cameraClickHandler() {
  myStream
    .getVideoTracks()
    .forEach((aTrack) => (aTrack.enabled = !aTrack.enabled));
  if (cameraOff) {
    cameraButton.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraButton.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

async function cameraChangeHandler() {
  await getMedia(cameraSelect.value);
}

muteButton.addEventListener("click", muteClickHandler);
cameraButton.addEventListener("click", cameraClickHandler);
cameraSelect.addEventListener("input", cameraChangeHandler);
