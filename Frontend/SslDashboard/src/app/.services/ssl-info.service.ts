import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SSLInfoService {
  //backend Endpoint url
  private apiUrl = 'https://localhost:5001/';

  constructor(private http: HttpClient) { }

  getHelloWorld(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}