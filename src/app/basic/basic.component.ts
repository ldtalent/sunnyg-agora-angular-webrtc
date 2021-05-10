import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StreamService } from '../services/stream.service';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {

  hideBtns = true;

  constructor(public stream: StreamService, public api: ApiService) {
  }

  ngOnInit() {

  }

  async startCall() {
      const uid = this.generateUid();
      const rtcDetails = await this.generateTokenAndUid(uid);
      this.stream.createRTCClient();
      this.stream.agoraServerEvents(this.stream.rtc);
      await this.stream.localUser(rtcDetails.token, uid);

      this.hideBtns = false;
  }

// rtc token
  async generateTokenAndUid(uid) {
    // https://test-agora.herokuapp.com/access_token?channel=test&uid=1234
    let url = 'https://test-agora.herokuapp.com/access_token?';
    const opts = { params: new HttpParams({ fromString: "channel=test&uid=" + uid }) };
    const data = await this.api.getRequest(url, opts.params).toPromise();
    return { 'uid': uid, token: data['token'] }

  }

  generateUid() {
    const length = 5;
    const randomNo = (Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)));
    return randomNo;
  }




  async logout() {
    await this.stream.leaveCall();
  }


}
