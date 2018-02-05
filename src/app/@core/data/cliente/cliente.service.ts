import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';
// Services
import { UtilsService } from '../../utils/utils.service';
import { EnviromentService } from '../enviroment.service';
// Herencia
import { DbActions } from '../dbBase/dbBase';
// Models
import { Cliente } from './models/cliente';
// Libs terceros
import * as _ from 'lodash';

@Injectable()
export class ClienteService extends DbActions {

  constructor(
    protected utils: UtilsService,
    protected _env: EnviromentService,
    private http: HttpClient,
  ) {
    super('clientes', utils, _env.cliente);
  }

  /**
   * Esta funcion se encarga de buscar los clientes del asesor
   * actualmente logueado en la app, los busca por el nombre del cliente
   * con el motor de busqueda lucene de cloudant, este metodo tambien hace
   * uso del api async/await de ecmascript 7 si no estoy mal
   *
   * @param {string} query
   * @returns {Promise<any>}
   * @memberof ClientesProvider
   */
  public async searchCliente(query: string): Promise<Cliente[]> {

    const url: string = `${this._env.cliente.urlDB}/_design/app/_search/client_search`;
    const params = new HttpParams()
      .set('q', `nombre_cliente:"${query}"~`)
      .set('limit', '50')
      .set('include_docs', 'true');
    const options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + btoa(`${this._env.cliente.userDB}:${this._env.cliente.passDB}`),
      }),
      params: params,
    };


    /**
     * aqui haciendo uso del async/await hago un try/catch que primero
     * intenta traer los datos mediante http de cloudant, si por algun motivo
     * la petcion falla entonces el catch se encarga de buscar los clientes
     * en la bd local
     */
    try {

      const res = await this.http.get( url, options ).pipe(
        map( (data: { bookmark: string; rows: any[]; total_rows: number; }) => {
          return _.map( data.rows, (row: any): Cliente => row.doc );
        }),
        timeout(5000),
      ).toPromise();
      return res;

    } catch (error) {

      const res = await this._localDB.search({
        query: query,
        fields: ['nombre_cliente'],
        limit: 50,
        include_docs: true,
        highlighting: true,
        // stale: 'update_after'
      });
      return _.map( res.rows, (row: any): Cliente => row.doc );

    }

  }

  public async getCoordenadas(): Promise<Cliente[]> {

    await this._remoteDB.createIndex({
      index: {
        fields: ['ubicacion'],
        name: 'clientes_ubicacion_name',
        ddoc: 'clientes_ubicacion_ddoc',
        type: 'json',
      },
    });

    const res = await this._remoteDB.find({
      selector: {
        ubicacion: {
          $gte: null,
        },
      },
      use_index: 'clientes_ubicacion_ddoc',
    });
    return res.docs as Cliente[];
  }

}

