import { Component, inject } from '@angular/core';
import { MedicalOfficeService } from '../../services/medilca-office.service';
import { MedicalOffice } from '../../interfaces/medical-office.interface';
import { Item, Pagination } from '../../../shared/interfaces/pagination.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private medicalOfficeService = inject(MedicalOfficeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  medicalOffices: MedicalOffice[] = [];

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  constructor() { }

  ngOnInit(): void {
    this.authService.discardMedicalOffice();
    this.getAllData(0);
  }

  getItems(totalPages: number):Item[] {
    let items = [];

    for (let i = 0; i < totalPages; i++) {
      const item = {
        'name': `${i + 1}`,
        'index': i
      }

      items.push(item);
    }
    return items;
  }

  navigate(page: number):void {
    this.getAllData(page);
  }

  private getAllData(page: number) {
    this.medicalOfficeService.getAllByUserId(null ,page).subscribe((response) => {
      this.medicalOffices = response.content;
      
      this.pagination = {
        currentPage: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        items: this.getItems(response.totalPages)
      }
    });
  }

  onCardClick(medicalOfficeId: string) {
    this.authService.selectMedicalOffice(medicalOfficeId);
    this.router.navigate(['/patients/main']);
  }
}
