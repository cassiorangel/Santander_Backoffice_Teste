import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AdminControlService } from './admin-control/admin-control.service';
import { Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Import NO_ERRORS_SCHEMA
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let adminControlServiceMock: any;
  let viewEventSubject: Subject<boolean>;

  beforeEach(async () => {
    viewEventSubject = new Subject<boolean>();
    adminControlServiceMock = {
      viewEventEmmiter: viewEventSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
       schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AdminControlService, useValue: adminControlServiceMock }
      ],
      imports: [
        SharedModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o título corretamente', () => {
    expect(component.title).toBe('backoffice');
  });

  it('deve inicializar viewLoader como false', () => {
    expect(component.viewLoader).toBe(false);
  });

  it('deve atualizar viewLoader ao receber evento do AdminControlService', () => {
    viewEventSubject.next(true);
    expect(component.viewLoader).toBe(true);

    viewEventSubject.next(false);
    expect(component.viewLoader).toBe(false);
  });
});