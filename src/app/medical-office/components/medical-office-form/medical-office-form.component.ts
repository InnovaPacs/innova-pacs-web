import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY, of } from 'rxjs';
import { MedicalOfficeService } from '../../services/medilca-office.service';
import { MedicalOffice, UpdateMedicalOffice } from '../../interfaces/medical-office.interface';
import { FileService } from '../../../shared/services/file.service';
import { PacsFile } from '../../../shared/interfaces/file.interface';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-medical-office-form',
    templateUrl: './medical-office-form.component.html',
    styleUrl: './medical-office-form.component.css',
    standalone: false
})
export class MedicalOfficeFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private medicalOfficeService = inject(MedicalOfficeService);
  private router = inject(Router);
  private fileService = inject(FileService);
  
  private loadingService = inject(LoadingService);
  private selectedFile!: File;
  private id!: string;
  public title: string = 'Registrar consultorio';

  private readonly requiredFieldLabels: Record<string, string> = {
    name: 'Nombre del consultorio',
    address: 'Dirección',
    phone: 'Teléfono',
  };

  public medicalOfficeForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
    address: [null, Validators.required],
    phone: [null, Validators.required],
    logo: [null]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.medicalOfficeService.getById(null, this.id);
      }),
      catchError(() => EMPTY)
    ).subscribe(medicalOffice => {
      this.patchMedicalOfficeForm(medicalOffice);
    });
  }

  patchMedicalOfficeForm(medicalOffice: MedicalOffice) {
    this.medicalOfficeForm.patchValue({
      id: medicalOffice.id,
      name: medicalOffice.name,
      address: medicalOffice.address,
      phone: medicalOffice.phone,
      logo: medicalOffice.logo
    });
  }

  getMedicalOfficeFormValue(): UpdateMedicalOffice {
    const { name, logo, address, phone} = this.medicalOfficeForm.value;

    return {
      name,
      logo,
      address,
      phone
    };
  }

  onSubmit() {
    if (this.medicalOfficeForm.invalid) {
      this.medicalOfficeForm.markAllAsTouched();
      const missing = Object.keys(this.requiredFieldLabels)
        .filter(key => this.medicalOfficeForm.get(key)?.invalid)
        .map(key => this.requiredFieldLabels[key]);
      this.loadingService.showRequiredFieldsAlert(missing);
      return;
    }

    const medicalOffice = this.getMedicalOfficeFormValue();

    if(this.id) {
      this.handleUpdate(medicalOffice);
    } else {
      this.handleCreate(medicalOffice);
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      this.selectedFile = file; 
    }
  }

  handleUpdate(medicalOffice: UpdateMedicalOffice): void {
    if(this.selectedFile) {
      this.fileService.save(this.selectedFile).pipe(
        switchMap((response) => {
          medicalOffice.logo = response.id;
          return this.medicalOfficeService.updateUserById(null, this.id, medicalOffice);
        })
      ).subscribe(() => {
          this.router.navigate(['/patients']);
        }
      );
    } else {
      this.medicalOfficeService.updateUserById(null, this.id, medicalOffice).subscribe(reposne => {
        this.router.navigate(['/patients']);
      });
    }
  }

  handleCreate(medicalOffice: UpdateMedicalOffice): void {
    this.fileService.save(this.selectedFile).pipe(
      switchMap((response) => {
        medicalOffice.logo = response.id;
        return this.medicalOfficeService.saveMedicalOffice(null, medicalOffice);
      })
    ).subscribe(() => {
        this.router.navigate(['/patients']);
      }
    );
  }
}
