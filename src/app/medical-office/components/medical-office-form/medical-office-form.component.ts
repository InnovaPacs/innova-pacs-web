import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY, of } from 'rxjs';
import { MedicalOfficeService } from '../../services/medilca-office.service';
import { MedicalOffice, UpdateMedicalOffice } from '../../interfaces/medical-office.interface';
import { FileService } from '../../../shared/services/file.service';
import { PacsFile } from '../../../shared/interfaces/file.interface';

@Component({
  selector: 'app-medical-office-form',
  templateUrl: './medical-office-form.component.html',
  styleUrl: './medical-office-form.component.css'
})
export class MedicalOfficeFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private medicalOfficeService = inject(MedicalOfficeService);
  private router = inject(Router);
  private fileService = inject(FileService);
  
  selectedFile!: File;
  
  id!: string;

  public medicalOfficeForm: FormGroup = this.fb.group({
    name: [null],
    address: [null],
    phone: [null]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.medicalOfficeService.getById(null, this.id);
      }),
      catchError(error => {
        console.error('Error al obtener el consultorio:', error);
        return EMPTY;
      })
    ).subscribe(medicalOffice => {
      this.patchMedicalOfficeForm(medicalOffice);
    });
  }

  patchMedicalOfficeForm(medicalOffice: MedicalOffice) {
    this.medicalOfficeForm.patchValue({
      id: medicalOffice.id,
      name: medicalOffice.name,
      address: medicalOffice.address,
      phone: medicalOffice.phone
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
    const medicalOffice = this.getMedicalOfficeFormValue();

    console.log('medicalOffice: ', medicalOffice);

    if(this.id) {
      this.medicalOfficeService.updateUserById(null, this.id, medicalOffice).subscribe(reposne => {
        this.router.navigate(['/medical-offices/main']);
      });
    }

    if(!this.id) {
      this.fileService.save(this.selectedFile).pipe(
        switchMap((response) => {
          medicalOffice.logo = response.id;
          return this.medicalOfficeService.saveMedicalOffice(null, medicalOffice);
        })
      ).subscribe(() => {
          this.router.navigate(['/medical-offices/main']);
        }
      );

      /*
      this.medicalOfficeService.saveMedicalOffice(null, medicalOffice).subscribe(response => {
        this.router.navigate(['/medical-offices/main']);
      });*/
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file; 
    }
  }
}
