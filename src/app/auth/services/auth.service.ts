import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { User, AuthStatus, LoginResponse } from '../interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.baseUrl;
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

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
    console.log(user, token, tokenType);
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    sessionStorage.setItem('token', token);
    return true;
  }

  logOut() {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    sessionStorage.removeItem('token');
  } 
}
