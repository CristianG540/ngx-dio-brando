import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesComponent } from './clientes.component';
import { BuscarClienteComponent } from './buscar-cliente/buscar-cliente.component';
import { ConsultarCarteraComponent } from './consultar-cartera/consultar-cartera.component';

const routes: Routes = [{
  path: '',
  component: ClientesComponent,
  children: [{
    path: 'buscar-cliente',
    component: BuscarClienteComponent,
  }, {
    path: 'consultar-cartera',
    component: ConsultarCarteraComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule { }
