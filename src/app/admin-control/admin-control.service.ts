import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RecordsData } from '../models/records';
import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {

  viewEventEmmiter = new EventEmitter<boolean>();

  constructor(private http: HttpClient
  ) { }

  loaderView(view: boolean) {
    if (view) {
      return this.viewEventEmmiter.emit(true);
    }
    return this.viewEventEmmiter.emit(false);
  }

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

  updateControl(control: any) {
    return this.http.put(`${environment.API}relatorio/${control.id}`, control)
      .pipe(
        take(1)
      )
  }

  delete(id: string) {
    return this.http.delete(`${environment.API}relatorio/${id}`)
      .pipe(
        take(1)
      )
  }
}
