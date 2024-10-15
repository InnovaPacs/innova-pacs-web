import { inject, Injectable } from '@angular/core';
import { RadiolodyExamPage } from '../interfaces/radiology-exam-page.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { Patient, UpdatePatient } from '../../patients/interfaces/patient.interface';
import { RadiolodyExam, RadiologyExamDto, UpdateRadiolodyExam } from '../interfaces/radiology-exam.interface';
import { RadiolodyExamType } from '../interfaces/radiology-exam-type.interface';
import { RadiolodyExamStudy } from '../interfaces/radiology-exam-study.interface';

@Injectable({
  providedIn: 'root'
})
export class RadiologyExamService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  constructor() { }

  getAll(appointmentId: string, page: number):Observable<RadiolodyExamPage> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/radiology-exams?page=${page}`;
    const headers = this.authService.getToken();

    return this.http.get(url,  
      {
        headers
      }
    ).pipe(
      map((response: any) => {
        return {
          content: response.content,
          totalElements: response.totalElements,
          size: response.size,
          number: response.number,
          totalPages: response.totalPages
        }
      })
    );
  }

  getById(id: string):Observable<RadiolodyExam> {
    const url = `${this.baseUrl}/api/radiology-exams/${id}`;
    const headers = this.authService.getToken();

    return this.http.get<RadiolodyExam>(url,  
      {
        headers
      }
    );
  }

  update(id: string, bodyRequest: RadiologyExamDto):Observable<RadiolodyExam> {
    const url = `${this.baseUrl}/api/radiology-exams/${id}`;
    const headers = this.authService.getToken();
    
    return this.http.put<RadiolodyExam>(url, bodyRequest,
      {
        headers
      }
    );
  }

  save(bodyRequest: RadiologyExamDto):Observable<RadiolodyExam> {
    const headers = this.authService.getToken();
    const url = `${this.baseUrl}/api/radiology-exams`;

    console.log('RadiologyExamDto: ', bodyRequest);
    return this.http.post<RadiolodyExam>(url, bodyRequest, {
      headers
    });
  }

  getFullData():Observable<RadiolodyExam[]> {
    const url = `${this.baseUrl}/api/radiology-exams/full-data`;
    const headers = this.authService.getToken();

    return this.http.get<RadiolodyExam[]>(url,
      {
        headers
      }
    );
  }

  getAllRadiologyExamType():Observable<RadiolodyExamType[]> {
    const url = `${this.baseUrl}/api/radiology-exams-types`;
    const headers = this.authService.getToken();

    return this.http.get<RadiolodyExamType[]>(url,
      {
        headers
      }
    );
  }

  getAllRadiologyExamStudy(radiologyExamTypeId: string):Observable<RadiolodyExamStudy[]> {
    const url = `${this.baseUrl}/api/radiology-exams-types/${radiologyExamTypeId}/studies`;
    const headers = this.authService.getToken();

    return this.http.get<RadiolodyExamStudy[]>(url,
      {
        headers
      }
    );
  }
}
