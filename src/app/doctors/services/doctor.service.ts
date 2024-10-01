import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { DoctorPage } from '../interfaces/doctor-page.interface';
import { Doctor, UpdateDoctor } from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  constructor() { }

  getAll(page: number):Observable<DoctorPage> {
    const url = `${this.baseUrl}/api/doctors?page=${page}`;
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

  getById(medicalOfficeId: string):Observable<Doctor> {
    const url = `${this.baseUrl}/api/doctors/${medicalOfficeId}`;
    const headers = this.authService.getToken();

    return this.http.get<Doctor>(url,  
      {
        headers
      }
    );
  }

  update(id: string, bodyRequest: UpdateDoctor):Observable<Doctor> {
    const url = `${this.baseUrl}/api/doctors/${id}`;
    const headers = this.authService.getToken();
    
    return this.http.put<Doctor>(url, bodyRequest,
      {
        headers
      }
    );
  }

  save(bodyRequest: UpdateDoctor):Observable<Doctor> {
    const headers = this.authService.getToken();
    const url = `${this.baseUrl}/api/doctors`;

    return this.http.post<Doctor>(url, bodyRequest, {
      headers
    });
  }

  getFullData():Observable<Doctor[]> {
    const url = `${this.baseUrl}/api/doctors/full-data`;
    const headers = this.authService.getToken();

    return this.http.get<Doctor[]>(url,
      {
        headers
      }
    );
  }
}
