import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEventosComponent } from './registro-eventos.component';

describe('RegistroEventosComponent', () => {
  let component: RegistroEventosComponent;
  let fixture: ComponentFixture<RegistroEventosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEventosComponent]
    });
    fixture = TestBed.createComponent(RegistroEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
