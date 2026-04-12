import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  showLoading(message: string = 'Procesando ...') {
    Swal.fire({
      title: message,
      html: '<div class="spinner"></div>',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#1e1e2f', // Fondo oscuro
      color: '#f1f1f1', // Texto claro
      iconColor: '#facc15',
    });
  }

  hideLoading() {
    Swal.close();
  }

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      background: '#1e1e2f', // Fondo oscuro
      color: '#f1f1f1', // Texto claro
      iconColor: '#facc15',
    });
  }

  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '¡Operación exitosa!',
      text: message,
      background: '#1e1e2f',
      color: '#f1f1f1',
      iconColor: '#facc15',
    });
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
