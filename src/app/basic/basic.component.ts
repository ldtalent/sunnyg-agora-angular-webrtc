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
      const uid = this.stream.generateUid();
      const rtcDetails = await this.stream.generateTokenAndUid(uid);
      this.stream.createRTCClient();
      this.stream.agoraServerEvents(this.stream.rtc);
      await this.stream.localUser(rtcDetails.token, uid);

      this.hideBtns = false;
  }






  async logout() {
    await this.stream.leaveCall();
  }


}
