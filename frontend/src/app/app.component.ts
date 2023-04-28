import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  generateCV() {
    this.http.post('/api/generate_cv', {}).subscribe((response) => {
      console.log(response);
      // Update your PDF viewer component with the new PDF data
    });
  }
}
