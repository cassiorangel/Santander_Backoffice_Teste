import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RecordsData } from '../models/records';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<RecordsData[]>(`${environment.API}relatorio`);
  }

  loadById(id: string) {
    return this.http.get(`${environment.API}relatorio/${id}`)
      .pipe(
        take(1)
      )
  }

  getStatus() {
    return this.http.get<RecordsData[]>(`${environment.API}status`);
  }

  createControl(control: any) {
    return this.http.post(`${environment.API}relatorio`, control).pipe(
      take(1)
    )
  }

}
