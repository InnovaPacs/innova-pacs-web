import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }

  showLoading(message: string = 'Cargando ...') {
    Swal.fire({
      title: 'Procesando ...',
      html: '<div class="spinner"></div>',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  hideLoading() {
    Swal.close();
  }

   showErrorMessage(message: string):void {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    }
}
