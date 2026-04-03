import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Diagnostic, DiagnosticDto } from '../interfaces/diagnostic.interface';
import { SKIP_LOADING } from '../../shared/interceptor/skip-loading.token';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  private url(studyId: string, suffix = ''): string {
    return `${this.baseUrl}/api/studies/${studyId}/diagnostic${suffix}`;
  }

  private get skipLoadingContext(): HttpContext {
    return new HttpContext().set(SKIP_LOADING, true);
  }

  getByStudyId(studyId: string): Observable<Diagnostic> {
    return this.http.get<Diagnostic>(this.url(studyId), {
      headers: this.authService.getHeaders(),
      context: this.skipLoadingContext,
    });
  }

  create(studyId: string, dto: DiagnosticDto): Observable<Diagnostic> {
    return this.http.post<Diagnostic>(this.url(studyId), dto, {
      headers: this.authService.getHeaders(),
      context: this.skipLoadingContext,
    });
  }

  update(studyId: string, dto: DiagnosticDto): Observable<Diagnostic> {
    return this.http.put<Diagnostic>(this.url(studyId), dto, {
      headers: this.authService.getHeaders(),
      context: this.skipLoadingContext,
    });
  }

  sign(studyId: string): Observable<Diagnostic> {
    return this.http.post<Diagnostic>(this.url(studyId, '/sign'), null, {
      headers: this.authService.getHeaders(),
      context: this.skipLoadingContext,
    });
  }

  complete(studyId: string): Observable<Diagnostic> {
    return this.http.post<Diagnostic>(this.url(studyId, '/complete'), null, {
      headers: this.authService.getHeaders(),
      context: this.skipLoadingContext,
    });
  }

  async openPdf(studyId: string): Promise<void> {
    const token = this.authService.getHeaders().get('Authorization') ?? '';
    const response = await fetch(this.url(studyId, '/pdf'), {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      throw new Error('PDF no disponible');
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  }
}
