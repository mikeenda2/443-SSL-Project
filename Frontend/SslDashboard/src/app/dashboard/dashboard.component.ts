import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { SSLInfoService } from '../.services/ssl-info.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent {
  helloWorldMessage: string | undefined;

  constructor(private sslInfoService: SSLInfoService) { }

  fetchHelloWorld(): void {
    this.sslInfoService.getHelloWorld().subscribe(
      (response) => {
        this.helloWorldMessage = response;
      },
      (error) => {
        console.error('Error fetching Hello World message:', error);
      }
    );
  }
}

