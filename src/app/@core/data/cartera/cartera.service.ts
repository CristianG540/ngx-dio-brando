import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, timeout } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
// Services
import { UtilsService } from '../../utils/utils.service';
import { EnviromentService } from '../enviroment.service';
// Herencia
import { DbActions } from '../dbBase/dbBase';

@Injectable()
export class CarteraService extends DbActions {

  constructor(
    protected utils: UtilsService,
    protected _env: EnviromentService,
    private http: HttpClient,
  ) {
    super('cartera', utils, _env.cartera);
  }

  /**
   * Esta funcion se encarga de buscar la cartera del cliente, segun el asesor
   * actualmente logueado en la app, los busca por el NIT del cliente
   * con el motor de busqueda lucene de cloudant, este metodo tambien hace
   * uso del api async/await de ecmascript 7 si no estoy mal
   *
   * @param {string} nitCliente
   * @returns {Promise<any>}
   * @memberof CarteraProvider
   */
  public async searchCartera(nitCliente: string): Promise<any> {
    /**
     * Bueno aqui hago todo lo contrario a lo que hago con los productos
     * en vez de hacer un offline first (que deberia ser lo correcto)
     * hago un online first por asi decirlo, lo que hago es buscar primero
     * en cloudant/couchdb por los clientes, si por algun motivo no los puedo
     * traer digace fallo de conexion o lo que sea, entonces busco los clientes
     * en la base de datos local
     */
    const url: string = this._env.cartera.urlSearch;
    const params = new HttpParams()
      .set('q', `cod_cliente:"${nitCliente}"~`)
      .set('include_docs', 'true');
    const options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + btoa(`${this._env.cartera.userDB}:${this._env.cartera.passDB}`),
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
        map( (data: Response) => {
          return data;
        }),
        timeout(5000),
      ).toPromise();

      return res;

    } catch (error) {
      console.error('Error buscando clientes online: ', error);
      /**
       * Para mas informacion sobre este plugin la pagina principal:
       * https://github.com/pouchdb-community/pouchdb-quick-search
       */
      const res = await this._localDB.search({
        query: nitCliente,
        fields: ['cod_cliente'],
        include_docs: true,
        // stale: 'update_after'
      });

      return res;
    }

  }

}

