import { Component } from '@angular/core';
import { SslCertificateService, SSLInfo } from './ssl-certificate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  websiteUrl: string = '';
  sslInfo: SSLInfo | null = null;
  error: string | null = null;

  constructor(private sslCertificateService: SslCertificateService) {}

  fetchSSLInfo() {
    this.error = null; // Reset previous errors
    this.sslInfo = null; // Reset previous data
    
    if (this.websiteUrl.trim() === '') {
      this.error = 'Please enter a valid URL.';
      return;
    }

    this.sslCertificateService.getSSLCertificateDetails(this.websiteUrl)
      .subscribe({
        next: (data) => {
          this.sslInfo = data;
        },
        error: (err) => {
          this.error = 'Error fetching SSL certificate details. Please try again later.';
        }
      });
  }
}