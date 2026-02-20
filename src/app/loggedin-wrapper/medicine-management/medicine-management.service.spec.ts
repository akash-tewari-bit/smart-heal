import { TestBed } from '@angular/core/testing';

import { MedicineManagementService } from './medicine-management.service';

describe('MedicineManagementService', () => {
  let service: MedicineManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicineManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
