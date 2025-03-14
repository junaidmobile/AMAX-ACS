/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { TSPCreate } from './TPS-Create';
import { TPSMileStone } from './TPS-MileStone';
import { Observable } from 'rxjs/Observable';
import { debounce } from 'ionic-angular/umd/util/util';
export class TSPSerachClass {
  pi_intAWBId: any; pi_strFolderPrefix: any; pi_strMawbNo: any; pi_strHawbNo: any; pi_strFileList: any;
  pi_strRemarks: any; pi_strUser: any; pi_strPrm1: any;
}
export class fileUploadParm {
  Filename: any; Folder: any; bytes: any;
}

export class CompanyIncoDocUploadModel {
  DocUploadId: any;
  DID: any;
  DocumentTypeName: string;
  FileData: any;
  FileName: string;
  CompanyId: any;
  DocumentName: string;
  Remarks: string;
  UploadedDate: any;
  UploadedByName: string;
  LastModifiedDate: any;
  LastModifiedByName: string;
  IsDeleted: boolean;
  FileSavePath: string;
  ActualFile: File;
  UserId: any;
}

@Component({
  selector: 'DOCS-Upload-OC',
  templateUrl: 'DOCS-Upload-OC.html'
})

export class DOCSUploadOC implements OnInit {
  fileToUpload: File = null;
  appBuildConfig: any;
  title: String;
  OCNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass
  _strUserName: any;
  showDiv: boolean;
  tspdetails: any;
  TSPPaidAmount: any;
  tspdetails_set: any;
  HAWBNo: any;
  flag: any;
  MultipleTSP: any;
  lblTSP: boolean;
  ddlTSP: boolean;
  userForm: FormGroup;
  items: FormArray;
  fileList: any = '';
  HAWBID: string;
  DOCSuccess: any;
  fileOC: any;
  fileSize: number;
  fileName: any;
  filePath: any;
  docPicker: any;
  fileChooser: any;
  httpClient: any;
  fileParm: fileUploadParm;
  private base64textString: any;
  documentuploadobj: CompanyIncoDocUploadModel;
  docsStatus: any;
  uploadPath: string[];
  StatusOfdocs: string;
  fileLocation: string;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private fb: FormBuilder) {

    this.MAWBNo = localStorage.getItem('MAWBNo');
    this.HAWBNo = localStorage.getItem('HAWBNo');
    this.HAWBID = localStorage.getItem('HAWBID');
    this.flag = localStorage.getItem('flag');
    this._allPrams = new TSPSerachClass();
    this.fileParm = new fileUploadParm();
    this.documentuploadobj = new CompanyIncoDocUploadModel();
    this.appBuildConfig = this.global.appBuildConfig;
    this.title = "Document Upload";

    this.userForm = this.fb.group({
      name: [],
      phones: this.fb.array([
        this.fb.control(null)
      ])
    })
  }

  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];

  }

  addPhone(): void {
    (this.userForm.get('phones') as FormArray).push(
      this.fb.control(null)
    );
  }

  removePhone(index) {
    (this.userForm.get('phones') as FormArray).removeAt(index);
  }

  getPhonesFormControls(): AbstractControl[] {
    return (<FormArray>this.userForm.get('phones')).controls
  }



  send(values) {
    console.log(values);
  }

  special_char(event) {
    var k;
    k = event.charCode;        
    // k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  UploadDoc_HHT_Recon() {
    debugger
    if (this.OCNumber == '') {
      this.global.showAlert("Please enter OoC Number.");
      return;
    }
    if (this.OCNumber == 0) {
      this.global.showAlert("OoC Number should be greater than zero.");
      this.OCNumber = '';
      return;
    }

    this._allPrams.pi_intAWBId = '0';
    this._allPrams.pi_strFolderPrefix = 'IBCM';
    this._allPrams.pi_strMawbNo = this.MAWBNo;
    if (this.HAWBNo == null) {
      this._allPrams.pi_strHawbNo = '';
    } else {
      this._allPrams.pi_strHawbNo = this.HAWBNo;
    }

    if (this.fileList != '') {
      this._allPrams.pi_strFileList = '<FileList><FileDetails DocName = "' + 'OoC' + '" UploadedPath="' + this.fileLocation + '" FilePath="' + this.fileList + '" FLName="' + this.fileName + '" FLSize="' + this.fileSize + '"/></FileList>';// this.fileList;

    } else {
      this._allPrams.pi_strFileList = '<FileList></FileList>';// this.fileList;
    }

    this._allPrams.pi_strRemarks = 'M';
    this._allPrams.pi_strUser = this._strUserName;
    this._allPrams.pi_strPrm1 = this.OCNumber;

    // this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.UploadDoc_HHT_Recon, this._allPrams).then((response) => {
      this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.UploadDoc_HHT_Recon, this._allPrams).then((response) => {
      console.log(response);
      if (response != "") {
        this.DOCSuccess = response['Root']['Output'].toString();
         this.global.showAlert(this.DOCSuccess);
       // this.showConfirmForDocs();
      } else {
        //this.global.showAlert("Record not found.");
        this.showConfirmForDocs();
      }
    }, (error) => {
      console.log(error);
    });
  }

  showConfirmForDocs() {
    let confirm = this.alertCtrl.create({
      // title: this.DOCSuccess,
      title: 'OoC details updated successfully.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
           // this.global.routePage(TPSMileStone);
          //  this.global.generateGP = 1; // added by Himesh on 10/11/2020 to enable Generate GP button
          //above line of code commented by Himesh on 19/11/2020 due to regression issues
          //  this.global.oocBtn = false; // 18/11/2020
          // this.global.oocCount += 1;
           this.navCtrl.pop(); // required changes may be here as on 18/11/2020, may be need to add variables for buttons
          }
        }
      ]
    });
    confirm.present();
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.fileList = event.target.files[0].name;
    }
  }

  onCustodianChange(event) {
    this.OCNumber = event;
    // this.isInputDisabled();
  }

  readFile($event) {


    // //const file = fileEvent.target.files[0];

    // const FileSize = fileEvent.files[0].size / 1024 / 1024; // in MB
    // if (FileSize > 2) {
    //   alert('File size exceeds 2 MB');
    //   // $(file).val(''); //for clearing with Jquery
    // } else {

    // }

    // // if (file.size > 2000) {
    // //   this.global.showAlert("File size should be less than 2MB.");
    // // } else {

    // // }

    this.fileOC = $event.target.files[0];
    console.log("file========", $event.target.files[0]);

    this.fileName = this.fileOC.name;
    console.log("file Name========", this.fileName);
    const fsize = this.fileOC.size;
    this.fileSize = Math.round((fsize / 1024));
    console.log("file size ========", this.fileSize);
    // The size of the file.
    if (this.fileSize >= 2048) {
      this.fileList = '';
      this.global.showAlert("Please select a file less than 2MB.");
    } else {
      // debugger;
      // let fileList: FileList = $event.target.files;

      // let file: File = fileList[0];
      // let formData: FormData = new FormData();
      // formData.append('uploadFile', file, file.name);




    }


  }





  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];
    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);

    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);

    this.documentuploadobj.FileData = this.base64textString.toString(
      binaryString
    );
    console.log(this.documentuploadobj.FileData);

    this.FileSave_Upload();
    //this.show = true;
  }

  onSelectFile(event) {
    this.handleFileSelect(event);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      let file = event.target.files[0];

      this.documentuploadobj.FileName = file.name;

      this.documentuploadobj.ActualFile = event.target.files[0]

      reader.onload = event => {

      };
    }
  }


  FileSave_Upload() {
    debugger
    // if (this.fileList == '') {
    //  this.UploadDoc_HHT_Recon();
    // } else
    //{
    this.fileParm.Filename = this.documentuploadobj.FileName;
    if (this.HAWBNo == '' || this.HAWBNo == null) {
      this.fileParm.Folder = 'IAWBS-' + this.MAWBNo + '-';
    } else {
      this.fileParm.Folder = 'IAWBS-' + this.MAWBNo + '-' + this.HAWBNo;
    }

    this.fileParm.bytes = this.documentuploadobj.FileData;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.FileSave_Upload, this.fileParm).then((response) => {
      debugger
      console.log("Response : ", response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {

        } else {
          debugger
          this.docsStatus = response['Root']['Output'].toString();
          this.uploadPath = this.docsStatus.split(',');

          this.StatusOfdocs = this.uploadPath[0];
          this.fileLocation = this.uploadPath[1];

          if (this.StatusOfdocs == 'True') {
            console.log(this.uploadPath);

            // this.UploadDoc_HHT_Recon();

          } else {
           // this.global.showAlert("");
          }
        }
      } else {
        //   this.global.showAlert("OTP is invalid.");

      }



    }, (error) => {
      console.log(error);
    });
    // }

  }
  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }

}
