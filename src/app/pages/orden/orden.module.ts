import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { OrdenComponent } from './orden.component';

import { SmartTableService } from '../../@core/data/smart-table.service';


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    OrdenComponent,
  ],
  providers: [
    SmartTableService,
  ],
})
export class OrdenModule { }
