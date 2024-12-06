import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { Patient, UpdatePatient } from '../../interfaces/patient.interface';
import { FileService } from '../../../shared/services/file.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent {
  private selectedFile!: File;
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(PatientService);
  private router = inject(Router);
  private fileService = inject(FileService);
  
  id!: string;

  public form: FormGroup = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    birthDate: [null, Validators.required],
    gender: [null, Validators.required],
    address: [null, Validators.required],
    phone: [null, Validators.required],
    email: [null, Validators.required],
    photo: [null]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.service.getById(this.id);
      }),
      catchError(error => {
        console.error('Error al obtener el consultorio:', error);
        return EMPTY;
      })
    ).subscribe(response => {
      this.patchForm(response);
    });
  }

  patchForm(response: Patient) {
    this.form.patchValue({
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      birthDate: response.birthDate,
      gender: response.gender,
      address: response.address,
      phone: response.phone,
      email: response.email,
      photo: response.photo
    });
  }

  getFormValue(): UpdatePatient {
    const { firstName, lastName, birthDate, gender, address, phone, email, photo, documentId,
      city,
      state,
      postalCode,
      country,
      notes,
      maritalStatus } = this.form.value;

    return {
      firstName, lastName, birthDate, gender, address, phone, email, photo,
      documentId,
      city,
      state,
      postalCode,
      country,
      notes,
      maritalStatus
    };
  }

  onSubmit() {
    if (this.form.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const data = this.getFormValue();

    if(this.id) {
      this.handleUpdate(data);
    } else {
      this.handleCreate(data);
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      this.selectedFile = file; 
    }
  }

  handleUpdate(update: UpdatePatient): void {
    if(this.selectedFile) {
      this.fileService.save(this.selectedFile).pipe(
        switchMap((response) => {
          update.photo = response.id;
          return this.service.update(this.id, update);
        })
      ).subscribe(() => {
          this.router.navigate(['/patients/main']);
        }
      );
    } else {
      this.service.update(this.id, update).subscribe(reposne => {
        this.router.navigate(['/patients/main']);
      });
    }
  }

  handleCreate(update: UpdatePatient): void {
    this.fileService.save(this.selectedFile).pipe(
      switchMap((response) => {
        update.photo = response.id;
        return this.service.save(update);
      })
    ).subscribe(() => {
        this.router.navigate(['/patients/main']);
      }
    );
  }
}
