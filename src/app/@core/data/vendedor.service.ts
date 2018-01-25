import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

//Libs terceros
import * as _ from 'lodash';
import PouchDB from 'pouchdb';
//Services
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class VendedorService {

  private _remoteBD: PouchDB.Database; // Nombre de la bd a la que voy a consultar
  private _urlUsersCouchDB: string = "https://vm257.tmdcloud.com:6984"; // Url de la BD en couchDB con los usuarios de la app
  // Credenciales
  private _userDB: string = "admin";
  private _passDB: string = "Webmaster2017#@";


  constructor(
    protected utils: UtilsService,
    private http: HttpClient
  ) {}

  public async  getAllVendedores(): Promise<string[]> {
    let url: string = `${this._urlUsersCouchDB}/_all_dbs`;
    let options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + btoa(`${this._userDB}:${this._passDB}`)
      })
    };

    let all_dbs: string[] = await this.http.get( url, options ).pipe(
      map( (res: string[]) => res)
    ).toPromise();

    let users: string[] = _.chain(all_dbs)
      .map((db,k,l): string => {
        let dbSplit: string[] = db.split("$");
        if( dbSplit[0] == "supertest" ){
            return dbSplit[1];
        }
      })
      .compact()
      .value();

    return users;
  }

  public async getOrdenesVendedor(): Promise<any> {
    let docs = await this._remoteBD.allDocs({
      include_docs: true
    })
    return docs;
  }

  public async getOrdenesVendedores(): Promise<any> {
    let usuarios: string[] = await this.getAllVendedores();
    for (let usuario of usuarios) {
      this.bdName = usuario;
      console.log("YIJAAAAAAA !!! HPTA", await this.getOrdenesVendedor());
    }
  }

  public set bdName(v : string) {
    this._remoteBD = new PouchDB(`${this._urlUsersCouchDB}/supertest%24${v}`, {
      auth: {
        username: this._userDB,
        password: this._passDB
      }
    });
  }

}
