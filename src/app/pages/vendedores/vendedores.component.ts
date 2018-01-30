import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

// Services
import { VendedorService } from '../../@core/data/vendedor/vendedor.service';

@Component({
  selector: 'ngx-vendedores',
  templateUrl: './vendedores.component.html',
})
export class VendedoresComponent  {

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
      vendedor: {
        title: 'Asesor',
        type: 'string',
      },
      numOrdenes: {
        title: 'Ordenes',
        type: 'number',
      },
      numOrdenesErr: {
        title: 'Errores',
        type: 'html',
      },
      numOrdenesPend: {
        title: 'Pendientes',
        type: 'number',
      },
      numOrdenesVistas: {
        title: 'Revisados',
        type: 'html',
      },
    },
  };
  private source: LocalDataSource = new LocalDataSource();

  constructor (
    private vendedoresService: VendedorService,
    private router: Router,
  ) {
    this.vendedoresService.getOrdenesVendedores().then( res => {
      console.log('PERRRRROOOOO', res);
      this.source.load(res);
    }).catch( err => {
      console.error('La puta madre no funciona', err);
    });
  }

  private onUserRowSelect(evt): void {
    console.log('El buen evento', evt);
    this.router.navigate(['pages/ordenes', evt.data.vendedor]);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
