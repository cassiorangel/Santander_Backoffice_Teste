import { TestBed } from '@angular/core/testing';
import { AdminControlService } from './admin-control.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('AdminControlService', () => {
  let service: AdminControlService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        AdminControlService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(AdminControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true on viewEventEmmiter when loaderView(true) is called', () => {
    spyOn(service.viewEventEmmiter, 'emit');
    service.loaderView(true);
    expect(service.viewEventEmmiter.emit).toHaveBeenCalledWith(true);
  });

  it('should emit false on viewEventEmmiter when loaderView(false) is called', () => {
    spyOn(service.viewEventEmmiter, 'emit');
    service.loaderView(false);
    expect(service.viewEventEmmiter.emit).toHaveBeenCalledWith(false);
  });

  it('should call http.get in getAll', () => {
    httpClientSpy.get.and.returnValue(of([]));
    service.getAll().subscribe();
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.API}relatorio`);
  });

  it('should call http.get in loadById', () => {
    httpClientSpy.get.and.returnValue(of({}));
    service.loadById('123').subscribe();
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.API}relatorio/123`);
  });

  it('should call http.get in getStatus', () => {
    httpClientSpy.get.and.returnValue(of([]));
    service.getStatus().subscribe();
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.API}status`);
  });

  it('should call http.post in createControl', () => {
    httpClientSpy.post.and.returnValue(of({}));
    const control = { foo: 'bar' };
    service.createControl(control).subscribe();
    expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.API}relatorio`, control);
  });

  it('should call http.put in updateControl', () => {
    httpClientSpy.put.and.returnValue(of({}));
    const control = { id: 'abc', foo: 'bar' };
    service.updateControl(control).subscribe();
    expect(httpClientSpy.put).toHaveBeenCalledWith(`${environment.API}relatorio/abc`, control);
  });

  it('should call http.delete in delete', () => {
    httpClientSpy.delete.and.returnValue(of({}));
    service.delete('xyz').subscribe();
    expect(httpClientSpy.delete).toHaveBeenCalledWith(`${environment.API}relatorio/xyz`);
  });

  it('should call snackBar.open in openSnackBar', () => {
    service.openSnackBar('msg', 'ok', 'my-class', 3000);
    expect(snackBarSpy.open).toHaveBeenCalledWith('msg', 'ok', {
      duration: 3000,
      panelClass: ['my-class']
    });
  });
});