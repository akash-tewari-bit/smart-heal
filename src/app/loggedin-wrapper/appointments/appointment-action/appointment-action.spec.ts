import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAction } from './appointment-action';

describe('AppointmentAction', () => {
  let component: AppointmentAction;
  let fixture: ComponentFixture<AppointmentAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
