import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  public fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm = this.fb.group({
    username: ['camposbj19906', [Validators.required]],
    password: ['camposbj19906', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    const { username, password } = this.loginForm.value;
    
    this.authService.login(username||'', password||'').subscribe(
      {
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (error) => {
          Swal.fire('Error', error, 'error');
        }
      }
    );
  }
}
