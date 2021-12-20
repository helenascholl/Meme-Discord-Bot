import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public config: Config[];
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.config = [];
    this.baseUrl = environment.production
      ? 'http://127.0.0.1'
      : 'http://localhost:4200';

    this.updateConfig();
  }

  public updateConfig(): Observable<Config[]> {
    const request = this.http.get<Config[]>(`${this.baseUrl}/assets/config.json`);
    request.subscribe(c => this.config = c);

    return request;
  }

}
