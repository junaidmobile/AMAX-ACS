/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:12
 * @modify date 2018-07-16 11:45:12
 * @desc [description]
*/
import { Component, Input, OnInit } from '@angular/core';
import { GlobalProvider } from '../../providers/global/global';
import { Notifications } from '../../pages/notifications/notifications';
import { MainMenu } from '../../pages/main-menu/main-menu';
import { HomePage } from '../../pages/home/home';
@Component({
  selector: 'Gmax-header',
  templateUrl: 'header.html'
})

export class HeaderDirective implements OnInit {
  @Input('title') title: string;
  @Input('isCSC') isCsc: boolean;
  color: String;
  constructor(public global: GlobalProvider) {


  }

  ngOnInit() {
    this.color = this.isCsc ? "primaryCsc" : "primary";
    console.log("isCsc ", this.color);
  }

  logOut() {
    this.global.confirmlogOut();
  }

  notifications() {
    this.global.routePage(Notifications);
  }

  homeButton() {
    this.global.setRootPage(HomePage);
  }


}
