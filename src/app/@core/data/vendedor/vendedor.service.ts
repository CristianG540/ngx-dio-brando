import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

// Libs terceros
import * as _ from 'lodash';
import PouchDB from 'pouchdb';
// Services
import { UtilsService } from '../../utils/utils.service';
// Models
import { AllOrdenesInfo } from './models/allOrdenesInfo';

@Injectable()
export class VendedorService {

  private _remoteBD: PouchDB.Database; // Nombre de la bd a la que voy a consultar
  // Url de la BD en couchDB con los usuarios de la app
  private _urlUsersCouchDB: string = 'https://vm257.tmdcloud.com:6984';
  // Credenciales
  private _userDB: string = 'admin';
  private _passDB: string = 'Webmaster2017#@';


  constructor(
    protected utils: UtilsService,
    private http: HttpClient,
  ) {}

  public async  getAllVendedores(): Promise<string[]> {
    const url: string = `${this._urlUsersCouchDB}/_all_dbs`;
    const options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + btoa(`${this._userDB}:${this._passDB}`),
      }),
    };

    const all_dbs: string[] = await this.http.get( url, options ).pipe(
      map( (res: string[]) => res),
    ).toPromise();

    const users: string[] = _.chain(all_dbs)
      .map((db, k, l): string => {
        const dbSplit: string[] = db.split('$');
        if ( dbSplit[0] === 'supertest' ) {
            return dbSplit[1];
        }
      })
      .compact()
      .value();

    return users;
  }

  public async getOrdenesVendedor(): Promise<any> {
    const docs = await this._remoteBD.allDocs({
      include_docs: true,
    });
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
    const vendedores: string[] = await this.getAllVendedores();
    const allVendedoresOrdersInfo: AllOrdenesInfo[] = [];
    // recorro el array con el nombre de usuario de los vendedores (que seria basicamente el nombre de la Bd tambien)
    for (const vendedor of vendedores) {
      this.bdName = vendedor; // Le digo a pouchDB que se conecte a la BD remota del usuario al que quiero consultar
      const ordenesUsuario = await this.getOrdenesVendedor(); // traigo todas las ordenes del vendedor
      const ordenesErr = []; // aqui guardo las ordenes que tienen errores de cada vendedor
      const ordenesPend = []; // aqui guardo las ordenes pendientes, osea las ordenes que aun no se han enviado a sap
      const ordenesVistas = []; // guardo las ordenes marcadas como vistas en la pag de administrador dio-brando
      for (const row of ordenesUsuario.rows) {
        /**
         * si un pedido no tiene docEntry esta variable pasa a ser "true",
         * el hecho de q un pedido no tenga docEntry casi siempre significa
         * que esta pendiente, no ha subido a sap
        */
        const hasDocEntry: boolean = !_.has(row.doc, 'docEntry') || row.doc.docEntry === '';
        // si el pedido tiene un error esta variable pasa a true
        const hasError: boolean = _.has(row.doc, 'error') && row.doc.error;
        // Verifico si la orden de la posicion actual tiene un error y la meto en el array respectivo
        if ( hasError || hasDocEntry ) {
          ordenesErr.push(row.doc);
        }
        // Verifico si la orden esta pendiente y no tiene errores
        if (hasDocEntry) {
          if ( !hasError ) {
            ordenesPend.push(row.doc);
          }
        }
        // verifico si la orden esta marcada como vista
        if ( String(row.doc.estado) === 'seen' ) { ordenesVistas.push(row.doc); }

      }
      allVendedoresOrdersInfo.push({
        'vendedor'         : vendedor,
        'numOrdenes'       : ordenesUsuario.rows.length,
        'numOrdenesErr'    : ordenesErr.length - ordenesVistas.length,
        'numOrdenesPend'   : ordenesPend.length,
        'numOrdenesVistas' : ordenesVistas.length,
      });

    }
    return allVendedoresOrdersInfo;
  }



  public set bdName(v: string) {
    this._remoteBD = new PouchDB(`${this._urlUsersCouchDB}/supertest%24${v}`, {
      auth: {
        username: this._userDB,
        password: this._passDB,
      },
    });
  }

}
