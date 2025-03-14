/**
 * @author Mohammaed Junaid
 * @email sachin.semlety@kalelogistics.in
 * @create date 2018-07-16 11:43:30
 * @modify date 2018-07-16 11:43:30
 * @desc [description]
*/
import { Component, OnInit, Input } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpProvider } from '../../../../providers/http/http';
import { Constants } from '../../../../constant';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { TSPCreate } from './TPS-Create';
import { TPSMileStone } from './TPS-MileStone';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
export class TSPSerachClass {
  pi_intAWBId: any; pi_strFolderPrefix: any; pi_strMawbNo: any; pi_strHawbNo: any; pi_strFileList: any;
  pi_strRemarks: any; pi_strUser: any; pi_strPrm1: any;
}
import moment from 'moment';

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
  selector: 'DOCS_Uplaod',
  templateUrl: 'DOCS_Uplaod.html'
})

export class DOCSUplaod implements OnInit {
  appBuildConfig: any;
  title: String;
  TSPNumber: any = '';
  MAWBNo: any = '';
  _allPrams: TSPSerachClass
  fileParm: fileUploadParm;
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
  _DocsType: any = 0;
  DocumnetType: any;
  DOCSuccess: any;
  urls = new Array<string>();

  myFiles: any[] = [];
  myFilesXML: any[] = [];
  sMsg: string = '';

  checkHAWB;

  selectedOption;

  @Input() name: string;

  fileXML: any = '';
  fileXMLStore: string;
  file: any;
  fileSize: number;
  filePath: any;
  fileName: any;
  fileZero: boolean;
  filelength: any = '';
  fileInput: any = '';
  a: number = 0;
  b: number = 0;
  c: number = 0;
  d: number = 0;
  private base64textString: any;
  documentuploadobj: CompanyIncoDocUploadModel;
  docsStatus: any;
  allFileBase64: any = [];
  M_Path: string;

  F_Path: string;
  uploadPath: string[];
  StatusOfdocs: string;
  fileLocation: string;

