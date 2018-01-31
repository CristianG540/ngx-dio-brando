import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { BuscarClienteComponent } from './buscar-cliente/buscar-cliente.component';
import { ConsultarCarteraComponent } from './consultar-cartera/consultar-cartera.component';

const components = [
  ClientesComponent,
  BuscarClienteComponent,
  ConsultarCarteraComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    ClientesRoutingModule,
  ],
  declarations: [
    ...components,
  ],
})
export class ClientesModule { }
