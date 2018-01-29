import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// Services
import { VendedorService } from '../../@core/data/vendedor/vendedor.service';

@Component({
  selector: 'ngx-orden',
  templateUrl: './orden.component.html',
})
export class OrdenComponent implements OnInit, OnDestroy {

  private _idOrden: number;
  private _vendedor: string = '';
  private _paramsSub: Subscription;

  constructor (
    private vendedoresService: VendedorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this._paramsSub = this.activatedRoute.params.subscribe(params => {
      console.log('EL hpta id', params);
      this._idOrden = params['id'];
      // this.vendedoresService.bdName = this._vendedor = params['vendedor'];
    });
  }

  ngOnDestroy() {
    this._paramsSub.unsubscribe();
  }

}
