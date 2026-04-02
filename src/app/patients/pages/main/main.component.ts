import { Component, inject } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../interfaces/patient.interface';
import { Pagination, Item } from '../../../shared/interfaces/pagination.interface';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    standalone: false
})
export class PatientMainComponent {
  private service = inject(PatientService);
  private medicalOfficeService = inject(MedicalOfficeService);
  private authService = inject(AuthService);
  static counter = 0;

  domains: Patient[] = [];

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  private fb = inject(FormBuilder);
  
  
  public form: FormGroup = this.fb.group({
    mainSearch: [null]
  });
  
  constructor() {
  }

ngOnInit(): void {
  if (this.authService.getMedicalOfficeStatus()) {
    this.getAllData(0, null);
  } else {
    this.medicalOfficeService.getLastByUserId(null).subscribe({
      next: (medicalOffice) => {
        if (medicalOffice && medicalOffice.id) {
          this.authService.selectMedicalOffice(medicalOffice.id);
          this.getAllData(0, null);
        }
      }
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
    this.getAllData(page, null);
  }

  private getAllData(page: number, mainSearch: string | null) {
    this.service.getAll(page, mainSearch).subscribe((response) => {
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

  onSubmit(): void {
    const mainSearch = this.form.get('mainSearch')?.value;
    console.log(mainSearch);
    this.getAllData(0, mainSearch);
  }
}
