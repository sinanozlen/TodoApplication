import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../common/services/generic-http.service';
import { LoginResponseModel } from '../models/login-response.model';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _http: GenericHttpService) {}

  login(model: LoginModel): Observable<LoginResponseModel> {
    return this._http.post<LoginResponseModel>("auth/login", model);
  }

  register(model: RegisterModel): Observable<LoginResponseModel> {
    return this._http.post<LoginResponseModel>("auth/register", model);
  }

  deleteUser(id: string): Observable<any> {
    return this._http.delete(`auth/user/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this._http.get<any[]>("auth/users");
  }
}
