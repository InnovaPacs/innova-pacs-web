import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { em } from '@fullcalendar/core/internal-common';
import { SignUp } from '../../interfaces';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  public fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  public signUpForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  signUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { username, password, email } = this.signUpForm.value;
    
    const user: SignUp = {
      email: email ,
      username: username,
      password: password
    };

    this.authService.signUp(user).subscribe(() => {
      this.router.navigateByUrl('/auth/login');
      this.loadingService.showSuccessMessage('Cuenta creada correctamente');
    });
  }
}
