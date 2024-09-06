import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, finalize } from "rxjs";
import { LoadingService } from "../services/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showLoading();

    return next.handle(req).pipe(
      finalize(() => this.loadingService.hideLoading())
    );
  }
}