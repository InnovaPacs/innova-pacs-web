import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, UpdateDoctor } from '../../interfaces/doctor.interface';
import { UpdateMedicalOffice } from '../../../medical-office/interfaces/medical-office.interface';
import { FileService } from '../../../shared/services/file.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.css'
})
export class DoctorFormComponent {
  private selectedFile!: File;
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(DoctorService);
  private router = inject(Router);
  private fileService = inject(FileService);
  title: string = 'Registrar médico';
  
  id!: string;

  public form: FormGroup = this.fb.group({
    name: [null, Validators.required],
    phone: [null, Validators.required],
    email: [null, Validators.required],
    specialty: [null]
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
      this.title = `Editar médico "${response.name}"`;
      this.patchForm(response);
    });
  }

  patchForm(response: Doctor) {
    this.form.patchValue({
      id: response.id,
      name: response.name,
      phone: response.phone,
      email: response.email,
      specialty: response.specialty,
      photo: response.photo
    });
  }

  getFormValue(): UpdateDoctor {
    const { name, specialty, phone, email, photo } = this.form.value;

    return {
      name,
      specialty,
      phone,
      email,
      photo
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

  handleUpdate(update: UpdateDoctor): void {
    if(this.selectedFile) {
      this.fileService.save(this.selectedFile).pipe(
        switchMap((response) => {
          update.photo = response.id;
          return this.service.update(this.id, update);
        })
      ).subscribe(() => {
          this.router.navigate(['/doctors/main']);
        }
      );
    } else {
      this.service.update(this.id, update).subscribe(reposne => {
        this.router.navigate(['/doctors/main']);
      });
    }
  }

  handleCreate(update: UpdateDoctor): void {
    this.fileService.save(this.selectedFile).pipe(
      switchMap((response) => {
        update.photo = response.id;
        return this.service.save(update);
      })
    ).subscribe(() => {
        this.router.navigate(['/doctors/main']);
      }
    );
  }
}
