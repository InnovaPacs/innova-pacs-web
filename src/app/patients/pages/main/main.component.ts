import { Component, inject } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../interfaces/patient.interface';
import { Pagination, Item } from '../../../shared/interfaces/pagination.interface';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { AuthService } from '../../../auth/services/auth.service';
import { el } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private service = inject(PatientService);
  private medicalOfficeService = inject(MedicalOfficeService);
  private authService = inject(AuthService)

  domains: Patient[] = [];

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  constructor() { }

  ngOnInit(): void {
    if(this.authService.getMedicalOfficeStatus()) {
      this.getAllData(0);
    } else {
      this.medicalOfficeService.getLastByUserId(null).subscribe((medicalOffice) => {
      console.log("medicalOffice ", medicalOffice);
      this.authService.selectMedicalOffice(medicalOffice.id);

      this.getAllData(0);
    });
    }
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
    console.log("GET ALLL")
    this.service.getAll(page).subscribe((response) => {
      this.domains = response.content;
      
      this.pagination = {
        currentPage: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        items: this.getItems(response.totalPages)
      }
    });
  }
}
