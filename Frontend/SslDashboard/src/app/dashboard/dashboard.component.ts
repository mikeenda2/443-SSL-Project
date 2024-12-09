import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SSLInfoService } from '../.services/ssl-info.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf, FormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  sslInfo: Record<string, any> | undefined;
  sslInfoArray: { key: string; value: any }[] = [];
  inputUrl: string = '';

  constructor(private sslInfoService: SSLInfoService, private datePipe: DatePipe) { }

  getWebsiteCertificate(): void {
    if (!this.inputUrl) {
      alert('Please enter a valid URL.');
      return;
    }
    this.sslInfoService.getWebsiteCertificate(this.inputUrl).subscribe(
      (response) => {
        if (typeof response === 'string') {
          this.sslInfo = JSON.parse(response);
        } else {
          this.sslInfo = response;
        }
        if (this.sslInfo) {
          this.sslInfoArray = Object.entries(this.sslInfo).map(([key, value]) => {
            if (key === 'ExpirationDate') {
              // Format the ExpirationDate
              value = this.datePipe.transform(value, 'MMM d, y, h:mm:ss a');
            }
            return { key, value };
          });
        }
      },
      (error) => {
        console.error('Error fetching SSL info:', error);
        alert('Failed to fetch SSL information. Please try again.');
      }
    );
  }
}
