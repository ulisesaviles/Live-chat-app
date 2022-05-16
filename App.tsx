// Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

// // Screens
import Root from "./screens/root";
import Login from "./screens/login";
import Main from "./screens/main";
import Chat from "./screens/chat/chat";
import Call from "./screens/call/call";
import Welcome from "./screens/login/welcome";
import AddFriend from "./screens/main/addFriend";
import SignUp from "./screens/login/SignUp";
import { ProfileModal } from "./screens/chat/profileModal";
import { TransitionPresets } from "@react-navigation/stack";
import { useEffect, useRef, useState } from "react";
import WebRTCHelper from "./config/webRTC";
import { getCallRef, getMyCalleeRef } from "./db/call";
import { onSnapshot } from "firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { mediaDevices, RTCPeerConnection } from "react-native-webrtc";

// Default react component to export
export default () => {
  const configuration: any = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
  const [localStream, setLocalStream] = useState <MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [gettingCall, setGettingCall] = useState(false);
  const pc: any = useRef<RTCPeerConnection>();
  const connecting = useRef(false);

  useEffect(() => {
    // getMyCalleeRef().then(ref => {
    //   if (ref) {
    //     onSnapshot(ref, (data) => {
    //       console.log(data);
    //     });
    //   }
    // });

    setupWebRTC();

  }, []);

  const setupWebRTC = async () => {
    // pc.current = new RTCPeerConnection(configuration);
    // const stream =  WebRTCHelper.getStream();
    // console.log(stream);

    // if (stream) {
    //   setLocalStream(stream);
    //   pc.current.addStream(stream);

    // }
  };

  const createCall = async () => {
    connecting.current = true;

    await setupWebRTC();

    const cRef = getCallRef();

    collectIceCandidates(cRef, 'caller', 'callee');

    if (pc.current) {
      const offer = pc.current.createOffer();

      pc.current.setLocalDescription(offer);

      const cWithOffer = { offer };
    }
  };

  const collectIceCandidates = (cRef: any, localname: string, remoteName: string) => {
    const candidateCollection = cRef.collection(localname);

    if (pc.current) {
      pc.current.onicecandidate = (event: any) => {
        if (event.candidate) {
          candidateCollection.add(event.candidate);
        }
      }
    }
  };

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FriendProfile"
            component={ProfileModal}
            options={{ headerShown: false, ...TransitionPresets.ModalSlideFromBottomIOS, gestureEnabled: true, presentation: 'modal'  }}
          />
          <Stack.Screen
            name="Call"
            component={Call}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddFriend"
            component={AddFriend}
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
};
