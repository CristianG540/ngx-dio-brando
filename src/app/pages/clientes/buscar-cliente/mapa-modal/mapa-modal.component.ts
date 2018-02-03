import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../../../../@core/data/cliente/models/cliente';

@Component({
  selector: 'ngx-mapa-modal',
  templateUrl: './mapa-modal.component.html',
  styleUrls: ['./mapa-modal.component.scss'],
})
export class MapaModalComponent {

  @Input() private cliente: Cliente;
  modalHeader: string;
  modalContent = `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
    nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
    nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.`;

  lat = 51.678418;
  lng = 7.809007;

  constructor(
    private activeModal: NgbActiveModal,
  ) {}

  closeModal() {
    this.activeModal.close();
  }
}
