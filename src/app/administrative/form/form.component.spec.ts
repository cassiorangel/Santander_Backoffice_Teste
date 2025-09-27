import { of, throwError, Subject } from 'rxjs';
import { FormComponent } from './form.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('FormComponent', () => {
  let component: FormComponent;
  let adminControlServiceMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(() => {
    adminControlServiceMock = {
      getStatus: jasmine.createSpy('getStatus').and.returnValue(of([{ id: 1, name: 'Verde' }])),
      loadById: jasmine.createSpy('loadById').and.returnValue(of({
        id: 1, name: 'Test', area: 'TI', farol: [{ id: 1, name: 'Verde' }], porcentagem: 10
      })),
      updateControl: jasmine.createSpy('updateControl').and.returnValue(of({ name: 'Atualizado' })),
      createControl: jasmine.createSpy('createControl').and.returnValue(of({ name: 'Criado' })),
      loaderView: jasmine.createSpy('loaderView'),
      openSnackBar: jasmine.createSpy('openSnackBar')
    };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = { snapshot: { params: {} } };

    component = new FormComponent(routerMock, adminControlServiceMock, routeMock);
    // Para evitar erro de undefined
    (component as any).destroy$ = new Subject<void>();
    spyOn(component, 'updateForm').and.callThrough();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('deve criar o componente e inicializar o formulário', () => {
    expect(component).toBeTruthy();
    expect(component.reactiveForm instanceof FormGroup).toBeTrue();
    expect(adminControlServiceMock.getStatus).toHaveBeenCalled();
  });

  describe('dadosRelatorio', () => {
    it('deve buscar status e setar farol quando não há id na rota', () => {
      component.dadosRelatorio();
      expect(adminControlServiceMock.getStatus).toHaveBeenCalled();
      expect(component.farol).toEqual([{ id: 1, name: 'Verde' }]);
      expect(component.acao).toBeFalse();
      expect(adminControlServiceMock.loadById).not.toHaveBeenCalled();
    });

    it('deve buscar status e registro quando há id na rota', () => {
      routeMock.snapshot.params['id'] = 123;
      component.dadosRelatorio();
      expect(adminControlServiceMock.getStatus).toHaveBeenCalled();
      expect(adminControlServiceMock.loadById).toHaveBeenCalledWith(123);
      expect(component.acao).toBeTrue();
      expect(component.updateForm).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1, name: 'Test' }));
    });

    it('deve tratar erro ao buscar status', () => {
      adminControlServiceMock.getStatus.and.returnValue(throwError(() => new Error('erro')));
      spyOn(console, 'log');
      component.dadosRelatorio();
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
    });

    it('deve tratar erro ao buscar registro por id', () => {
      routeMock.snapshot.params['id'] = 123;
      adminControlServiceMock.loadById.and.returnValue(throwError(() => new Error('erro2')));
      spyOn(console, 'log');
      component.dadosRelatorio();
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
    });
  });



  it('deve navegar para /relatorio ao chamar goBack', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/relatorio']);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.farol = [{ id: 1, name: 'Verde' }];
      component.reactiveForm.setValue({
        id: 1, name: 'Test', area: 'TI', farol: 1, porcentagem: 10
      });
    });

    it('deve atualizar registro se acao for true', () => {
      component.acao = true;
      component.onSubmit();
      expect(adminControlServiceMock.updateControl).toHaveBeenCalled();
      expect(adminControlServiceMock.openSnackBar).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/relatorio']);
    });

    it('deve criar registro se acao for false', () => {
      component.acao = false;
      component.onSubmit();
      expect(adminControlServiceMock.createControl).toHaveBeenCalled();
      expect(adminControlServiceMock.openSnackBar).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/relatorio']);
    });

    it('deve tratar erro ao atualizar registro', () => {
      component.acao = true;
      adminControlServiceMock.updateControl.and.returnValue(throwError(() => new Error('erro')));
      spyOn(console, 'log');
      component.onSubmit();
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
    });

    it('deve tratar erro ao criar registro', () => {
      component.acao = false;
      adminControlServiceMock.createControl.and.returnValue(throwError(() => new Error('erro')));
      spyOn(console, 'log');
      component.onSubmit();
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
    });
  });

  describe('montaObj', () => {
    beforeEach(() => {
      component.farol = [{ id: 1, name: 'Verde' }];
      component.reactiveForm.setValue({
        id: 1, name: 'Test', area: 'TI', farol: 1, porcentagem: 10
      });
    });

    it('deve retornar objeto com id se acao for true', () => {
      component.acao = true;
      const obj = component.montaObj(component.reactiveForm.value);
      expect(obj.id).toBe(1);
      expect(obj.farol[0].name).toBe('verde');
    });

    it('deve retornar objeto sem id se acao for false', () => {
      component.acao = false;
      const obj = component.montaObj(component.reactiveForm.value);
      expect(obj.id).toBeUndefined();
      expect(obj.farol[0].name).toBe('verde');
    });
  });

  it('deve completar o destroy$ ao destruir o componente', () => {
    const destroy$ = (component as any).destroy$;
    spyOn(destroy$, 'next');
    spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroy$.next).toHaveBeenCalled();
    expect(destroy$.complete).toHaveBeenCalled();
  });
});