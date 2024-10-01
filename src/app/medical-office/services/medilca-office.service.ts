import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { MedicalOfficePage } from '../interfaces/medical-office-page.interface';
import { MedicalOffice, UpdateMedicalOffice } from '../interfaces/medical-office.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicalOfficeService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  constructor() { }

  getAllByUserId(userId: string | null, page: number):Observable<MedicalOfficePage> {

    if(userId === null) {
      userId = this.authService.currentUser()!.id;
    }
    
    const url = `${this.baseUrl}/api/users/${userId}/medical-offices?page=${page}`;
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

  getById(userId: string | null, medicalOfficeId: string):Observable<MedicalOffice> {
    
    if(userId === null) {
      userId = this.authService.currentUser()!.id;
    }

    const url = `${this.baseUrl}/api/users/${userId}/medical-offices/${medicalOfficeId}`;
    const headers = this.authService.getToken();

    return this.http.get<MedicalOffice>(url,  
      {
        headers
      }
    );
  }

  updateUserById(userId: string | null, medicalOfficeId: string, medicalOffice: UpdateMedicalOffice):Observable<MedicalOffice> {

    if(userId === null) {
      userId = this.authService.currentUser()!.id;
    }

    const url = `${this.baseUrl}/api/users/${userId}/medical-offices/${medicalOfficeId}`;
    const headers = this.authService.getToken();
    console.log(medicalOffice);
    return this.http.put<MedicalOffice>(url, medicalOffice,
      {
        headers
      }
    );
  }

  saveMedicalOffice(userId: string | null, updateMedicalOffice: UpdateMedicalOffice):Observable<MedicalOffice> {
    if(userId === null) {
      userId = this.authService.currentUser()!.id;
    }

    const headers = this.authService.getToken();
    const url = `${this.baseUrl}/api/users/${userId}/medical-offices`;
    return this.http.post<MedicalOffice>(url, updateMedicalOffice, {
      headers
    });
  }

  getFullData():Observable<MedicalOffice[]> {
    const url = `${this.baseUrl}/api/medical-offices/full-data`;
    const headers = this.authService.getToken();

    return this.http.get<MedicalOffice[]>(url,
      {
        headers
      }
    );
  }
}
