import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, finalize, tap, throwError } from "rxjs";
import { LoadingService } from "../services/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private hasError = false;
  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showLoading();
    this.hasError = false

    return next.handle(req).pipe(
      catchError((error) => {
        this.hasError = true; 
        console.log(error);
        this.loadingService.showErrorMessage('An error occurred: ' + (error?.error?.message || 'Unknown error'));
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