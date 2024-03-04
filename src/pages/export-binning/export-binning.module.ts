import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportBinningPage } from './export-binning';

@NgModule({
  declarations: [
    ExportBinningPage,
  ],
  imports: [
    IonicPageModule.forChild(ExportBinningPage),
  ],
})
export class ExportBinningPageModule {}
