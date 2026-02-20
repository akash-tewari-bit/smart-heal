import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeveloper } from './edit-developer';

describe('EditDeveloper', () => {
  let component: EditDeveloper;
  let fixture: ComponentFixture<EditDeveloper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDeveloper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeveloper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
