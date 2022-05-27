// React native imports
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  ImageBackground
} from "react-native";

// Theme
import colors from "../../config/colors";
import { CallStates, ColorSchemeType, InCallOptions } from "../../types";

// User queries
import * as UserQueries from "../../db/users";

//Picture placeholder
import profile from '../../assets/profile.jpg';

// Components
import { CallOptions } from './callOptions';
import { CallInfo } from './components/callInfo';
import WebRTCHelper from "../../config/webRTC";
import { getData } from "../../config/asyncStorage";
import { deleteCallDoc, getCallReceivedData, getCallReceivedRef, getNewCallRef } from "../../db/call";
import { doc, setDoc } from "@firebase/firestore";
import { RTCView, RTCPeerConnection, RTCIceCandidate, MediaStream, RTCIceCandidateType, RTCSessionDescription, EventOnAddStream } from "react-native-webrtc";
import { collection, onSnapshot } from "firebase/firestore";

// Default react component
export default ({route, navigation}: any) => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [callState, setCallState] = useState(route.params.callState);
  const [quitCallReady, setQuitCall] = useState(false);
  const [user, setUser]: any = useState(route.params.user);
  const [localUser, setLocalUser]: any = useState(false);

  //WebRTC
  const configuration: any = {
    iceServers: [
      {urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302']},
      {
        url: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
    ]
  };
  const [localStream, setLocalStream] = useState <MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [videoOn, setVideo] = useState(true);
  const [audioOn, setAudio] = useState(true);
  const pc: any = useRef<RTCPeerConnection>();
  const subscriptions: any[] = [];

  // Helpers
  const getColorScheme = () => {
    let tempColorScheme: ColorSchemeType = "light";
    if (colorScheme === "dark") tempColorScheme = "dark";
    return tempColorScheme;
  };

  const handleFirstLoad = () => {
    setFirstLoad(false);
    Appearance.addChangeListener(() => {
      setColorScheme(Appearance.getColorScheme());
    });
  };

  // Functions
  const onPressOption = async (optionKey: InCallOptions) => {
    if (optionKey === InCallOptions.SWAP) {
      // Swap camera to environment/selfie
      WebRTCHelper.swapCamera(localStream);
    }

    if (optionKey === InCallOptions.VIDEO) {
      // Toggle video ON/OFF
      WebRTCHelper.toggleVideo(localStream);
      videoOn ? setVideo(false) : setVideo(true);
    }

    if (optionKey === InCallOptions.AUDIO) {
      // Toggle Audio ON/OFF
      WebRTCHelper.toggleAudio(localStream);
      audioOn ? setAudio(false) : setAudio(true);
    }

    if (optionKey === InCallOptions.END_CALL) {
      if (callState === CallStates.WAITING || callState === CallStates.ON_CALL) {
        // End call
        await hangup();
  
        setTimeout(() => {
          setQuitCall(true);
        }, 1000);
      }
      else if (callState === CallStates.INCOMING_CALL){
        // Reject Call
        await hangup();
        setQuitCall(true);
      }
    }

    if (optionKey === InCallOptions.ANSWER_CALL) {
      joinCall();
      setVideo(true);
      setAudio(true);
    }
  }

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
      if (callState === CallStates.WAITING) {
        createCall(user.userId);
        setVideo(true);
        setAudio(true);
      }

      getData('user', true).then((userData: any) => setLocalUser(userData));
    }
    if (quitCallReady) {
      subscriptions.forEach(async (subscription) => {
        await subscription();
      });
      navigation.goBack();
    }

    if (CallStates.INCOMING_CALL) {
      const localUser = getData('user', true);
      localUser.then((userData: any) => {
        // Get the new doc reference for the call
        const cRef = getNewCallRef(user!.userId, userData.userId);
        const remoteCollection = collection(cRef, 'caller');
        subscriptions.push(
          onSnapshot(remoteCollection, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
              if (change.type === 'removed') {
                setQuitCall(true);
              }
            });
          })
        );
      })
    }
  }, [quitCallReady, localStream, videoOn, audioOn]);

  // WebRTC functions
  const setupWebRTC = async () => {
    pc.current = new RTCPeerConnection(configuration);

    // Get local audio and video stream for the call
    const stream: any =  await WebRTCHelper.getStream();

    if (stream) {
      setLocalStream(stream);
      pc.current.addStream(stream);
    }

    pc.current.onaddstream = (event: EventOnAddStream) => {
      setRemoteStream(event.stream);
      console.log('ADDED TO STREAM, ', localUser?.name);
      // Only callee runs this method
    };
  };

  const createCall = async (calleeId: string) => {

    await setupWebRTC();

    const user: any = await getData('user', true);

    // Get the new doc reference for the call
    const cRef = getNewCallRef(user!.userId, calleeId);

    collectIceCandidates(cRef, 'caller', 'callee');

    if (pc.current) {
      const offer = await pc.current.createOffer();

     await  pc.current.setLocalDescription(offer);

      const cWithOffer = { offer };

      await setDoc(cRef, cWithOffer);
    }

    onSnapshot(cRef, async (snapshot) => {
      const data: any = snapshot.data();
      if (data.answer) {
        console.log('CALLEE DETECTED');
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await pc.current.setRemoteDescription(rtcSessionDescription);
      }
    });

    const remoteCollection = collection(cRef, 'callee');

    onSnapshot(remoteCollection, async(snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'removed') {
          console.log('from CALLER: CALLEE REMOVED');
          setCallState(CallStates.CALL_ENDED);
          setTimeout(() => {
            setQuitCall(true);
          }, 1000);
        }
      });
    });
  };

  const joinCall = async () => {
    const callDoc: any = await getCallReceivedData();
    const callRef = await getCallReceivedRef();
    const offer = callDoc.offer;

    if (offer) {
      await setupWebRTC();

      // Exchange the ICE candidates
      // Check the parameters are reversed
      collectIceCandidates(callRef, "callee", "caller");

      if (pc.current) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

        // Create answer for the call
        // Update the document with answer

        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);
        const cWithAnswer = { answer };


        await setDoc(callRef, cWithAnswer);

        
        const remoteCollection = collection(callRef, 'callee');

        onSnapshot(remoteCollection, async(snapshot) => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'removed') {
              console.log('from CALLEE: CALLER REMOVED');
              setCallState(CallStates.CALL_ENDED);
              setTimeout(() => {
                setQuitCall(true);
              }, 1000);
            }
          });
        });
      }
    }
  };

  const hangup = async () => {
    setVideo(false);
    setAudio(false);
    setLocalStream(null);
    setRemoteStream(null);
    
    // Stream cleanup
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
    }

    // Firebase cleanup
    await deleteCallDoc();
    
    if (pc.current) {
      pc.current.close();
    }

    setCallState(CallStates.CALL_ENDED);
  }

  const collectIceCandidates = (cRef: any, localname: string, remoteName: string) => {
    const localCollection = collection(cRef, localname);
    const remoteCollection = collection(cRef, remoteName);
    console.log('COLLECT ICE CANDIDATES, from ', localname);
    if (pc.current) {
      pc.current.onicecandidate = async (event: any) => {
        if (event.candidate) {
          const callerDocUpdate = doc(localCollection);
          await setDoc(callerDocUpdate, (event.candidate).toJSON());
        }
      }
    }
    
    subscriptions.push(
      onSnapshot(remoteCollection, (snapshot) => {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === 'added') {
            
            const data: RTCIceCandidateType = change.doc.data();
            const candidate = new RTCIceCandidate(data);
            pc.current?.addIceCandidate(candidate);
            setCallState(CallStates.ON_CALL);
            console.log('ICE CANDIDATE ADDED, from: ', localname);
          }
        });
      })
    );
  };

  // Styles
  const styles = StyleSheet.create({
    pictureBackgroundBlur: {
      flex: 1,
      justifyContent: 'center',
    },
    backgroundOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      alignItems: 'center'
    },
    callInfo: {
      paddingTop: 60,
      alignItems: 'center'
    },
    callEndedText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors['dark'].font.primary
    },
    incomingCallText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors['dark'].font.primary
    }
  });

  // React component
  return (
    <>
      
      {/* {WAITING FOR ANSWER OR CALL ENDED} */}
      {
        (callState === CallStates.WAITING || callState === CallStates.CALL_ENDED) && !videoOn
        &&
        <ImageBackground
          source={ user?.pictureUrl ? {uri: user?.pictureUrl} : profile}
          resizeMode="cover"
          style={styles.pictureBackgroundBlur}
          blurRadius={8}
        >
          <View style={styles.backgroundOverlay} >
            <View style={styles.callInfo} >
              <CallInfo callTime="00:00" profilePictureUrl={user?.pictureUrl} />
             {
               callState === CallStates.CALL_ENDED
               &&
               <Text style={styles.callEndedText} >Call ended</Text>
             }
            </View>
          </View>
        </ImageBackground>
      }

      {/* {WAITING FOR ANSWER OR CALL ENDED} */}
      {
        callState === CallStates.WAITING && localStream && videoOn
        &&
        <View style={styles.backgroundOverlay}>
          <RTCView
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          style={{position: 'absolute', width: '100%', height: '100%'}}
          />
          <View style={styles.callInfo} >
            <CallInfo callTime="" profilePictureUrl={user?.pictureUrl} />
            <Text style={styles.incomingCallText} >{user?.name}</Text>
          </View>
        </View>

      }
      {
        callState === CallStates.INCOMING_CALL
        &&
        <ImageBackground
          source={user?.pictureUrl ? { uri: user?.pictureUrl } : profile}
          resizeMode="cover"
          style={styles.pictureBackgroundBlur}
          blurRadius={8}
        >
          <View style={styles.backgroundOverlay} >
            <View style={styles.callInfo} >
              <CallInfo callTime="" profilePictureUrl={user?.pictureUrl} />
              <Text style={styles.incomingCallText} >{user?.name}</Text>
            </View>
          </View>
        </ImageBackground>
      }

      {/* {ON CALL} */}
      {
        callState === CallStates.ON_CALL
        &&
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          {
            remoteStream
            ?
            // <Text>THERE IS REMOTE STREAM</Text>
            <RTCView
            streamURL={remoteStream.toURL()}
            objectFit={'cover'}
            style={{position: 'absolute', width: '100%', height: '100%'}}
            zOrder={0}
            />
            :
            !remoteStream && localStream && videoOn
            ?
            // <Text>THERE IS LOCAL, NO REMOTE, AND VIDEO ON</Text>
            <RTCView
            streamURL={localStream.toURL()}
            objectFit={'cover'}
            style={{position: 'absolute', width: '100%', height: '100%'}}
            />
            :
            // <Text>ELSE</Text>
            <ImageBackground
              source={user?.pictureUrl ? { uri: user?.pictureUrl } : profile}
              resizeMode="cover"
              style={styles.pictureBackgroundBlur}
              blurRadius={8}
            ></ImageBackground>
          }
          {
            localStream && videoOn && remoteStream
            ?
            // <Text>THERE IS LOCAL, REMOTE, AND VIDEO ON</Text>
            <RTCView
            streamURL={localStream.toURL()}
            objectFit={"cover"}
            style={{position: 'absolute', width: 100, height: 150, top: 0, right: 0, elevation: 10}}
            zOrder={2}
            />
            :
            localStream && !videoOn && remoteStream
            &&
            // <Text>THERE IS LOCAL, REMOTE, BUT VIDEO OFF</Text>

            <ImageBackground
              source={localUser?.pictureUrl ? { uri: localUser?.pictureUrl } : profile}
              resizeMode="cover"
              style={{position: 'absolute', width: 100, height: 150, top: 0, right: 0, zIndex: 2, elevation: 10}}
              blurRadius={8}
            ></ImageBackground>
          }
        </View>
      }

      {/* {CALL OPTIONS INSIDE CALL (ANY STATE)} */}
      {
        callState !== CallStates.CALL_ENDED
        &&
        <CallOptions onPressOption={onPressOption} video={videoOn} audio={audioOn} incomingCall={callState === CallStates.INCOMING_CALL} />
      }
    </>
  );
};
