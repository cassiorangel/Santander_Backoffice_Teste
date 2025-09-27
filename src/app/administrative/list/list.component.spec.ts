import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { AdminControlService } from 'src/app/admin-control/admin-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, Subject, throwError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Import NO_ERRORS_SCHEMA
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let adminControlServiceMock: any;
  let routerMock: any;
  let routeMock: any;
  let matDialogMock: any;
  let matDialogRefMock: any;

  beforeEach(async () => {
    adminControlServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of([{ id: 1, name: 'Test', area: 'TI', porcentagem: 10, farol: [{ id: 1, name:'Verde'}] }])),
      delete: jasmine.createSpy('delete').and.returnValue(of({ name: 'Test' })),
      loaderView: jasmine.createSpy('loaderView'),
      openSnackBar: jasmine.createSpy('openSnackBar')
    };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = { snapshot: { params: {} } };
    matDialogRefMock = {
      afterClosed: () => of(true)
    };
    matDialogMock = {
      open: jasmine.createSpy('open').and.returnValue(matDialogRefMock)
    };

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        { provide: AdminControlService, useValue: adminControlServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: MatDialog, useValue: matDialogMock }
      ],
       schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    // Mock paginator and sort
    component.paginator = {
      _intl: {
        itemsPerPageLabel: '',
        nextPageLabel: '',
        previousPageLabel: ''
      }
    } as any;
    component.sort = {} as any;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('listRegistros', () => {


    it('deve tratar erro ao buscar registros', () => {
      adminControlServiceMock.getAll.and.returnValue(throwError(() => new Error('erro')));
      spyOn(window, 'alert');
      component.listRegistros();
      expect(window.alert).toHaveBeenCalledWith('algo errado');
    });
  });

  describe('applyFilter', () => {
    beforeEach(() => {
      let obj: any = [{ id: 1, name: 'Test', area: 'TI', porcentagem: 10, farol: [{ id: 1, name:'Verde'}] }] 
      component.dataSource = new MatTableDataSource(obj);
      spyOn(component, 'filtroData');
    });

    it('deve aplicar filtro e chamar filtroData', () => {
      component.applyFilter('Test');
      expect(component.dataSource.filter).toBe('test');
      expect(component.filtroData).toHaveBeenCalledWith(component.dataSource.filteredData);
    });
  });

  describe('filtroData', () => {
    it('deve setar viewData para true se data vazio', () => {
      component.filtroData([]);
      expect(component.viewData).toBeTrue();
    });

    it('deve setar viewData para false se data não vazio', () => {
      component.filtroData([1]);
      expect(component.viewData).toBeFalse();
    });
  });

  it('deve navegar para editar ao chamar onEdit', () => {
    component.onEdit('123');
    expect(adminControlServiceMock.loaderView).toHaveBeenCalledWith(true);
    expect(routerMock.navigate).toHaveBeenCalledWith(['editar', '123'], { relativeTo: routeMock });
  });

  describe('onDelete', () => {
    it('deve abrir o dialog e chamar onDeleteControl se confirmado', () => {
      spyOn(component, 'onDeleteControl');
      component.onDelete({ id: '1', name: 'Test' });
      expect(matDialogMock.open).toHaveBeenCalled();
      expect(component.onDeleteControl).toHaveBeenCalledWith('1');
    });
  });

  describe('onDeleteControl', () => {
    it('deve deletar registro e atualizar lista', () => {
      spyOn(component, 'listRegistros');
      component.onDeleteControl('1');
      expect(adminControlServiceMock.delete).toHaveBeenCalledWith('1');
      expect(adminControlServiceMock.openSnackBar).toHaveBeenCalled();
      expect(component.listRegistros).toHaveBeenCalled();
    });

    it('deve tratar erro ao deletar', () => {
      adminControlServiceMock.delete.and.returnValue(throwError(() => new Error('erro')));
      spyOn(console, 'log');
      component.onDeleteControl('1');
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
    });
  });

  it('deve completar destroy$ ao destruir o componente', () => {
    const destroy$ = (component as any).destroy$;
    spyOn(destroy$, 'next');
    spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroy$.next).toHaveBeenCalled();
    expect(destroy$.complete).toHaveBeenCalled();
  });
});