import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { Study, StudyDto } from '../../interfaces/study.interface';
import { StudyService } from '../../services/study.service';
import { Modality } from '../../interfaces/modality.interface';
import { ModalityType } from '../../interfaces/modality-type.interface';

@Component({
  selector: 'app-study-form',
  templateUrl: './study-form.component.html',
  styleUrl: './study-form.component.css'
})
export class StudyFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(StudyService);
  private router = inject(Router);
  
  public id!: string;
  public appointmentId!: string;

  public form: FormGroup = this.fb.group({
    id: [null],
    modalityId: [null],
    examDate: [null],
    status: [null],
    result: [null],
    patientId: [null],
    medicalOfficeId: [null],
    appointmentId: [null],
    modalityTypeId: [null]
  });

  public modalities: Modality[] =  [];
  public modalityTypes: ModalityType[] =  [];

  ngOnInit(): void {
    this.getData();
    this.getModalitiesData();
  }

  patchForm(response: Study) {
    this.form.patchValue({
      id: response.id,
      examDate: response.examDate,
      status: response.status,
      result: response.result,
      patientId: response.patient.id,
      medicalOfficeId: response.medicalOffice.id,
      appointmentId: response.appointment.id,
    });

    if(response!.modality) {
      this.form.patchValue({
        modalityId: response.modality.id
      });
    }

    if(response!.modalityType) {
      this.form.patchValue({
        modalityTypeId: response.modalityType.id
      });
    }
  }

  getFormValue(): StudyDto {
    const { id, modalityId, examDate, status, result, patientId, medicalOfficeId, appointmentId, modalityTypeId } = this.form.value;

    return {
      id, modalityId, examDate, status, result, patientId, medicalOfficeId, appointmentId, modalityTypeId
    };
  }

  onSubmit() {
    const data = this.getFormValue();
    console.log('data: ', data);
    
    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        this.router.navigate(['/studies/main'], { queryParams: { appointmentId: this.appointmentId } });
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        this.router.navigate(['/studies/main'], { queryParams: { appointmentId: this.appointmentId } });
      });
    }
  }

  getModalitiesData(): void {
    this.service.getAllModalieties().subscribe((data) => {
      this.modalities = data;
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

  onSelectModality(selectModalityId: any) {
    const selectedId = selectModalityId.target.value;    
    this.service.getAllModalitiesType(selectedId).subscribe((data) => {
      this.modalityTypes = data;
    });
  }
}
