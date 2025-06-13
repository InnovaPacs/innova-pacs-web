import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  public fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  public loginForm = this.fb.group({
    username: ['Bautista', [Validators.required]],
    password: ['camposbj1990', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    const { username, password } = this.loginForm.value;
    
    this.authService.login(username||'', password||'').subscribe(
      {
        next: () => this.router.navigateByUrl('/patients/main'),
        error: (error) => {
          this.loadingService.showErrorMessage(error.message);
        }
      }
    );
  }
}
