import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

import { DbActions } from "./dbBase/dbBase";

//Libs terceros
import * as _ from 'lodash';
import * as PouchDB from 'pouchdb';
//Services
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class VendedorService extends DbActions {

  private _urlCouchDB: string = "https://vm257.tmdcloud.com:6984";
  private _userDB: string = "admin";
  private _passDB: string = "Webmaster2017#@";

  constructor(
    protected utils: UtilsService,
    private http: HttpClient
  ) {
    super('vendedor', utils);

    if(!this._isInit){
      //this._localDB = new PouchDB('')
    }
  }

  public async  getAllVendedores(): Promise<any> {
    let url: string = `${this._urlCouchDB}/_all_dbs`;
    let options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + btoa(`${this._userDB}:${this._passDB}`)
      })
    };

    let res = await this.http.get( url, options ).pipe(
      map((res: Response) => res)
    ).toPromise();
    debugger;
    return res;

  }

}
