import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public config: Config[];

  constructor(private http: HttpClient) {
    this.config = [];
    this.updateConfig();
  }

  public updateConfig(): Observable<Config[]> {
    const request = this.http.get<Config[]>(`${location.origin}/assets/config.json`);
    request.subscribe(c => this.config = c);

    return request;
  }

}
