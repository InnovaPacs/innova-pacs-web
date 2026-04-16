import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { EMPTY, Observable, catchError, finalize, throwError } from "rxjs";
import { LoadingService } from "../services/loading.service";
import { Router } from "@angular/router";
import { SKIP_LOADING } from "./skip-loading.token";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoading = req.context.get(SKIP_LOADING);

    if (!skipLoading) {
      this.activeRequests++;
      if (this.activeRequests === 1) {
        this.loadingService.showLoading();
      }
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error?.error?.message === 'USERNAME_IS_ALREADY_TAKE' || error?.error?.message === 'EMAIL_IS_ALREADY_TAKE') {
          this.loadingService.showErrorMessage('Nombre de usuario ó email ya están registrados');
          return EMPTY;
        }

        if (error?.error?.message === 'Bad credentials') {
          this.loadingService.showErrorMessage('Error en la autenticación');
          return EMPTY;
        }

        if (error?.error?.message === 'MEDICAL_OFFICE_NOT_FOUND') {
          this.router.navigate(['/medical-offices/register']);
          this.loadingService.showErrorMessage('Antes de continuar, registra los datos de tu consultorio');
          return EMPTY;
        }

        this.loadingService.showErrorMessage('Ha ocurrido un error: ' + (error?.error?.message || 'Unknown error'));
        return throwError(() => error);
      }),
      finalize(() => {
        if (!skipLoading) {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loadingService.hideLoading();
          }
        }
      })
    );
  }
}
