import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RecordsData } from '../models/records';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<RecordsData[]>(`${environment.API}relatorio`);
  }
}
