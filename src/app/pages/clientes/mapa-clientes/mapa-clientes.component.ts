import { Component, OnInit } from '@angular/core';

// Services
import { UtilsService } from '../../../@core/utils/utils.service';

@Component({
  selector: 'ngx-mapa-clientes',
  styleUrls: ['./mapa-clientes.component.scss'],
  templateUrl: 'mapa-clientes.component.html',
})
export class MapaClientesComponent implements OnInit {

  constructor(
    private utils: UtilsService,
  ) {
  }

  ngOnInit() {

  }

}
