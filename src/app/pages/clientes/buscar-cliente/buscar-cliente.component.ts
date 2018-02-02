import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSearchService } from '@nebular/theme';
import { Subscription } from 'rxjs/Subscription';
import { LocalDataSource } from 'ng2-smart-table';

// Services
import { ClienteService } from '../../../@core/data/cliente/cliente.service';
// Models
import { Cliente } from '../../../@core/data/cliente/models/cliente';

@Component({
    selector: 'ngx-buscar-cliente',
    templateUrl: 'buscar-cliente.component.html',
})
export class BuscarClienteComponent implements OnInit, OnDestroy {

  private onSearchSubmitSub: Subscription;

  private source: LocalDataSource = new LocalDataSource();
  /**
   * objeto de configuracion para ng2-smart-table
   */
  private settings = {
    actions : {
      add: false,
      edit : false,
      delete : false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      _id: {
        title: 'NIT',
      },
      nombre_cliente: {
        title: 'Nombre',
      },
      telefono: {
        title: 'Telefono',
      },
      direccion: {
        title: 'Dirección',
      },
      ciudad: {
        title: 'Ciudad',
      },
      asesor_nombre: {
        title: 'Asesor',
      },
    },
  };

  constructor(
    private searchService: NbSearchService,
    private clienteServ: ClienteService,
  ) {

  }

  ngOnInit() {
    this.onSearchSubmitSub = this.searchService.onSearchSubmit()
      .subscribe( (data: { term: string, tag: string }) => {
        console.log('Search cliente', data);
        this.clienteServ.searchCliente(data.term)
          .then( (res: Cliente[]) => {
            console.log('La buena response', res);
            this.source.load(res);
          }).catch(err => {
            console.error('errror de mierda buscar clientes', err);
          });
      });
  }

  ngOnDestroy() {
    this.onSearchSubmitSub.unsubscribe();
  }

}
