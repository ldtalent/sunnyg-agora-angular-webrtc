import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { }

  public getRequest(url, params = {}) {
    return this.http.get(url, {params}).pipe(
      map(res => {
        return res;
      }),
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  public handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
