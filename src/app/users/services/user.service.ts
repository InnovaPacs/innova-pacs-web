import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { UpdateUser, User } from '../interfaces/user.interface';
import { UserPage } from '../interfaces/user-page.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  constructor() { }

  getAll(page: number):Observable<UserPage> {
    const url = `${this.baseUrl}/api/users?page=${page}`;
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

  getById(id: string):Observable<User> {
    const url = `${this.baseUrl}/api/users/${id}`;
    const headers = this.authService.getToken();

    return this.http.get<User>(url,  
      {
        headers
      }
    );
  }

  updateUserById(id: string, user: UpdateUser):Observable<User> {
    const url = `${this.baseUrl}/api/users/${id}`;
    const headers = this.authService.getToken();

    return this.http.put<User>(url, user,
      {
        headers
      }
    );
  }

  saveUser(user: UpdateUser):Observable<User> {
    const headers = this.authService.getToken();

    const url = `${this.baseUrl}/api/users`;
    return this.http.post<User>(url, user, {
      headers
    });
  }
}
