import { Component, inject } from '@angular/core';
import { Pagination, Item } from '../../../shared/interfaces/pagination.interface';
import { Study } from '../../interfaces/study.interface';
import { StudyService } from '../../services/study.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { PacsConfigurationService } from '../../../pacs-configuration/service/pacs-configuration.service';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { PacsConfiguration } from '../../../pacs-configuration/interfaces/pacs-configuration.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private service = inject(StudyService);
  private authService = inject(AuthService);
  private medicalOfficeService = inject(MedicalOfficeService);
  public domains: Study[] = [];
  public medicalOfficeId!: string | null;
  public pacsConfiguration!: PacsConfiguration;

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  constructor() { }

  ngOnInit(): void {
    this.medicalOfficeId = this.authService.currentMedicalOfficeId();
    this.getAllData(this.medicalOfficeId, 0);
    this.getPacsConfiguration();
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
    this.getAllData(this.medicalOfficeId!, page);
  }

  private getPacsConfiguration() {
    this.medicalOfficeService.getPacsConfigurationByMedicalOffice(this.medicalOfficeId!).subscribe((result) => {
      this.pacsConfiguration = result;
    });
  }

  private getAllData(appointmentId: string | null, page: number) {
    this.service.getAll(appointmentId!, page).subscribe((response) => {
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

  public syncStudies():void {
    this.service.syncStudies().subscribe(() => {
      this.getAllData(this.medicalOfficeId!, 0);
    });
  }

  public deleteStudy(id: string): void {
    this.service.deleteById(id).subscribe(() => {
      this.getAllData(this.medicalOfficeId, 0);
    });
  }
}
