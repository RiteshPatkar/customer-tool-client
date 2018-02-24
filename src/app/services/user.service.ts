import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../data/index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class UserService {

  private url = 'http://localhost:8080/register/'; //URL to API

    constructor(private http: HttpClient) { }

    // getAll() {
    //     return this.http.get<User[]>('/api/users');
    // }
    //
    // getById(id: number) {
    //     return this.http.get('/api/users/' + id);
    // }

    create(user: User) : Observable<any>  {
        return this.http.post(this.url, user);
    }

    // update(user: User) {
    //     return this.http.put('/api/users/' + user.userId, user);
    // }
    //
    // delete(id: number) {
    //     return this.http.delete('/api/users/' + id);
    // }
}
