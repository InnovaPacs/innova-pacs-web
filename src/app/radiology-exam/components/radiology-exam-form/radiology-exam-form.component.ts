import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { RadiolodyExam, RadiologyExamDto } from '../../interfaces/radiology-exam.interface';
import { RadiologyExamService } from '../../services/radiology-exam.service';

@Component({
  selector: 'app-radiology-exam-form',
  templateUrl: './radiology-exam-form.component.html',
  styleUrl: './radiology-exam-form.component.css'
})
export class RadiologyExamFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(RadiologyExamService);
  private router = inject(Router);
  
  public id!: string;
  public appointmentId!: string;

  public form: FormGroup = this.fb.group({
    id: [null],
    type: [null],
    examDate: [null],
    status: [null],
    result: [null],
    appointmentId: [null]
  });

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(queryParams => queryParams.get('appointmentId')),
      catchError(error => {
        console.error('Error:', error.message);
        return EMPTY;
      })
    ).subscribe(appointmentId => {
      this.appointmentId = appointmentId!;
      this.form.patchValue({
        appointmentId: appointmentId
      });
    });

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

  patchForm(response: RadiolodyExam) {
    this.form.patchValue({
      id: response.id,
      type: response.type,
      examDate: response.examDate,
      status: response.status,
      result: response.result,
      patientId: response.patient.id,
      medicalOfficeId: response.medicalOffice.id,
      appointmentId: response.appointment.id
    });
  }

  getFormValue(): RadiologyExamDto {
    const { id, type, examDate, status, result, patientId, medicalOfficeId, appointmentId } = this.form.value;

    return {
      id, type, examDate, status, result, patientId, medicalOfficeId, appointmentId
    };
  }

  onSubmit() {
    const data = this.getFormValue();

    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        this.router.navigate(['/radiology-exams/main'], { queryParams: { appointmentId: this.appointmentId } });
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        this.router.navigate(['/radiology-exams/main'], { queryParams: { appointmentId: this.appointmentId } });
      });
    }
  }
}
