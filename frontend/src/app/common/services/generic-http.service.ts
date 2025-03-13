import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {
  api: string = "http://localhost:5000/api";
  
  // options nesnesini responseType ve observe özellikleriyle tanımlıyoruz.
  options: { observe: 'body'; responseType: 'json' } = { 
    observe: 'body', 
    responseType: 'json' 
  };

  constructor(    
    private _http: HttpClient,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService
  ) { }

  get<T>(api: string): Observable<T> {
    this._spinner.show();
    return this._http.get<T>(`${this.api}/${api}`, this.options).pipe(
      tap(() => this._spinner.hide()),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this._toastr.error(err.error.message);
        this._spinner.hide();
        return throwError(err);
      })
    );
  }

  post<T>(api: string, model: any): Observable<T> {
    this._spinner.show();
    return this._http.post<T>(`${this.api}/${api}`, model, this.options).pipe(
      tap(() => this._spinner.hide()),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this._toastr.error(err.error.message);
        this._spinner.hide();
        return throwError(err);
      })
    );
  }

  delete<T>(api: string): Observable<T> {
    this._spinner.show();
    return this._http.delete<T>(`${this.api}/${api}`, this.options).pipe(
      tap(() => this._spinner.hide()),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this._toastr.error(err.error.message);
        this._spinner.hide();
        return throwError(err);
      })
    );
  }
}
