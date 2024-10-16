import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { RadiolodyExam, RadiologyExamDto } from '../../interfaces/radiology-exam.interface';
import { RadiologyExamService } from '../../services/radiology-exam.service';
import { RadiolodyExamType } from '../../interfaces/radiology-exam-type.interface';
import { RadiolodyExamStudy } from '../../interfaces/radiology-exam-study.interface';

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
    radiologyExamTypeId: [null],
    examDate: [null],
    status: [null],
    result: [null],
    patientId: [null],
    medicalOfficeId: [null],
    appointmentId: [null],
    radiologyExamStudyId: [null]
  });

  public radiologyExamTypes: RadiolodyExamType[] =  [];
  public radiologyExamStudy: RadiolodyExamStudy[] =  [];

  ngOnInit(): void {
    this.getData();
    this.getRadiologyExamData();
  }

  patchForm(response: RadiolodyExam) {
    this.form.patchValue({
      id: response.id,
      examDate: response.examDate,
      status: response.status,
      result: response.result,
      patientId: response.patient.id,
      medicalOfficeId: response.medicalOffice.id,
      appointmentId: response.appointment.id,
    });

    if(response!.radiologyExamType) {
      this.form.patchValue({
        radiologyExamTypeId: response.radiologyExamType.id
      });
    }

    if(response!.radiologyExamStudy) {
      this.form.patchValue({
        radiologyExamStudyId: response.radiologyExamStudy.id
      });
    }
  }

  getFormValue(): RadiologyExamDto {
    const { id, radiologyExamTypeId, examDate, status, result, patientId, medicalOfficeId, appointmentId, radiologyExamStudyId } = this.form.value;

    return {
      id, radiologyExamTypeId, examDate, status, result, patientId, medicalOfficeId, appointmentId, radiologyExamStudyId
    };
  }

  onSubmit() {
    const data = this.getFormValue();
    console.log('data: ', data);
    
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

  getRadiologyExamData(): void {
    this.service.getAllRadiologyExamType().subscribe((data) => {
      this.radiologyExamTypes = data;
    });
  }

  getData(): void {
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

  onSelectRadiologyExamType(selectRadiologyExamTypeId: any) {
    const selectedId = selectRadiologyExamTypeId.target.value;    
    this.service.getAllRadiologyExamStudy(selectedId).subscribe((data) => {
      this.radiologyExamStudy = data;
    });
  }
}
