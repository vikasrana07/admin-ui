import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url: string;
  constructor(public httpClient: HttpClient) {
    this.url = environment.apiUrl;
  }

  post(apiRoute: string, body: any) {
    return this.httpClient.post(`${this.url + apiRoute}`, body, { headers: this.getHttpHeaders() });
  }

  get(apiRoute: string): Observable<any> {
    return this.httpClient.get(`${this.url + apiRoute}`, { headers: this.getHttpHeaders() });
  }

  put(apiRoute: string, body: any) {
    return this.httpClient.put(`${this.url + apiRoute}`, body, { headers: this.getHttpHeaders() });
  }

  delete(apiRoute: string) {
    return this.httpClient.delete(`${this.url + apiRoute}`, { headers: this.getHttpHeaders() });
  }

  getHttpHeaders(): HttpHeaders {
    return new HttpHeaders().set('key', 'value');
  }
}