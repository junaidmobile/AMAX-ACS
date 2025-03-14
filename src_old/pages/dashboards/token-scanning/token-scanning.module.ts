import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TokenScanningPage } from './token-scanning';

@NgModule({
  declarations: [
    TokenScanningPage,
  ],
  imports: [
    IonicPageModule.forChild(TokenScanningPage),
  ],
})
export class TokenScanningPageModule {}
