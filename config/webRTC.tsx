import {mediaDevices} from "react-native-webrtc";

export default class WebRTCHelper {
  constructor() {}

  static getStream = async () => {
    let isFront = true;
    const sourceInfos: any = await mediaDevices.enumerateDevices();

    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    const stream: any = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: (isFront ? "user" : "environment"),
        deviceId: videoSourceId
      }
    });

    return typeof stream !== 'boolean' && stream;
  }

  static swapCamera = (stream: MediaStream) => {
    stream.getVideoTracks().forEach((track: any) => {
      track._switchCamera();
    })
  }

  static toggleVideo = (stream: MediaStream) => {
    stream.getVideoTracks().forEach((track) => {
      if (track.enabled) {
        track.enabled = false;
      }
      else {
        track.enabled = true;
      }
    });
  }

  static toggleAudio = (stream: MediaStream) => {
    stream.getAudioTracks().forEach((track) => {
      if (track.enabled) {
        track.enabled = false;
      }
      else {
        track.enabled = true;
      }
    });
  }
}