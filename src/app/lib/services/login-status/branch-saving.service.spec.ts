import { TestBed } from '@angular/core/testing';

import { BranchSavingService } from './branch-saving.service';

describe('BranchSavingService', () => {
  let service: BranchSavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchSavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
