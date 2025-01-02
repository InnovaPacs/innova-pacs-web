import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY, of } from 'rxjs';
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
    dateOfBirth: [null, Validators.required],
    gender: [null, Validators.required],
    address: [null, Validators.required],
    phoneNumber: [null, Validators.required],
    email: [null, Validators.required],
    city: [null, Validators.required],
    maritalStatus: [null, Validators.required],
    notes: [null, Validators.required],
    postalCode: [null, Validators.required],
    curp: [null, Validators.required],
    rfc: [null, Validators.required],
    country: [null, Validators.required],
    state: [null, Validators.required],
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
      dateOfBirth: response.dateOfBirth,
      gender: response.gender,
      address: response.address,
      phoneNumber: response.phoneNumber,
      email: response.email,
      photo: response.photo,
      city: response.city,
      maritalStatus: response.maritalStatus,
      notes: response.notes,
      postalCode: response.postalCode,
      curp: response.curp,
      rfc: response.rfc,
      country: response.country,
      state: response.state,
      
    });
  }

  getFormValue(): UpdatePatient {
    const { firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, photo, documentId,
      city,
      state,
      postalCode,
      country,
      notes,
      maritalStatus,
      rfc,
      curp} = this.form.value;

    return {
      firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, photo,
      documentId,
      city,
      state,
      postalCode,
      country,
      notes,
      maritalStatus,
      rfc,
      curp
    };
  }

  onSubmit() {
    if (this.form.invalid) {
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
    )
    .subscribe({
      next: () => {
        this.router.navigate(['/patients/main']);
      }
    });
  }
}
