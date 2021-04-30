import { Injectable } from '@angular/core';
// import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import 'rxjs/add/operator/finally';
import { Http, RequestMethod, RequestOptionsArgs, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from "../../constant";
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import * as xml2js from 'xml2js';
/**
 * @name HttpProvider
 * @author Sachin Semlety
 * @description
 * This Class is used to set the Http Operations like GET,POST,PUT etc for the app.
**/
@Injectable()
export class HttpProvider {
  constructor(protected http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController) {
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
            "access-control-allow-methods":
            'GET, POST', "access-control-allow-origin": "*",
            "Access-Control-Allow-Credentials": 'true'
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
    return this.getRequest(url, RequestMethod.Get);
  }

  public getHttpPutRequest(url: string, body?: any) {
    return this.getHttpRequest(url, RequestMethod.Put, body);
  }

  public getHttpPostRequest(url: string, body?: any, isCsc?: boolean) {

    return this.getHttpRequest(url, RequestMethod.Post, body, isCsc);
  }

  public getHttpPostRequest1(url: string, service_name: string, body?: any, csc?: boolean) {
    return this.getHttpRequest1(url, service_name, RequestMethod.Post, body, csc);
  }
  public getHttpPostRequest2(url: string, service_name: string, body?: any, csc?: boolean) {
    return this.getHttpRequest2(url, service_name, RequestMethod.Post, body, csc);
  }

  public post(url: string) {
    return this.postSMS(url);
  }
  private showLoader() {
    let loader = this.loadingCtrl.create({
      showBackdrop: true, spinner: "ios", dismissOnPageChange: true,
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
