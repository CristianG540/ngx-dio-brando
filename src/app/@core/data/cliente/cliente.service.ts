import { Injectable } from '@angular/core';

// Services
import { UtilsService } from '../../utils/utils.service';
// Herencia
import { DbActions } from '../dbBase/dbBase';

@Injectable()
export class ClienteService extends DbActions {

}

