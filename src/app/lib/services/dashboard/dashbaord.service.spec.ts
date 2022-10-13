import { TestBed } from '@angular/core/testing';

import { DashbaordService } from './dashbaord.service';

describe('DashbaordService', () => {
  let service: DashbaordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashbaordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
