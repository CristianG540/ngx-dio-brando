import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// Services
import { VendedorService } from '../../../@core/data/vendedor/vendedor.service';
// Models
import { BasicInfoOrden } from '../../../@core/data/vendedor/models/basicInfoOrden';

@Component({
  selector: 'ngx-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.scss'],
})
export class VendedorComponent implements OnInit, OnDestroy {

  private _vendedor: string = '';
  private _paramsSub: Subscription;

  /**
   * objeto de configuracion para ng2-smart-table
   */
  private settings = {
    noDataMessage: 'No hay datos en este momento',
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
      id: {
        title: 'Id Orden',
        sortDirection: 'desc',
      },
      cliente: {
        title: 'Cliente NIT',
      },
      created_at: {
        title: 'Fecha',
      },
      total: {
        title: 'Total',
      },
      cantItems: {
        title: 'Items',
      },
      estado: {
        title: 'Estado',
        type: 'html',
      },
    },
  };
  private source: LocalDataSource = new LocalDataSource();

  constructor(
    private vendedoresService: VendedorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this._paramsSub = this.activatedRoute.params.subscribe(params => {
      this.vendedoresService.bdName = this._vendedor = params['vendedor'];
      this.vendedoresService.formatOrdenesVendedor().then( res => {
        console.log('ordenes vendedor', res);
        this.source.load(res);
      }).catch(err => {
        console.error('Me cago en la puta errror', err);
      });
    });
  }

  ngOnDestroy() {
    this._paramsSub.unsubscribe();
  }

  private onUserRowSelect(evt): void {
    console.log('El buen evento', evt);
    this.router.navigate(['pages/ordenes', this._vendedor, evt.data.id]);
  }

}
