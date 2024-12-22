import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { AppointmentPage } from '../interfaces/appointment-page.interface';
import { Appointment, AppointmentDto, AppointmentFullData } from '../interfaces/appointment.interface';
import { RadiolodyExamPage } from '../../radiology-exam/interfaces/radiology-exam-page.interface';
import { Schedule } from '../interfaces/appointment-schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  constructor() { }

  getAll(page: number):Observable<AppointmentPage> {
    const url = `${this.baseUrl}/api/appointments?page=${page}`;
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

  getById(medicalOfficeId: string):Observable<Appointment> {
    const url = `${this.baseUrl}/api/appointments/${medicalOfficeId}`;
    const headers = this.authService.getHeaders();

    return this.http.get<Appointment>(url,  
      {
        headers
      }
    );
  }

  update(id: string, bodyRequest: AppointmentDto):Observable<Appointment> {
    const url = `${this.baseUrl}/api/appointments/${id}`;
    const headers = this.authService.getHeaders();
    
    return this.http.put<Appointment>(url, bodyRequest,
      {
        headers
      }
    );
  }

  save(bodyRequest: AppointmentDto):Observable<Appointment> {
    const headers = this.authService.getHeaders();
    const url = `${this.baseUrl}/api/appointments`;
    console.log("bodyRequest: ",bodyRequest);
    return this.http.post<Appointment>(url, bodyRequest, {
      headers
    });
  }

  getFullData(month: number, year: number, radiologyExamType: string|null):Observable<AppointmentFullData[]> {
    const url = `${this.baseUrl}/api/appointments/full-data?month=${month === 0 ? 12 : month}&year=${year}`
    + (radiologyExamType && radiologyExamType !== 'none' ? `&radiologyExamType=${radiologyExamType}` : '');
    const headers = this.authService.getHeaders();

    return this.http.get<AppointmentFullData[]>(url,
      {
        headers
      }
    );
  }

  deleteById(id: string): Observable<void> {
    const url = `${this.baseUrl}/api/appointments/${id}`;
    const headers = this.authService.getHeaders();

    return this.http.delete<void>(url,
      {
        headers
      }
    );
  }

  getRadiologyExamsByAppointmentId(page: number, appointmentId: string):Observable<RadiolodyExamPage> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/radiologyExams?page=${page}`;
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

  getAllSchedule(month: number, year: number, radiologyExamType: string|null):Observable<Schedule[]> {
    const url = `${this.baseUrl}/api/appointments/schedule?month=${month === 0 ? 12 : month}&year=${year}`
    + (radiologyExamType && radiologyExamType !== 'none' ? `&radiologyExamType=${radiologyExamType}` : '');
    const headers = this.authService.getHeaders();

    return this.http.get<Schedule[]>(url,
      {
        headers
      }
    );
  }
}
