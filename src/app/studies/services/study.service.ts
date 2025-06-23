import { inject, Injectable } from '@angular/core';
import { StudyPage } from '../interfaces/study-page.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { Study, StudyDto } from '../interfaces/study.interface';
import { Modality } from '../interfaces/modality.interface';
import { ModalityType } from '../interfaces/modality-type.interface';

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  constructor() { }

  getAll(medicalOfficeId: string, page: number):Observable<StudyPage> {
    const url = `${this.baseUrl}/api/medical-offices/${medicalOfficeId}/studies?page=${page}`;
    const headers = this.authService.getHeaders();

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

  getById(id: string):Observable<Study> {
    const url = `${this.baseUrl}/api/studies/${id}`;
    const headers = this.authService.getHeaders();

    return this.http.get<Study>(url,  
      {
        headers
      }
    );
  }

  update(id: string, bodyRequest: StudyDto):Observable<Study> {
    const url = `${this.baseUrl}/api/studies/${id}`;
    const headers = this.authService.getHeaders();
    return this.http.put<Study>(url, bodyRequest,
      {
        headers
      }
    );
  }

  save(bodyRequest: StudyDto):Observable<Study> {
    const headers = this.authService.getHeaders();
    const url = `${this.baseUrl}/api/studies`;

    return this.http.post<Study>(url, bodyRequest, {
      headers
    });
  }

  getFullData():Observable<Study[]> {
    const url = `${this.baseUrl}/api/studies/full-data`;
    const headers = this.authService.getHeaders();

    return this.http.get<Study[]>(url,
      {
        headers
      }
    );
  }

  getAllModalieties():Observable<Modality[]> {
    const url = `${this.baseUrl}/api/modalities`;
    const headers = this.authService.getHeaders();

    return this.http.get<Modality[]>(url,
      {
        headers
      }
    );
  }

  getAllModalitiesType(modalityId: string):Observable<ModalityType[]> {
    const url = `${this.baseUrl}/api/modalities/${modalityId}/types`;
    const headers = this.authService.getHeaders();

    return this.http.get<ModalityType[]>(url,
      {
        headers
      }
    );
  }

  getAllStudies(appointmentId: string):Observable<Study[]> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/studies`;
    const headers = this.authService.getHeaders();

    return this.http.get<Study[]>(url,  
      {
        headers
      }
    );
  }
}
