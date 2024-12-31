import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { User, AuthStatus, LoginResponse } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.baseUrl;
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private _medicalOfficeSelected = signal<boolean>(false);

  public currentUser = computed(this._currentUser);
  public authStatus = computed(this._authStatus);

  private http = inject(HttpClient);
  
  constructor() { }

  login(username: string, password: string):Observable<boolean> {
    const url = `${this.baseUrl}/api/auth/login`;
    const body = { username, password };

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map(({ user, accessToken, tokenType}) => this.setAuthentication(user, accessToken, tokenType)),
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }

  private setAuthentication(user: User, token: string, tokenType: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    sessionStorage.setItem('token', token);
    return true;
  }

  logOut() {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._medicalOfficeSelected.set(false)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('medical-office-id-selected');
  }
  
  getToken(): HttpHeaders {
    return new HttpHeaders()
    .set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
  }

  selectMedicalOffice(medicalOfficeId: string) {
    sessionStorage.setItem('medical-office-id-selected', medicalOfficeId);
    this._medicalOfficeSelected.set(true);
  }

  discardMedicalOffice() {
    sessionStorage.removeItem('medical-office-id-selected');
    this._medicalOfficeSelected.set(false);
  }

  get getMedicalOfficeStatus() {
    return this._medicalOfficeSelected;
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('token') || ''}`,
      'X-MEDICAL-OFFICE-ID': `${sessionStorage.getItem('medical-office-id-selected') || ''}`,
    });
  }
}
