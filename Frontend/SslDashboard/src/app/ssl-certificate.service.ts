import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SSLInfo {
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  certificate: string;
}

@Injectable({
  providedIn: 'root',
})
export class SslCertificateService {
  private apiUrl = 'http://localhost:5000/api/ssl';  // Update to match your ASP.NET Core server

  constructor(private http: HttpClient) {}

  getSSLCertificateDetails(url: string): Observable<SSLInfo> {
    const encodedUrl = encodeURIComponent(url); // Encode the URL before sending
    return this.http.get<SSLInfo>(`${this.apiUrl}/${encodedUrl}`);
  }
}
