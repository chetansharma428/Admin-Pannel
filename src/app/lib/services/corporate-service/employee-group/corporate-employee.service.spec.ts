import { TestBed } from '@angular/core/testing';

import { CorporateEmployeeService } from './corporate-employee.service';

describe('CorporateEmployeeService', () => {
  let service: CorporateEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorporateEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
