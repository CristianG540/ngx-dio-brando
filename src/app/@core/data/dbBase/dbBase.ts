// Libs terceros
import * as _ from 'lodash';
import * as PouchDB from 'pouchdb';
import * as PouchUpsert from 'pouchdb-upsert';

// Services
import { UtilsService } from '../../utils/utils.service';

export class DbActions {

  protected _localDB: any;
  protected _remoteDB: any;
  protected _statusDB: boolean = false;
  protected _isInit: boolean = false; // Este atributo me sirve para verificar si ya cree la instancia de pouchDB
  protected _data = []; // atributo base donde voy a guardar los datos de cada BD

  constructor (
    protected dbName: string,
    protected utils: UtilsService,
  ) {}

  protected _initDB(): void {
    if (!this._initDB) {
      PouchDB.plugin(PouchUpsert);
      this._localDB = new PouchDB('clientes');
      this._remoteDB = new PouchDB(d.remote.name, {
        auth: {
          username: 'Config.CDB_USER',
          password: 'Config.CDB_PASS',
        },
        ajax: {
          timeout: 60000,
        },
      });
    }
  }

  protected _replicate () {
    this._localDB.replicate.from(this._remoteDB, { batch_size: 50 })
    .on('change', info => {
      /**
       * Esto lo comento por que el enviar muchos mensajes al hilo
       * principal hace q se bloquee el dom entonces hay q tratat
       * de enviar la menor cantidad posible de mensajes
      */
      // self.postMessage({ event : "change", method: "replicate", info : info })
    })
    .on('complete', info => {
      // Si la primera replicacion se completa con exito sincronizo la db
      // y de vuelvo la info sobre la sincronizacion
      this._statusDB = true;
      console.warn(`${this.dbName} - First Replication complete`, info);
      this.sync();
    })
    .on('error', err => {
      console.error(`${this.dbName} - totally unhandled error (shouldn't happen)`, err);
      // Me preguntare a mi mismo en el futuro por que mierda pongo a sincronizar
      // La base de datos si la primera sincronisacion falla, lo pongo aqui por q
      // si el usuario cierra la app y la vuelve a iniciar, el evento de initdb
      // se ejecutaria de nuevo y si por algun motivo no tiene internet entonces
      // la replicacion nunca se va completar y la base de datos
      // no se va a sincronizar, por eso lo lanzo de nuevo aqui el sync
      this.sync();
    });
  }

  protected _sync () {
    const replicationOptions = {
      live: true,
      retry: true,
    };
    PouchDB.sync(this._localDB, this._remoteDB, replicationOptions)
    .on('denied', err => {
      console.error(`${this.dbName} - No se pudo sincronizar debido a permisos 👮`, err);
    })
    .on('error', err => {
      console.error(`${this.dbName} - sync totally unhandled error (shouldn't happen) 🐛`, err);
    });
    this.reactToChanges();
  }

  protected _reactToChanges () {
    this._localDB.changes({
      live: true,
      since: 'now',
      include_docs: true,
    })
    .on('change', change => {
      if (change.deleted) {
        this._onDeleted(change.doc._id);
      } else { // updated/inserted
        this._onUpdatedOrInserted(change.doc);
      }
    })
    .on('error', err => console.error(`${this.dbName} - error al reacionar a los cambios 🐛`, err));
  }

  protected _onDeleted(id: string): void {
    const index: number = this.utils.binarySearch(
      this._data,
      '_id',
      id,
    );
    const doc = this._data[index];
    if (doc && doc._id === id) {
      this._data.splice(index, 1);
    }
  }

  protected _onUpdatedOrInserted(newDoc: any): void {
    const index: number = this.utils.binarySearch(
      this._data,
      '_id',
      newDoc._id,
    );
    const doc = this._data[index];
    if (doc && doc._id === newDoc._id) { // update
      this._data[index] = newDoc;
    } else { // insert
      this._data.splice(index, 0, newDoc);
    }
  }

}
