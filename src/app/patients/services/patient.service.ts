import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { PatientPage } from '../interfaces/patient-page.interface';
import { Patient, UpdatePatient } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  constructor() {}

  getAll(page: number, mainSearch: string | null): Observable<PatientPage> {
    const url = `${this.baseUrl}/api/patients`;
    const headers = this.authService.getHeaders();

    const params = this.getParams(page, mainSearch);
    return this.http
      .get(url, {
        params,
        headers,
      })
      .pipe(
        map((response: any) => {
          return {
            content: response.content,
            totalElements: response.totalElements,
            size: response.size,
            number: response.number,
            totalPages: response.totalPages,
          };
        })
      );
  }

  getById(medicalOfficeId: string): Observable<Patient> {
    const url = `${this.baseUrl}/api/patients/${medicalOfficeId}`;
    const headers = this.authService.getHeaders();

    return this.http.get<Patient>(url, {
      headers,
    });
  }

  update(id: string, bodyRequest: UpdatePatient): Observable<Patient> {
    const url = `${this.baseUrl}/api/patients/${id}`;
    const headers = this.authService.getHeaders();

    return this.http.put<Patient>(url, bodyRequest, {
      headers,
    });
  }

  save(bodyRequest: UpdatePatient): Observable<Patient> {
    const headers = this.authService.getHeaders();
    const url = `${this.baseUrl}/api/patients`;

    return this.http.post<Patient>(url, bodyRequest, {
      headers,
    });
  }

  getFullData(): Observable<Patient[]> {
    const url = `${this.baseUrl}/api/patients/full-data`;
    const headers = this.authService.getHeaders();

    return this.http.get<Patient[]>(url, {
      headers,
    });
  }

  private getParams(page: number, search: string | null): HttpParams {
    let params = new HttpParams();

    if (search) {
      params = params.set('mainSearch', search);
    }

    if (page >= 0) {
      params = params.set('page', page);
    }

    return params;
  }

  getByCurp(curp: string): Observable<Patient> {
    const url = `${this.baseUrl}/api/patients/curp/${curp}`;
    const headers = this.authService.getHeaders();

    return this.http.get<Patient>(url, {
      headers,
    });
  }
}
