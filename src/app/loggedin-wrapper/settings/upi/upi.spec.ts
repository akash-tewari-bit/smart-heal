import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UPI } from './upi';

describe('UPI', () => {
  let component: UPI;
  let fixture: ComponentFixture<UPI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UPI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UPI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
