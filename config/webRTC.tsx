// import mediaDevices from "react-native-webrtc";

export default class WebRTCHelper {
  constructor() {}

  static getStream = async () => {
    let isFront = true;
    // await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: {
    //     width: 640,
    //     height: 480,
    //     frameRate: 30,
    //     facingMode: (isFront ? "user" : "environment"),
    //     deviceId: videoSource3Id
    //   }
    // });   
    // let devices = await navigator.mediaDevices.enumerateDevices();   
    // console.log(devices); 
    const sourceInfos: any = await navigator.mediaDevices.enumerateDevices();

    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    const stream = navigator.mediaDevices.getUserMedia({
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
}