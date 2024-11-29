import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { PacsConfigurationPage } from '../interfaces/pacs-configuration-page.interface';
import { PacsConfiguration, UpdatePacsConfiguration } from '../interfaces/pacs-configuration.interface';

@Injectable({
  providedIn: 'root'
})
export class PacsConfigurationService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  constructor() { }

  getAll(page: number):Observable<PacsConfigurationPage> {
    const url = `${this.baseUrl}/api/pacs-configurations?page=${page}`;
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

  getById(medicalOfficeId: string):Observable<PacsConfiguration> {
    const url = `${this.baseUrl}/api/pacs-configurations/${medicalOfficeId}`;
    const headers = this.authService.getHeaders();

    return this.http.get<PacsConfiguration>(url,  
      {
        headers
      }
    );
  }

  update(id: string, bodyRequest: UpdatePacsConfiguration):Observable<PacsConfiguration> {
    const url = `${this.baseUrl}/api/pacs-configurations/${id}`;
    const headers = this.authService.getHeaders();
    
    return this.http.put<PacsConfiguration>(url, bodyRequest,
      {
        headers
      }
    );
  }

  save(bodyRequest: UpdatePacsConfiguration):Observable<PacsConfiguration> {
    console.log('bodyRequest: ', bodyRequest);
    const headers = this.authService.getHeaders();
    const url = `${this.baseUrl}/api/pacs-configurations`;

    return this.http.post<PacsConfiguration>(url, bodyRequest, {
      headers
    });
  }

  getFullData():Observable<PacsConfiguration[]> {
    const url = `${this.baseUrl}/api/pacs-configurations/full-data`;
    const headers = this.authService.getHeaders();

    return this.http.get<PacsConfiguration[]>(url,
      {
        headers
      }
    );
  }
}
