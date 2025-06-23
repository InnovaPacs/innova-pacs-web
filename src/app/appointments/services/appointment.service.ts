import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { AppointmentPage } from '../interfaces/appointment-page.interface';
import { Appointment, AppointmentDto, AppointmentFullData } from '../interfaces/appointment.interface';
import { StudyPage } from '../../studies/interfaces/study-page.interface';
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
    console.log("bodyRequest ", bodyRequest);

    const headers = this.authService.getHeaders();
    const url = `${this.baseUrl}/api/appointments`;
    return this.http.post<Appointment>(url, bodyRequest, {
      headers
    });
  }

  getFullData(month: number, year: number, modality: string|null):Observable<AppointmentFullData[]> {
    const url = `${this.baseUrl}/api/appointments/full-data?month=${month === 0 ? 12 : month}&year=${year}`
    + (modality && modality !== 'none' ? `&modality=${modality}` : '');
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

  cancelById(appointmentId: string): Observable<void> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/cancel`;
    const headers = this.authService.getHeaders();
    
    return this.http.delete<void>(url,
      {
        headers
      }
    );
  }

  getStudiesByAppointmentId(page: number, appointmentId: string):Observable<StudyPage> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/studies?page=${page}`;
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

  getAllSchedule(date: string, modality: string|null):Observable<Schedule[]> {
    let params = new HttpParams().set('date', date);

    if (modality) {
      params = params.set('modalityId', modality);
    }
    
    const url = `${this.baseUrl}/api/appointments/schedule`;
    const headers = this.authService.getHeaders();

    return this.http.get<Schedule[]>(url,
      {
        params,
        headers
      }
    );
  }

  finished(appointmentId: string): Observable<void> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/finished`;
    const headers = this.authService.getHeaders();
    
    return this.http.post<void>(url,{}, {
      headers
    });
  }

  cancel(appointmentId: string): Observable<void> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/cancel`;
    const headers = this.authService.getHeaders();
    
    return this.http.post<void>(url,{}, {
      headers
    });
  }

  confirmed(appointmentId: string): Observable<void> {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/confirmed`;
    const headers = this.authService.getHeaders();
    
    return this.http.post<void>(url,{}, {
      headers
    });
  }

  updateStudyStatus(appointmentId: string, status: string) {
    const url = `${this.baseUrl}/api/appointments/${appointmentId}/studies/status/${status}`;
    const headers = this.authService.getHeaders();
    
    return this.http.post<void>(url,{}, {
      headers
    });
  }
}
