import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// Services
import { VendedorService } from '../../../@core/data/vendedor/vendedor.service';

@Component({
  selector: 'ngx-vendedor',
  templateUrl: './vendedor.component.html',
})
export class VendedorComponent implements OnInit, OnDestroy {

  private _vendedor: string = '';
  private _paramsSub: Subscription;

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
        type: 'number',
      },
      numOrdenesPend: {
        title: 'Pendientes',
        type: 'number',
      },
      numOrdenesVistas: {
        title: 'Vistas',
        type: 'number',
      },
    },
  };
  private source: LocalDataSource = new LocalDataSource();

  constructor(
    private vendedoresService: VendedorService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this._paramsSub = this.route.params.subscribe(params => {
      this.vendedoresService.bdName = this._vendedor = params['vendedor'];
      this.vendedoresService.getOrdenesVendedor().then(res => {
        console.log('ordenes vendedores', res);
      }).catch(err => {
        console.error('Me cago en la puta errror', err);
      });
    });
  }

  ngOnDestroy() {
    this._paramsSub.unsubscribe();
  }

}
