import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmComponent } from './modal-confirm.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Import NO_ERRORS_SCHEMA

describe('ModalConfirmComponent', () => {
  let component: ModalConfirmComponent;
  let fixture: ComponentFixture<ModalConfirmComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ModalConfirmComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ModalConfirmComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'John Doe', title: 'Confirmação' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar os dados corretamente', () => {
    expect(component.name).toBe('John Doe');
    expect(component.title).toBe('Confirmação');
  });

  it('deve chamar close(false) ao executar CloseDialog', () => {
    component.CloseDialog();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});