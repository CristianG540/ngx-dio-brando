import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// Services
import { VendedorService } from '../../@core/data/vendedor/vendedor.service';
// Models
import { Orden } from '../../@core/data/orden/models/orden';

@Component({
  selector: 'ngx-orden',
  templateUrl: './orden.component.html',
})
export class OrdenComponent implements OnInit, OnDestroy, AfterViewChecked {

  private _idOrden: number;
  private _orden: Orden;
  private _error: any;
  private _vendedor: string = '';
  private _paramsSub: Subscription;
  // Variable global de prettyprint
  private readonly PR = window['PR'];

  constructor (
    private vendedoresService: VendedorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this._paramsSub = this.activatedRoute.params.subscribe(params => {
      console.log('EL hpta id', params);
      this._idOrden = params['id'];
      this.vendedoresService.bdName = this._vendedor = params['vendedor'];
      this.vendedoresService.getOrdenesVendedor([params['id']]).then((res) => {
        console.log('Datos orden', res.rows[0].doc);
        this._orden = res.rows[0].doc;
        this._error = (this._orden.error) ? JSON.parse(this._orden.error) : '';
      }).catch(err => {
        console.error('puto error al mostrar la orden', err);
      });
    });
  }

  ngAfterViewChecked() {
    // Despues de que la vista se renderiza ejecuto la funcion de prettyprint
    // que le aplica estilos al error
    this.PR.prettyPrint();
  }

  ngOnDestroy() {
    this._paramsSub.unsubscribe();
  }

  private marcarRevisado(): void {
    if (confirm('¿ Esta seguro de que desea marcar como revisada esta orden ?')) {

      this.vendedoresService.cambiarEstado(this._idOrden.toString(10), 'seen').then(res => {
        console.log('Respuesta cambiar estado orden', res);
        alert('correcto');
        this.location.back();
      }).catch(err => {
        console.error('Error upsert orden', err);
        alert('Hubo un problema al marcar como revisada la orden');
      });
    } else {
      alert('se arrepintio papu');
    }
  }

  private eliminar(): void {
    if (confirm('¿ Esta seguro de que desea eliminar esta orden ?')) {
      this.vendedoresService.eliminarOrden(this._idOrden.toString(10)).then(res => {
        console.log('Respuesta eliminar orden', res);
        alert('correcto');
        this.location.back();
      }).catch(err => {
        console.error('Error upsert eliminar orden', err);
        alert('Hubo un problema al eliminar la orden');
      });
    } else {
      alert('se arrepintio papu');
    }
  }

}
