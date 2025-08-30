import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedinWrapper } from './loggedin-wrapper';

describe('LoggedinWrapper', () => {
  let component: LoggedinWrapper;
  let fixture: ComponentFixture<LoggedinWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoggedinWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedinWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
