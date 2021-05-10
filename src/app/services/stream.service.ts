import { Injectable } from '@angular/core';
import AgoraRTC, { IAgoraRTCClient, LiveStreamingTranscodingConfig, ICameraVideoTrack, IMicrophoneAudioTrack, ScreenVideoTrackInitConfig, VideoEncoderConfiguration, AREAS, IRemoteAudioTrack, ClientRole } from "agora-rtc-sdk-ng"
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StreamService {
  rtc: IRtc = {
    // For the local client.
    client: null,
    // For the local audio and video tracks.
    localAudioTrack: null,
    localVideoTrack: null,
  };
  options = {
    appId: "",  // set your appid here
    channel: "test", // Set the channel name.
    // token: '', // Pass a token if your project enables the App Certificate.
    // uid: null
  };
  remoteUsers: IUser[] = [];       // To add remote users in list
  updateUserInfo = new BehaviorSubject<any>(null); // to update remote users name

  constructor() { }

  createRTCClient() {
    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
    // this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" , role: 'audience'});
  }
  // comment it if you don't want virtual camera
  async switchCamera(label, localTracks) {
    let cams = await AgoraRTC.getCameras(); //  all cameras devices you can use
    let currentCam = cams.find(cam => cam.label === label);
    await localTracks.setDevice(currentCam.deviceId);
  }

  // To join a call with tracks (video or audio)
  async localUser(token, uuid) {
    const uid = await this.rtc.client.join(this.options.appId, this.options.channel,
      token, uuid);
    // Create an audio track from the audio sampled by a microphone.
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a video track from the video captured by a camera.
    this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: "120p",
    });
    // comment it if you want to use your camera
    this.switchCamera('OBS Virtual Camera', this.rtc.localVideoTrack)
    // Publish the local audio and video tracks to the channel.
    // this.rtc.localAudioTrack.play();
    this.rtc.localVideoTrack.play("local-player");
    // channel for other users to subscribe to it.
    await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
  }

  agoraServerEvents(rtc) {

    rtc.client.on("user-published", async (user, mediaType) => {
      console.log(user, mediaType, 'user-published');

      await rtc.client.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play('remote-playerlist' + user.uid);
      }
      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });
    rtc.client.on("user-unpublished", user => {
      console.log(user, 'user-unpublished');
    });


    rtc.client.on("user-joined", (user) => {
      let id = user.uid;
      this.remoteUsers.push({ 'uid': +id });
      this.updateUserInfo.next(id);
      console.log("user-joined", user, this.remoteUsers, 'event1');
    });
  }
  // To leave channel-
  async leaveCall() {
    // Destroy the local audio and video tracks.
    this.rtc.localAudioTrack.close();
    this.rtc.localVideoTrack.close();
    // Traverse all remote users.
    this.rtc.client.remoteUsers.forEach(user => {
      // Destroy the dynamically created DIV container.
      const playerContainer = document.getElementById('remote-playerlist' + user.uid.toString());
      playerContainer && playerContainer.remove();
    });
    // Leave the channel.
    await this.rtc.client.leave();

  }



}
export interface IUser {
  uid: number;
  name?: string;
}
export interface IRtc {
  client: IAgoraRTCClient,
  localAudioTrack: IMicrophoneAudioTrack,
  localVideoTrack: ICameraVideoTrack
}
