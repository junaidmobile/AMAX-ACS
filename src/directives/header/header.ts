/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:12
 * @modify date 2018-07-16 11:45:12
 * @desc [description]
*/
import { Component, Input } from '@angular/core';
import { GlobalProvider } from '../../providers/global/global';
import { Notifications } from '../../pages/notifications/notifications';
@Component({
  selector: 'Gmax-header',
  templateUrl: 'header.html'
})

export class HeaderDirective {
  @Input('title') title: string;

  constructor(public global: GlobalProvider) {

  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    this.global.routePage(Notifications);
  }


}
