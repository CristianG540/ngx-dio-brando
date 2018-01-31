import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './users.service';
import { StateService } from './state.service';
import { VendedorService } from './vendedor/vendedor.service';
import { SmartTableService } from './smart-table.service';
import { EnviromentService } from './enviroment.service';

const SERVICES = [
  UserService,
  StateService,
  VendedorService,
  SmartTableService,
  EnviromentService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
