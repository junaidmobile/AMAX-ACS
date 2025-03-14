import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportScreeningPage } from './export-screening';

@NgModule({
  declarations: [
    ExportScreeningPage,
  ],
  imports: [
    IonicPageModule.forChild(ExportScreeningPage),
  ],
})
export class ExportScreeningPageModule {}
