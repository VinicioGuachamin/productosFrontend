import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() titulo = '¿Estás seguro?';
  @Input() mensaje = 'Esta acción no se puede deshacer.';
  @Input() textoCancelar = 'Cancelar';
  @Input() textoConfirmar = 'Eliminar';
  @Input() esPeligroso = true;

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar() {
    this.confirmar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
