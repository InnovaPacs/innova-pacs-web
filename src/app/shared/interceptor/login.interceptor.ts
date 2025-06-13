import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { EMPTY, Observable, catchError, finalize, tap, throwError } from "rxjs";
import { LoadingService } from "../services/loading.service";
import { Router } from "@angular/router";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private hasError = false;
  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showLoading();
    this.hasError = false

    return next.handle(req).pipe(
      catchError((error) => {
        this.hasError = true; 

        if (error?.error?.message === 'MEDICAL_OFFICE_NOT_FOUND') {
          this.router.navigate(['/medical-offices/register']);
          this.loadingService.showErrorMessage('Antes de continuar, registra los datos de tu consultorio');
          return EMPTY;
        }

        this.loadingService.showErrorMessage('A ocurrido un error: ' + (error?.error?.message || 'Unknown error'));
        return throwError(() => error);
      }),
      tap(() => {
        if (this.hasError) {
          return;
        }
      }),
      finalize(() => {
        if (!this.hasError) {
          this.loadingService.hideLoading();
        }
      })
    );
  }
}