import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../../@theme/theme.module';
import { VendedorComponent } from './vendedor.component';

import { SmartTableService } from '../../../@core/data/smart-table.service';


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    VendedorComponent,
  ],
  providers: [
    SmartTableService,
  ],
})
export class VendedorModule { }
