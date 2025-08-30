import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoader } from './custom-loader';

describe('CustomLoader', () => {
  let component: CustomLoader;
  let fixture: ComponentFixture<CustomLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
