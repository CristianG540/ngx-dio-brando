import { Injectable } from '@angular/core';

// Services
import { UtilsService } from '../../utils/utils.service';
import { EnviromentService } from '../enviroment.service';
// Herencia
import { DbActions } from '../dbBase/dbBase';

@Injectable()
export class ClienteService extends DbActions {

  constructor(
    protected utils: UtilsService,
    protected _env: EnviromentService,
  ) {
    super('clientes', utils, _env.cliente);
  }

}

