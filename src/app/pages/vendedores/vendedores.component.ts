import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

//Services
import { VendedorService } from "../../@core/data/vendedor.service";
import { SmartTableService } from '../../@core/data/smart-table.service';

@Component({
  selector: 'ngx-vendedores',
  templateUrl: './vendedores.component.html'
})
export class VendedoresComponent  {

  /**
   * objeto de configuracion para ng2-smart-table
   */
  private settings = {
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
        title: 'ID',
        type: 'number',
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };

  private source: LocalDataSource = new LocalDataSource();

  constructor (
    private vendedoresService: VendedorService,
    private service: SmartTableService
  ){
    this.vendedoresService.getOrdenesVendedores().then( res => {
      console.log("PERRRRROOOOO", res);
    }).catch( err => {
      console.error("La puta madre no funciona", err)
    })
    const data = this.service.getData();
    this.source.load(data);
  }

  ngOnInit(){
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