  isValidFileName: boolean = false;
  today: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpProvider, public global: GlobalProvider,
    private platform: Platform, private fb: FormBuilder) {

    this.MAWBNo = localStorage.getItem('MAWBNo');
    console.log(this.MAWBNo);
    this.HAWBNo = localStorage.getItem('HAWBNo');
    // console.log(this.HAWBNo);
    this.HAWBID = localStorage.getItem('HAWBID');
    // console.log(this.HAWBID);

    this.today = this.getCurrentTime();
    // console.log(this.today);

    //debugger
    // -- UAT
    if (this.HAWBNo == '' || this.HAWBNo == null) {
      this.M_Path = 'ftp://uatftp.kalelogistics.com:2022/MIALGENDoc/' + 'IAWBS-' + this.MAWBNo;
    } else {
      this.M_Path = 'ftp://uatftp.kalelogistics.com:2022/MIALGENDoc/' + 'IAWBS-' + this.MAWBNo + '-' + this.HAWBNo;
    }

    //-- Prod/Live
    // if (this.HAWBNo == '' || this.HAWBNo == null) {
    //   this.M_Path = 'ftp://ftp.gvk.com:2222/MIALGENDoc/' + 'IAWBS-' + this.MAWBNo;
    // } else {
    //   this.M_Path = 'ftp://ftp.gvk.com:2222/MIALGENDoc/' + 'IAWBS-' + this.MAWBNo + '-' + this.HAWBNo;
    // }

    // ftp://uatftp.kalelogistics.com:2022/MIALGENDoc/ -- UAT
    // ftp://ftp.gvk.com:2222/MIALGENDoc/ -- Prod/Live



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

  getFileDetails(e) {

    // console.log('jkl - - ' + e.target.files);
    this.filelength = e.target.files.length;

    // if (this.a != 0 && this._DocsType == 'MAWB') {
    //   this.global.showAlert("MAWB already selected.");
    //   this.fileInput = '';
    //   return;
    // }

    // if (this.HAWBNo != '') {
    //   if (this.b != 0 && this._DocsType == 'HAWB') {
    //     this.global.showAlert("HAWB already selected.");
    //     this.fileInput = '';
    //     return;
    //   }

    // }

    // if (this.c != 0 && this._DocsType == 'BOE') {
    //   this.global.showAlert("BOE already selected.");
    //   this.fileInput = '';
    //   return;
    // }

    // if (this.d != 0 && this._DocsType == 'OoC') {
    //   this.global.showAlert("OoC already selected.");
    //   this.fileInput = '';
    //   return;
    // }

    // for (var i = 0; i < e.target.files.length; i++) {

    //   this.file = e.target.files[i];
    //   this.fileName = this.file.name;
    //   const fsize = this.file.size;
    //   this.fileSize = Math.round((fsize / 1024));
    //   if (this.fileSize >= 2048) {
    //     this.file = [];
    //     this.global.showAlert("Please select a file less than 2MB.");
    //     this.fileInput = '';
    //     this.filelength = 0;
    //     return;
    //   }

    //   this.myFiles.push(e.target.files[i]);

    //   if (this._DocsType == 'MAWB') {
    //     this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FilePath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FLName="' + e.target.files[i].name + '" FLSize="' + e.target.files[i].size + '" />');
    //     this.a = 1;
    //   } else if (this._DocsType == 'HAWB') {
    //     this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FilePath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FLName="' + e.target.files[i].name + '" FLSize="' + e.target.files[i].size + '" />');
    //     this.b = 1;
    //   } else if (this._DocsType == 'BOE') {
    //     this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FilePath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FLName="' + e.target.files[i].name + '" FLSize="' + e.target.files[i].size + '" />');
    //     this.c = 1;
    //   } else if (this._DocsType == 'OoC') {
    //     this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FilePath="' + 'ftp://10.22.2.91/MIALDoc/IAWBS-12578478444-H1' + '" FLName="' + e.target.files[i].name + '" FLSize="' + e.target.files[i].size + '" />');
    //     this.c = 1;
    //   }


    //   // this.fileXML = '<FileList><FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + e.target.files[i].name + '" FilePath="' + e.target.files[i].name + '" FLName="' + e.target.files[i].name + '" FLSize="' + e.target.files[i].size + '" /></FileList>';// this.fileList;
    // }
    // console.log('<FileList>' + this.myFilesXML + '</FileList>')
    // this.fileXMLStore = '<FileList>' + this.myFilesXML + '</FileList>';
  }

  uploadFiles() {
    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {

      frmData.append("fileUpload", this.myFiles[i]);

    }
    console.log(this.fileXML);
  }


  ngOnInit() {
    this._strUserName = JSON.parse(this.global.get('userResp')).UserName[0];
    this.GetDocType_HHT();

  }

  getCurrentTime() {
    return moment().format('DDMMYYYY');
  }

  // detectFiles(event) {
  //   debugger
  //   this.urls = [];
  //   let files = event.target.files;
  //   if (files) {
  //     for (let file of files) {
  //       let reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.urls.push(e.target.result);
  //         console.log(e.target.result);
  //       }
  //       reader.readAsDataURL(file);
  //       console.log(file);
  //     }

  //   }
  // }

  addPhone(): void {
    (this.userForm.get('phones') as FormArray).push(
      this.fb.control(null)
    );
  }

  removePhone(index) {
    (this.userForm.get('phones') as FormArray).removeAt(index);
  }

  // getPhonesFormControls(): AbstractControl[] {
  //   return (<FormArray>this.userForm.get('phones')).controls
  // }

  // send(values) {
  //   console.log(values);
  // }



  GetDocType_HHT() {

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.GetDocType_HHT_Docs).then((response) => {
      console.log('DocumnetType' + response);
      if (response != null && response != "") {
        this.DocumnetType = response['NewDataSet']['Table'];

        if (this.HAWBNo == '') {
          this.DocumnetType =
            this.DocumnetType.filter(
              HAWB => HAWB.DOCTYPE != 'HAWB'
            );
        }

        if (this.HAWBNo != '') {
          this.DocumnetType =
            this.DocumnetType.filter(
              HAWB => HAWB.DOCTYPE != 'HAWB'
              // MAWB => MAWB.DOCTYPE != 'MAWB'
            );
        }

        if (this.HAWBNo != '') {
          this.DocumnetType =
            this.DocumnetType.filter(
              MAWB => MAWB.DOCTYPE != 'MAWB'
            );
        }
        // this.DocumnetType =
        //   this.DocumnetType.filter(
        //     HAWB => HAWB.DOCTYPE != 'HAWB'
        //   );

        // this.TSPNumber = this.MultipleTSP[0]['TSPNo'];
      } else {
        this.global.showAlert("Record not found.");
      }
    }, (error) => {
      console.log(error);
    });
  }

  onServiceTypeChange(event) {
    this._DocsType = event;
    // this.isInputDisabled();
    console.log('check the selected doctype: ', event);
    this.selectedOption = event;
    console.log('selected option: ', this.selectedOption[0]);
    // if(this.selectedOption[0] == 'OoC'){
    //   this.global.oocBtn = true;
    // }
  }

  UploadDoc_HHT_Recon() {
    // if (this._DocsType == 0) {
    //   this.global.showAlert("Please select Documnet Type.");
    //   return;
    // }
    // if (this.fileList == '') {
    //   this.global.showAlert("Please select file.");
    //   return;
    // }
    //debugger
    if (this.filelength == 0 || this.filelength == '') {
      this.global.showAlert("Please select file.");
      return;
    }
    this._allPrams.pi_intAWBId = 0;
    this._allPrams.pi_strFolderPrefix = 'IBCM';
    this._allPrams.pi_strMawbNo = this.MAWBNo;
    if (this.HAWBNo == null) {
      this._allPrams.pi_strHawbNo = '';
    } else {
      this._allPrams.pi_strHawbNo = this.HAWBNo;
    }
    this._allPrams.pi_strFileList = this.fileXMLStore;
    this._allPrams.pi_strRemarks = 'M';
    this._allPrams.pi_strUser = this._strUserName;
    this._allPrams.pi_strPrm1 = '';

    console.log(this.isValidFileName);
    console.log(this._DocsType);

    if (!this.isValidFileName && this._DocsType == 'MAWB') {
      this.global.showAlert("Kindly modify the MAWB file name as per defined naming convention to upload shipment documents.");
    } else {
      console.log("uploaddd----------------");

      this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.UploadDoc_HHT_Recon, this._allPrams).then((response) => {
        console.log(response);
        //if (response == null && response == "") {
          if (response != "") {
          this.DOCSuccess = response['Root']['Output'].toString();
          this.global.showAlert(this.DOCSuccess);
          //this.showConfirmForDocs();
        } else {
          this.global.showAlert("Record not found.");
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  showConfirmForDocs() {
    let confirm = this.alertCtrl.create({
      title: this.DOCSuccess,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if (this.selectedOption == 'OoC') { //new if
              this.global.oocBtn = false;
              // this.global.oocCount += 1;
            }
            // this.global.routePage(TPSMileStone);
            // this.navCtrl.pop();
            this.navCtrl.remove(this.navCtrl.getActive().index - 0, 1); //added by Himesh on 03/11/2020
          }
        }
      ]
    });
    confirm.present();
  }

  // upload() {
  //   debugger
  //   this.fileList;
  // }

  onCustodianChange(event) {
    this.TSPNumber = event;
    // this.isInputDisabled();
  }


  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;

    console.log('check for direct/console: ', localStorage.getItem('HAWBNo'));
    this.checkHAWB = localStorage.getItem('HAWBNo');
  }

  ionViewWillLeave() {
    this.fabGone = true;
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
    // console.log(this.documentuploadobj.FileData);
    // this.allFileBase64.push(this.documentuploadobj.FileData)

    // console.log(this.allFileBase64.length)

    //this.show = true;
    this.FileSave_Upload();
  }

  onSelectFile(event) {


    if (this.a != 0 && this._DocsType == 'MAWB') {
      this.global.showAlert("MAWB already selected.");
      this.fileInput = '';
      return;
    }

    if (this.HAWBNo != '') {
      if (this.b != 0 && this._DocsType == 'HAWB') {
        this.global.showAlert("HAWB already selected.");
        this.fileInput = '';
        return;
      }

    }

    if (this.c != 0 && this._DocsType == 'BOE') {
      this.global.showAlert("BOE already selected.");
      this.fileInput = '';
      return;
    }

    if (this.d != 0 && this._DocsType == 'OoC') {
      this.global.showAlert("OoC already selected.");
      this.fileInput = '';
      return;
    }

    for (var i = 0; i < event.target.files.length; i++) {

      this.file = event.target.files[i];
      this.fileName = this.file.name;
      const fsize = this.file.size;
      this.fileSize = Math.round((fsize / 1024));
      if (this.fileSize >= 2048) {
        this.file = [];
        this.global.showAlert("Please select a file less than 2MB.");
        this.fileInput = '';
        this.filelength = 0;
        return;
      }

      this.myFiles.push(event.target.files[i]);

      if (this._DocsType == 'MAWB') {
        this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + this.M_Path + '" FilePath="' + this.fileInput + '" FLName="' + event.target.files[i].name + '" FLSize="' + event.target.files[i].size + '" />');
        console.log("____________********************************))))))))))))))))))))))))((((((((((((((((((((((((");
        // console.log(event.target.files[i].name.length);
        // console.log(event.target.files[i].name.substring(0, 5));
        // console.log(event.target.files[i].name.substring(5, 17));
        // console.log(event.target.files[i].name.substring(17, 25));

        if (event.target.files[i].name.length != 30) {
          this.isValidFileName = false;
          // console.log("here");
        } else {
          //previous third condition was   && event.target.files[i].name.substring(18, 26) == this.today
          if (event.target.files[i].name.substring(0, 5) == "MAWB_"
            && event.target.files[i].name.substring(5, 18) == this.MAWBNo.substring(0, 3) + "-" + this.MAWBNo.substring(3) + "_"
            && event.target.files[i].name.substring(18, 26).length == 8) {

            var Datesubstring = event.target.files[i].name.substring(18, 26);
            var DatesubstringNEW = Datesubstring.substring(0, 2) + "-" + Datesubstring.substring(2, 4) + "-" + Datesubstring.substring(4, 8);
            let parsedDate = moment(DatesubstringNEW, "DD-MM-YYYY");
            if (isNaN(parsedDate.valueOf()))
              this.isValidFileName = false;
            else
              this.isValidFileName = true;
            // this.isValidFileName = true;
            // console.log("here1");

          } else {
            this.isValidFileName = false;
            // console.log("here2");

          }
        }


        // if (event.target.files[i].name.substring(0, 5) == "MAWB_") {
        //   console.log("here");
        //   console.log(this.MAWBNo + "_");
        //   console.log(event.target.files[i].name.substring(5, 18));
        // } 

        // if (event.target.files[i].name.substring(5, 18) == this.MAWBNo.substring(0, 3) + "-" + this.MAWBNo.substring(3) + "_") {
        //   console.log("here1");
        // }

        // if (event.target.files[i].name.substring(18, 25) == this.today) {
        //   console.log("here2");
        // }

        console.log(this.isValidFileName);

        this.a = 1;
      } else if (this._DocsType == 'HAWB') {
        this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + this.M_Path + '" FilePath="' + this.fileInput + '" FLName="' + event.target.files[i].name + '" FLSize="' + event.target.files[i].size + '" />');
        this.b = 1;
      } else if (this._DocsType == 'BOE') {
        this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + this.M_Path + '" FilePath="' + this.fileInput + '" FLName="' + event.target.files[i].name + '" FLSize="' + event.target.files[i].size + '" />');
        this.c = 1;
      } else if (this._DocsType == 'OoC') {
        this.myFilesXML.push('<FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + this.M_Path + '" FilePath="' + this.fileInput + '" FLName="' + event.target.files[i].name + '" FLSize="' + event.target.files[i].size + '" />');
        this.d = 1; //this needs to be checked if its c or d.
      }


      // this.fileXML = '<FileList><FileDetails DocName = "' + this._DocsType + '" UploadedPath="' + e.target.files[i].name + '" FilePath="' + e.target.files[i].name + '" FLName="' + e.target.files[i].name + '" FLSize="' + e.target.files[i].size + '" /></FileList>';// this.fileList;
    }
    console.log('<FileList>' + this.myFilesXML + '</FileList>')
    this.fileXMLStore = '<FileList>' + this.myFilesXML + '</FileList>';

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

  // filUploadMultipleTime() {
  //   debugger
  //   for (var i = 0; i < this.allFileBase64.length; i++) {
  //     this.FileSave_Upload();
  //   }

  //   this.UploadDoc_HHT_Recon();
  // }

  FileSave_Upload() {

    this.fileParm.Filename = this.documentuploadobj.FileName;
    if (this.HAWBNo == '' || this.HAWBNo == null) {
      // this.fileParm.Folder = 'IAWBS-' + this.MAWBNo + '-';
      this.fileParm.Folder = 'IAWBS-' + this.MAWBNo;
    } else {
      this.fileParm.Folder = 'IAWBS-' + this.MAWBNo + '-' + this.HAWBNo;
    }
    this.fileParm.bytes = this.documentuploadobj.FileData;

    this.http.getHttpPostRequest(Constants.GMAX_Services.Imports.FileSave_Upload, this.fileParm).then((response) => {

      console.log(" file save Response : ", response);
      if (response != null && response != "") {

        if (response.hasOwnProperty('NewDataSet')) {
          debugger
        } else {
          this.docsStatus = response['Root']['Output'].toString();

          this.uploadPath = this.docsStatus.split(','); //new on 01/06 for doc upload error

          this.StatusOfdocs = this.uploadPath[0]; //new on 01/06 doc upload error
          this.fileLocation = this.uploadPath[1]; //new on 01/06 doc upload error


          if (this.docsStatus == 'true') {
            //this.UploadDoc_HHT_Recon();
          }
          //  else {
          //   this.global.showAlert("Please try again some error occurs in process.");
          // }
        }
      } else {
        //   this.global.showAlert("OTP is invalid.");

      }

    }, (error) => {
      console.log(error);
    });
  }

}

