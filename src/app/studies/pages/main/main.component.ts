import { Component, inject } from '@angular/core';
import { Pagination, Item } from '../../../shared/interfaces/pagination.interface';
import { Study } from '../../interfaces/study.interface';
import { StudyService } from '../../services/study.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { PacsConfiguration } from '../../../pacs-configuration/interfaces/pacs-configuration.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudySearch } from '../../interfaces/study-seaarch.interface';
import { Modality } from '../../interfaces/modality.interface';
import { dA } from '@fullcalendar/core/internal-common';
import { StudyStatusService } from '../../../shared/services/study-status.service';

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
  private studyService = inject(StudyService);
  public modalities: Modality[] =  [];
  public studyStatusService = inject(StudyStatusService);

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  private fb = inject(FormBuilder);
  public searchForm: FormGroup = this.fb.group({
    accessionNumber: [null],
    modalities: [null],
    patientName: [null],
    status: [null],
    date: [null]
  });

  constructor() { }

  ngOnInit(): void {
    this.medicalOfficeId = this.authService.currentMedicalOfficeId();
    this.getAllData(this.medicalOfficeId, 0, null);
    this.getPacsConfiguration();
    this.getModalitiesData();
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
    this.getAllData(this.medicalOfficeId!, page, null);
  }

  private getPacsConfiguration() {
    this.medicalOfficeService.getPacsConfigurationByMedicalOffice(this.medicalOfficeId!).subscribe((result) => {
      this.pacsConfiguration = result;
    });
  }

  private getAllData(appointmentId: string | null, page: number, search: StudySearch | null) {
    this.service.getAll(appointmentId!, page, search).subscribe((response) => {
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
      this.getAllData(this.medicalOfficeId!, 0, null);
    });
  }

  public deleteStudy(id: string): void {
    this.service.deleteById(id).subscribe(() => {
      this.getAllData(this.medicalOfficeId, 0, null);
    });
  }

  public onSubmit() {
    this.getAllData(this.medicalOfficeId, 0, this.searchForm.value);
  }

   getModalitiesData(): void {
     this.studyService.getAllModalieties().subscribe((data) => {
       this.modalities = data;
     });
   }

  getStatusName(statusCode: string | undefined): string {
    return statusCode ? this.studyStatusService.getStatusName(statusCode) : '';
  }
 }
