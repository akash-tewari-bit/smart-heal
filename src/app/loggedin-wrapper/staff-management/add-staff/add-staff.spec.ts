import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaff } from './add-staff';

describe('AddStaff', () => {
  let component: AddStaff;
  let fixture: ComponentFixture<AddStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddStaff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStaff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
