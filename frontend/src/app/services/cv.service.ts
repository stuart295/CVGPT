import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  private API_URL = 'http://localhost:5001/api/generate_cv';

  constructor(private httpClient: HttpClient) {}

  generateCv(cvData: any): Observable<any> {
    return this.httpClient.post<any>(this.API_URL, cvData);
  }
}
