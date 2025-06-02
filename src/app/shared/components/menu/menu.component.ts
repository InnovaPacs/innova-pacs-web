import { AfterViewInit, Component, effect, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements AfterViewInit, OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  medicalOfficeStatus = this.authService.getMedicalOfficeStatus;

  logOut() {
    this.authService.logOut();
    this.router.navigate([`/auth/login`]);
  }
  
  ngOnInit(): void {
    
  }
  
  goToMedicalOffice() {
    this.router.navigate([`/medical-offices/${this.authService.currentMedicalOfficeId()}`]);
  }

  goToProfile() {
    this.router.navigate([`/users/${this.authService.currentUser()!.id}`]);
  }

  get currentUser(): string {
    return this.authService.currentUser()!.id;
  }

  ngAfterViewInit(): void {
  }
}
