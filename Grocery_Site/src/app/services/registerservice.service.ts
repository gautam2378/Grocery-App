import { Injectable } from '@angular/core';
import { Users } from '../Models/Users.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterserviceService {
  Url = "https://localhost:6700";
  
  constructor(private http: HttpClient) { } 

  addUser(addUserRequest: Users): Observable<Users> { 
    return this.http.post<Users>(this.Url + '/api/User/register', addUserRequest);
  }
  getAllUsers(): Observable<Users[]>
  {
    return this.http.get<Users[]>(this.Url + '/api/Product');

  }
  
  checkEmailExists(Email: string): Observable<boolean> {
    return this.http.get<boolean>(this.Url + '/api/User/CheckEmailExists?email=' + Email);
  }
}
