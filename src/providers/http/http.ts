import { Injectable } from '@angular/core';
// import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import 'rxjs/add/operator/finally';
import { Http, RequestMethod, RequestOptionsArgs, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from "../../constant";
import { LoadingController, AlertController, ToastController, Header } from 'ionic-angular';
import * as xml2js from 'xml2js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalProvider } from '../global/global';
// import { HTTP } from '@ionic-native/http';
import { HTTP } from '@ionic-native/http';
import { IonicNativePlugin } from '@ionic-native/core';
// import { HTTPOriginal } from '@ionic-native/http';

/**
 * @name HttpProvider
 * @author Sachin Semlety
 * @description
 * This Class is used to set the Http Operations like GET,POST,PUT etc for the app.
**/
@Injectable()
export class HttpProvider {
  // globalService: any;
  constructor(public http: Http, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public toastCtrl: ToastController,
    public globalService: GlobalProvider, public nativeHttp: HTTP,) {
  }


  public getHttpRequest(service_name: string, requestMethod: RequestMethod, body?: any, isCsc?: boolean) {

    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    return new Promise((resolve, reject) => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      if (connectionStatus == 'online') {
        let requestOptionArgs: RequestOptionsArgs;
        requestOptionArgs = {
          url: isCsc ? Constants.CSC_Service_URL + service_name : Constants.GMAX_Service_URL + service_name,
          method: requestMethod,
          body: body,
          headers: new Headers({
            "Content-Type": "application/json",
            "access-control-allow-methods": 'GET, POST',
            "access-control-allow-origin": "*",
            "Access-Control-Allow-Credentials": 'true'
            //add any extra custom headers you need
          })
        }

        console.log(requestOptionArgs);
        //show the loader before starting the request
        let loader = this.showLoader();

        this.http.request(service_name, requestOptionArgs)
          .map(res => res.json())
          .subscribe(data => {
            //console.log("Data ", data)
            let resolvedDataToJson;
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference

            // Dismiss the loader and return response back.

            xml2js.parseString(data.d, function (err, result) {
              console.dir(result); // Prints JSON object!
              resolvedDataToJson = result;
            });

            loader.dismiss().then(() => resolve(resolvedDataToJson));

          }, (error) => {
            // Dismiss the loader and return error back.
            //console.log("Error Made" + JSON.stringify(error.json()));
            let err = error.json();
            if (err.hasOwnProperty('Message')) {
              console.log(err.Message)
              this.showErrorToast(err.Message)
            }
            loader.dismiss().then(() => reject(error));

          });
      } else if (connectionStatus == "offline") {
        this.showErrorMessage('No Internet Connection');
        reject('');
      }
    });

  }


  // public getHttpRequestAMAX(service_name: string, requestMethod: RequestMethod, body?: any) {

  //   let connectionStatus = navigator.onLine ? 'online' : 'offline';
  //   //  return new Promise((resolve, reject) => {
  //   // We're using Angular Http provider to request the data,
  //   // then on the response it'll map the JSON data to a parsed JS object.
  //   // Next we process the data and resolve the promise with the new data.
  //   if (connectionStatus == 'online') {
  //     // let requestOptionArgs: RequestOptionsArgs;
  //     // console.log(body);
  //     // requestOptionArgs = {
  //     //   url: Constants.AMAX_Service_URL + service_name,
  //     //   method: requestMethod,
  //     //   body: body,
  //     //   headers: new Headers({
  //     //     "Content-Type": "application/json",
  //     //     "access-control-allow-methods": 'GET,POST,PUT,DELETE,OPTIONS',
  //     //     "access-control-allow-origin": "*",
  //     //     "Access-Control-Allow-Credentials": 'true',
  //     //     "Access-Control-Allow-Headers":"*"  //add any extra custom headers you need
  //     //   })
  //     // }
  //     let loader = this.showLoader();
  //     $.ajax({
  //       type: 'GET',
  //       url: Constants.AMAX_Service_URL + service_name,
  //       data: JSON.stringify({}),
  //       contentType: "application/json; charset=utf-8",
  //       dataType: "json",

  //       beforeSend: function doStuff() {
  //         //$('.dialog-background').css('display', 'block');
  //         // $('body').mLoading({
  //         //     text: "Loading..",
  //         // });

  //       },
  //       success: function (response) {
  //         //  $("body").mLoading('hide');
  //         console.log(response);
  //         // var str = response.d;
  //         // if (str != null && str != "") {

  //         loader.dismiss();
  //         //   $.ajax(settings).done(function (response) {
  //         //     console.log(response);
  //         //   });

  //         // }
  //         // else {
  //         //   // errmsg = 'Shipment does not exists';
  //         //   // $.alert(errmsg);
  //         // }

  //       },
  //       error: function (msg) {
  //         //   $("body").mLoading('hide');
  //         console.log(msg.responseText);
  //         //  $.alert(r.Message);
  //       }
  //     });

  //   } else// (connectionStatus == "offline") {
  //     this.showErrorMessage('No Internet Connection');
  //   // reject('');
  //   //   }


  // }

  public getHttpRequestAMAX(service_name: string, requestMethod: RequestMethod, body?: any) {

    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    return new Promise((resolve, reject) => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      if (connectionStatus == 'online') {
        let requestOptionArgs: RequestOptionsArgs;
        console.log(body);
        requestOptionArgs = {
          url: Constants.AMAX_Service_URL + service_name,
          //   url: "http://104.211.161.151/AMAXScreeningAPINew/api/Screning/GetScreeningMasters/3",
          method: requestMethod,
          body: body,
          // headers: new Headers({
          //   "Content-Type": "application/json",
          //   "Access-Control-Allow-Methods": 'GET,POST,PUT,DELETE,OPTIONS',
          //   "Access-Control-Allow-Origin": "http://localhost:8100",
          //   "Access-Control-Allow-Credentials": 'true',
          //   "Access-Control-Allow-Headers": "Content-Type, Origin, Cache-Control, X-Requested-With"

          //   //add any extra custom headers you need
          // })
        }

        console.log(requestOptionArgs);
        console.log(requestOptionArgs);
        //     //show the loader before starting the request
        let loader = this.showLoader();

        this.http.request(service_name, requestOptionArgs)
          .map(res => res.json())
          .subscribe(data => {
            console.log("Data ", data)
            //   let resolvedDataToJson;
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference

            // Dismiss the loader and return response back.

            // xml2js.parseString(data.d, function (err, result) {
            //   console.dir(result); // Prints JSON object!
            //   resolvedDataToJson = result;
            // });

            // if (requestMethod.toString().toLowerCase() == "post") {
            //   let resolvedDataToJson;

            //   xml2js.parseString(data.d, function (err, result) {
            //     console.dir(result); // Prints JSON object!
            //     resolvedDataToJson = result;
            //   });

            //   loader.dismiss().then(() => resolve(resolvedDataToJson));
            // }
            // else {
            loader.dismiss().then(() => resolve(data));
            //   }



          }, (error) => {
            // Dismiss the loader and return error back.
            //console.log("Error Made" + JSON.stringify(error.json()));
            let err = error.json();
            if (err.hasOwnProperty('Message')) {
              console.log(err.Message)
              this.showErrorToast(err.Message)
            }
            loader.dismiss().then(() => reject(error));

          });
      } else if (connectionStatus == "offline") {
        this.showErrorMessage('No Internet Connection');
        reject('');
      }
    });

  }


  // public getHttpRequestAMAX(service_name: string, requestMethod: RequestMethod, body?: any) {




  //   let connectionStatus = navigator.onLine ? 'online' : 'offline';
  //   return new Promise((resolve, reject) => {
  //     if (connectionStatus == 'online') {
  //       let requestOptionArgs: RequestOptionsArgs;
  //       console.log(body);
  //       requestOptionArgs = {
  //         url: Constants.AMAX_Service_URL + service_name,
  //       //  url: "http://localhost:8100/AMAXScreningAPI/api/Screning/" + service_name,
  //         method: requestMethod,
  //         body: body,
  //         headers: new Headers({
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Methods": 'GET,POST,PUT,DELETE,OPTIONS',
  //           "Access-Control-Allow-Origin": "*",
  //           "Access-Control-Allow-Credentials": 'true',
  //           "Access-Control-Allow-Headers": "*"
  //           //add any extra custom headers you need
  //         })
  //       }
  //       let loader = this.showLoader();

  //       this.http.request(service_name, requestOptionArgs)
  //         .map(res => res.json())
  //         .subscribe(data => {
  //           console.log("Data ", data)

  //           loader.dismiss().then(() => resolve(data));

  //         }, (error) => {
  //           let err = error.json();
  //           if (err.hasOwnProperty('Message')) {
  //             console.log(err.Message)
  //             this.showErrorToast(err.Message)
  //           }
  //           loader.dismiss().then(() => reject(error));

  //         });
  //     } else if (connectionStatus == "offline") {
  //       this.showErrorMessage('No Internet Connection');
  //       reject('');
  //     }
  //   });
  // }

  public getHttpRequestAMAXPOST(service_name: string, requestMethod: RequestMethod, body?: any) {

    // console.log(service_name);
    // console.log(body);

    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    return new Promise((resolve, reject) => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      // let headers = {
      //   'Content-Type': 'application/json'
      // };

      if (connectionStatus == 'online') {

        console.log("service_name");
        console.log(service_name);
        console.log("body");
        console.log(body);


        // var headers = new Headers();
        // headers.append("Accept", 'application/json');
        // headers.append('Content-Type', 'application/json');
        // headers.append("Access-Control-Allow-Methods", 'GET,POST,PUT,DELETE,OPTIONS');
        // headers.append("Access-Control-Allow-Origin", "http://localhost:8100");
        // headers.append("Access-Control-Allow-Credentials", "true");
        // headers.append("Access-Control-Allow-Headers", "Content-Type, Origin, Cache-Control, X-Requested-With");

        // const requestOptions = new RequestOptions({ headers: headers,method: requestMethod });
        // const requestOptions = new RequestOptions({ method: 'POST' });
        //   //show the loader before starting the request
        // let loader = this.showLoader();
        // let postData =  body;
        // let urltoCall = Constants.AMAX_Service_URL + service_name;
        // // this.http.post(urltoCall, postData)
        // this.http.post(urltoCall,postData)
        //   .subscribe(data => {
        //     console.log(data['_body']);
        //     loader.dismiss().then(() => resolve(data));
        //   }, (error) => {
        //     let err = error.json();
        //     if (err.hasOwnProperty('Message')) {
        //       console.log(err.Message)
        //       this.showErrorToast(err.Message)
        //     }
        //     loader.dismiss().then(() => reject(error));

        //   });
        // let headers = new HttpHeaders({
        //   'Content-Type': 'application/json',
        //   "Access-Control-Allow-Origin": "*"
        // });

        // // let options = {
        // //   body: JSON.stringify(body),
        // //    headers: headers
        // // }

        // let options = {
        //   body: body,
        //   headers: headers
        // }

        // let urltoCall = Constants.AMAX_Service_URL + service_name;
        // this.http.post(urltoCall, options)
        //   .subscribe(data => {
        //     console.log(data);
        //   });

        let requestOptionArgs: RequestOptionsArgs;
        requestOptionArgs = {
          url: Constants.AMAX_Service_URL + service_name,
          //  body: JSON.stringify(body),
          body: body,
          method: requestMethod,
          //  contentType: "application/json; charset=utf-8",
          //dataType: 'json',
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        }

        console.log(requestOptionArgs);
        //show the loader before starting the request
        let loader = this.showLoader();

        this.http.request(service_name, requestOptionArgs)
          .map(res => res.json())
          .subscribe(data => {
            console.log(data);

            loader.dismiss().then(() => resolve(data));
          }, (error) => {
            let err = error.json();
            if (err.hasOwnProperty('Message')) {
              console.log(err.Message)
              this.showErrorToast(err.Message)
            }
            loader.dismiss().then(() => reject(error));

          });
      } else if (connectionStatus == "offline") {
        this.showErrorMessage('No Internet Connection');
        reject('');
      }
    });

  }

  public nativePost(service_name: string, body: any) {

    let connectionStatus = navigator.onLine ? 'online' : 'offline';

    return new Promise((resolve, reject) => {

      let loader = this.showLoader();
      if (connectionStatus == 'online') {

        //  this.spinnerDialog.show(null, null, true);

        let url = Constants.AMAX_Service_URL + service_name
        let headers = {
          "Content-Type": "application/json",
        }
        console.log(" ************ posting data ************");


        console.log(url);
        console.log(body);
        console.log(headers);

        this.nativeHttp.post(url, body, headers).then(res => {

          console.log(res);

          let resolvedDataToJson;

          resolvedDataToJson = res;

          loader.dismiss().then(() => resolve(resolvedDataToJson));

        }, (error) => {

          let err = JSON.parse(error.error);

          if (err.hasOwnProperty('error') || error.hasOwnProperty('statusText')) {

            this.showErrorToast(error.status + ' ' + err.error)

          }

          loader.dismiss();

          reject(error);

        }).catch(error => {

          loader.dismiss();

          reject(error);

        });

        error => console.error(error);

      } else if (connectionStatus == "offline") {

        loader.dismiss()

        this.showErrorMessage('No Internet Connection');

        reject('');

      }

    });

  }



  public getRequest(url: string, requestMethod: RequestMethod) {
    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    return new Promise((resolve, reject) => {
      if (connectionStatus == 'online') {
        // We're using Angular Http provider to request the data,
        // then on the response it'll map the JSON data to a parsed JS object.
        // Next we process the data and resolve the promise with the new data.
        let requestOptionArgs: RequestOptionsArgs;
        requestOptionArgs = {
          url: url,
          method: requestMethod,
          headers: new Headers({
            "Authorization": "Basic " + Constants.REST_API_KEY,
            "Content-Type": "application/json"
          })
        }

        //show the loader before starting the request
        let loader = this.showLoader();

        this.http.request(url, requestOptionArgs)
          .map(res => res.json())
          .subscribe(data => {

            loader.dismiss().then(() => resolve(data));

          }, (error) => {
            // Dismiss the loader and return error back.
            //console.log("Error Made" + JSON.stringify(error.json()))

            loader.dismiss().then(() => reject(error));

          });
      } else if (connectionStatus == "offline") {
        this.showErrorMessage('No Internet Connection');
        reject('');
      }
    });

  }

  public getHttpRequest1(url: string, service_name: string, requestMethod: RequestMethod, body?: any, isCsc?: boolean) {
    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    return new Promise((resolve, reject) => {
      if (connectionStatus == 'online') {
        // We're using Angular Http provider to request the data,
        // then on the response it'll map the JSON data to a parsed JS object.
        // Next we process the data and resolve the promise with the new data.
        let requestOptionArgs: RequestOptionsArgs;
        requestOptionArgs = {
          url: isCsc ? Constants.CSC_Service_URL + service_name : Constants.GMAX_Service_URL + service_name,
          method: requestMethod,
          body: body,
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
            //add any extra custom headers you need
          })
        }

        //show the loader before starting the request
        let loader = this.showLoader();

        this.http.request(service_name, requestOptionArgs)
          .map(res => res.json())
          .subscribe(data => {
            //console.log("Data ", data)
            let resolvedDataToJson;
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference

            // Dismiss the loader and return response back.

            xml2js.parseString(data.d, function (err, result) {
              console.dir(result); // Prints JSON object!
              resolvedDataToJson = result;
            });

            loader.dismiss().then(() => resolve(resolvedDataToJson));

          }, (error) => {
            // Dismiss the loader and return error back.
            //console.log("Error Made" + JSON.stringify(error.json()));
            let err = error.json();
            if (err.hasOwnProperty('Message')) {
              this.showErrorToast(err.Message)
            }
            loader.dismiss().then(() => reject(error));

          });
      } else if (connectionStatus == "offline") {
        this.showErrorMessage('No Internet Connection');
        reject('');
      }
    });
  }

  public getHttpRequest2(url: string, service_name: string, requestMethod: RequestMethod, body?: any, isCsc?: boolean) {
    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    return new Promise((resolve, reject) => {
      if (connectionStatus == 'online') {
        // We're using Angular Http provider to request the data,
        // then on the response it'll map the JSON data to a parsed JS object.
        // Next we process the data and resolve the promise with the new data.
        let requestOptionArgs: RequestOptionsArgs;
        requestOptionArgs = {
          url: Constants.GMAX_CSC_perishabe_URL_Routing + service_name,
          method: requestMethod,
          body: body,
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
            //add any extra custom headers you need
          })
        }

        //show the loader before starting the request
        let loader = this.showLoader();

        this.http.request(service_name, requestOptionArgs)
          .map(res => res.json())
          .subscribe(data => {
            //console.log("Data ", data)
            let resolvedDataToJson;
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference

            // Dismiss the loader and return response back.

            xml2js.parseString(data.d, function (err, result) {
              console.dir(result); // Prints JSON object!
              resolvedDataToJson = result;
            });

            loader.dismiss().then(() => resolve(resolvedDataToJson));

          }, (error) => {
            // Dismiss the loader and return error back.
            //console.log("Error Made" + JSON.stringify(error.json()));
            let err = error.json();
            if (err.hasOwnProperty('Message')) {
              this.showErrorToast(err.Message)
            }
            loader.dismiss().then(() => reject(error));

          });
      } else if (connectionStatus == "offline") {
        this.showErrorMessage('No Internet Connection');
        reject('');
      }
    });
  }



  public postSMS(url: string) {

    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    return new Promise((resolve, reject) => {
      if (connectionStatus == 'online') {
        // We're using Angular Http provider to request the data,
        // then on the response it'll map the JSON data to a parsed JS object.
        // Next we process the data and resolve the promise with the new data.
        let requestOptionArgs: RequestOptionsArgs;
        requestOptionArgs = {
          url: url,
          headers: new Headers({
            "Authorization": "Basic " + Constants.REST_API_KEY,
            "Content-Type": "application/json"
          })
        }

        //show the loader before starting the request
        let loader = this.showLoader();

        this.http.request(url)
          .map(res => res.json())
          .subscribe(data => {

            loader.dismiss().then(() => resolve(data));

          }, (error) => {
            // Dismiss the loader and return error back.
            //console.log("Error Made" + JSON.stringify(error.json()))

            loader.dismiss().then(() => reject(error));

          });
      } else if (connectionStatus == "offline") {
        this.showErrorMessage('No Internet Connection');
        reject('');
      }
    });

  }

  public getHttpGetRequest(url: string) {
    console.log(url);
    return this.getRequest(url, RequestMethod.Get);
  }

  public getHttpPutRequest(url: string, body?: any) {
    console.log(url);
    return this.getHttpRequest(url, RequestMethod.Put, body);
  }

  public getHttpPostRequest(url: string, body?: any, isCsc?: boolean) {
    console.log(url);
    return this.getHttpRequest(url, RequestMethod.Post, body, isCsc);
  }

  public httpGETRequestAMAX(url: string, body?: any) {
    console.log(url);
    return this.getHttpRequestAMAX(url, RequestMethod.Get, body);
  }

  public httpPostRequestAMAX(url: string, body?: any) {
    // console.log(url);
    // console.log(body);
    return this.getHttpRequestAMAXPOST(url, RequestMethod.Post, body);
  }


  // if (this.globalService.isNative()) {
  //   console.log("isNative");
  //   return this.nativePost(url, body);

  // } else {

  //   return this.getHttpRequest(url, RequestMethod.Post, body);

  // }





  public getHttpPostRequest1(url: string, service_name: string, body?: any, csc?: boolean) {
    console.log(url);
    return this.getHttpRequest1(url, service_name, RequestMethod.Post, body, csc);
  }
  public getHttpPostRequest2(url: string, service_name: string, body?: any, csc?: boolean) {
    console.log(url);
    return this.getHttpRequest2(url, service_name, RequestMethod.Post, body, csc);
  }

  public post(url: string) {
    return this.postSMS(url);
  }
  private showLoader() {
    let loader = this.loadingCtrl.create({
      showBackdrop: true, spinner: "ios",
      // dismissOnPageChange: true,
      content: "Loading..."
    });

    loader.present();

    return loader;
  }

  showErrorMessage(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }




}
