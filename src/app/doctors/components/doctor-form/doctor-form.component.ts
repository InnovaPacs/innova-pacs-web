import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, UpdateDoctor } from '../../interfaces/doctor.interface';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.css'
})
export class DoctorFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(DoctorService);
  private router = inject(Router);
  
  id!: string;

  public form: FormGroup = this.fb.group({
    name: [null],
    phone: [null],
    email: [null],
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
      this.patchForm(response);
    });
  }

  patchForm(response: Doctor) {
    this.form.patchValue({
      id: response.id,
      name: response.name,
      phone: response.phone,
      email: response.email,
      specialty: response.specialty
    });
  }

  getFormValue(): UpdateDoctor {
    const { name, specialty, phone, email } = this.form.value;

    return {
      name,
      specialty,
      phone,
      email
    };
  }

  onSubmit() {
    const data = this.getFormValue();

    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        this.router.navigate(['/doctors/main']);
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        this.router.navigate(['/doctors/main']);
      });
    }
  }
}
