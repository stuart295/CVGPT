import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  private API_URL = 'http://localhost:5001/api/generate_cv';
  public pdfBlob: Blob | null = null;
  public pdfGenerated: Subject<void> = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  generateCv(cvData: any): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = {
      headers,
      responseType: 'blob' as 'json',
    };

    return this.httpClient
      .post<Blob>(this.API_URL, cvData, { ...options, observe: 'response' })
      .pipe(
        tap((response: HttpResponse<Blob>) => {
          if (response.body) {
            this.pdfBlob = new Blob([response.body], { type: 'application/pdf' });
            this.pdfGenerated.next();
          }
        })
      );
  }
}
