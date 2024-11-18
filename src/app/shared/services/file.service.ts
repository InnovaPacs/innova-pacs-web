import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { PacsFile } from '../interfaces/file.interface';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() { }

  save(file: File):Observable<PacsFile> {
    const headers = this.authService.getHeaders();
    const url = `${this.baseUrl}/api/files/upload`;

    const formData = new FormData();
      formData.append('file', file);

    return this.http.post<PacsFile>(url, formData, {
      headers
    });
  }
}
