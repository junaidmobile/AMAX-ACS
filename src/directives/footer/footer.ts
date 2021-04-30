/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:12
 * @modify date 2018-07-16 11:45:12
 * @desc [description]
*/
import { Component, Input, OnInit } from '@angular/core';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'Gmax-footer',
  templateUrl: 'footer.html'
})

export class FooterDirective implements OnInit {
  appBuildConfig: any;
  @Input('isCSC') isCsc: boolean;
  color: String;
  constructor(public global: GlobalProvider) {
    this.appBuildConfig = this.global.appBuildConfig;
  }

  ngOnInit() {
    this.color = this.isCsc ? "primaryCsc" : "primary";
  }
}
