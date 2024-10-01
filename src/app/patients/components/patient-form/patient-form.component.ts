import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { Patient, UpdatePatient } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(PatientService);
  private router = inject(Router);
  
  id!: string;

  public form: FormGroup = this.fb.group({
    firstName: [null],
    lastName: [null],
    birthDate: [null],
    gender: [null],
    address: [null],
    phone: [null],
    email: [null]
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
      email: response.email
    });
  }

  getFormValue(): UpdatePatient {
    const { firstName, lastName, birthDate, gender, address, phone, email } = this.form.value;

    return {
      firstName, lastName, birthDate, gender, address, phone, email
    };
  }

  onSubmit() {
    const data = this.getFormValue();

    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        this.router.navigate(['/patients/main']);
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        this.router.navigate(['/patients/main']);
      });
    }
  }
}
