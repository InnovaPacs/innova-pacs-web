import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoading = false;

  constructor() {}

  showLoading(message: string = 'Procesando ...') {
    this.isLoading = true;
    Swal.fire({
      title: message,
      html: '<div class="spinner"></div>',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#1e1e2f',
      color: '#f1f1f1',
      iconColor: '#facc15',
    });
  }

  hideLoading() {
    if (!this.isLoading) return;
    this.isLoading = false;
    Swal.close();
  }

  showErrorMessage(message: string): void {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      background: '#1e1e2f',
      color: '#f1f1f1',
      iconColor: '#facc15',
    });
  }

  showSuccessMessage(message: string): void {
    this.isLoading = false;
    Swal.fire({
      icon: 'success',
      title: '¡Operación exitosa!',
      text: message,
      background: '#1e1e2f',
      color: '#f1f1f1',
      iconColor: '#facc15',
    });
  }

  async showConfirmDialog(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      background: '#1e1e2f',
      color: '#f1f1f1',
      iconColor: '#facc15',
      confirmButtonColor: '#fa1515',
    });
    return result.isConfirmed;
  }

  showRequiredFieldsAlert(missingFields: string[]): void {
    const list = missingFields.map((f) => `<li>${f}</li>`).join('');
    Swal.fire({
      icon: 'warning',
      title: 'Campos obligatorios',
      html: `<ul style="text-align:left;margin-top:8px">${list}</ul>`,
      confirmButtonText: 'Entendido',
      background: '#1e1e2f',
      color: '#f1f1f1',
      iconColor: '#fa1515',
      confirmButtonColor: '#fa1515',
    });
  }
}
