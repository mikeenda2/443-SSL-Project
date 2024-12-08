import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SSLInfoService {
  private apiUrl = 'https://localhost:5001/';

  constructor(private http: HttpClient) { }

  getWebsiteCertificate(url: string): Observable<string> {
    const encodedUrl = encodeURIComponent('https://' + url);
    return this.http.get(this.apiUrl + 'api/SSL/' + encodedUrl, { responseType: 'text' });
  }
}