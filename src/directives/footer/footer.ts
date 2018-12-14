/**
 * @author Sachin Semlety
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:45:12
 * @modify date 2018-07-16 11:45:12
 * @desc [description]
*/
import { Component } from '@angular/core';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'Gmax-footer',
  templateUrl: 'footer.html'
})

export class FooterDirective {
  appBuildConfig: any;

  constructor(public global: GlobalProvider) {
    this.appBuildConfig = this.global.appBuildConfig;
  }

}
