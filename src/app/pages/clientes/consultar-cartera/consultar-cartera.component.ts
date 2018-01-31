import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSearchService } from '@nebular/theme';
import { Subscription } from 'rxjs/Subscription';

// Services
import { ClienteService } from '../../../@core/data/cliente/cliente.service';

@Component({
    selector: 'ngx-consultar-cartera',
    templateUrl: 'consultar-cartera.component.html',
})
export class ConsultarCarteraComponent implements OnInit, OnDestroy {

  private onSearchSubmitSub: Subscription;

  constructor(
    private searchService: NbSearchService,
    private clienteServ: ClienteService,
  ) {
  }

  ngOnInit() {
    this.onSearchSubmitSub = this.searchService.onSearchSubmit()
      .subscribe( (data: { term: string, tag: string }) => {
        console.log('a BER !!!!!', data);
      });
  }

  ngOnDestroy() {
    this.onSearchSubmitSub.unsubscribe();
  }

}
