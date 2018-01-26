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
import { UtilsService } from '../../utils/utils.service';
//Models
import { AllOrdenesInfo } from "./models/allOrdenesInfo";

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

  /**
   * Esta funcion me devuleve un array de objetos, donde cada posicion corresponde
   * a un vendedor y la cantidad de ordenes que ha hecho, la cantidad de ordenes con errores
   * y la cantidad de ordenes pendientes y revisadas
   *
   * @returns {Promise<any>}
   * @memberof VendedorService
   */
  public async getOrdenesVendedores(): Promise<AllOrdenesInfo[]> {
    // recupera un array con todos los nombres de usuarios de los vendedores
    let vendedores: string[] = await this.getAllVendedores();
    let allVendedoresOrdersInfo: AllOrdenesInfo[] = [];
    //recorro el array con el nombre de usuario de los vendedores (que seria basicamente el nombre de la Bd tambien)
    for (let vendedor of vendedores) {
      this.bdName = vendedor; //Le digo a pouchDB que se conecte a la BD remota del usuario al que quiero consultar
      let ordenesUsuario = await this.getOrdenesVendedor(); // traigo todas las ordenes del vendedor
      let ordenesErr = []; // aqui guardo las ordenes que tienen errores de cada vendedor
      let ordenesPend = []; // aqui guardo las ordenes pendientes, osea las ordenes que aun no se han enviado a sap
      let ordenesVistas = []; // guardo las ordenes marcadas como vistas en la pag de administrador dio-brando
      for (let row of ordenesUsuario.rows) {
        /**
         * si un pedido no tiene docEntry esta variable pasa a ser "true",
         * el hecho de q un pedido no tenga docEntry casi siempre significa
         * que esta pendiente, no ha subido a sap
        */
        let hasDocEntry: boolean = !_.has(row.doc, 'docEntry') || row.doc.docEntry == "";
        let hasError: boolean = _.has(row.doc, 'error') && row.doc.error; // si el pedido tiene un error esta variable pasa a true
        // Verifico si la orden de la posicion actual tiene un error y la meto en el array respectivo
        if( hasError || hasDocEntry ) {
          ordenesErr.push(row.doc);
        }
        // Verifico si la orden esta pendiente y no tiene errores
        if(hasDocEntry){
          if( !hasError ){
            ordenesPend.push(row.doc);
          }
        }
        // verifico si la orden esta marcada como vista
        if( String(row.doc.estado) == "seen" ) { ordenesVistas.push(row.doc) }

      }
      allVendedoresOrdersInfo.push({
        'vendedor'         : vendedor,
        'numOrdenes'       : ordenesUsuario.rows.length,
        'numOrdenesErr'    : ordenesErr.length - ordenesVistas.length,
        'numOrdenesPend'   : ordenesPend.length,
        'numOrdenesVistas' : ordenesVistas.length
      });

    }
    return allVendedoresOrdersInfo;
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
