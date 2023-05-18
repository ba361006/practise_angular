import { TestBed } from '@angular/core/testing';

import { EchartsGraphicService } from './echarts-graphic.service';

describe('EchartsGraphicService', () => {
  let service: EchartsGraphicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EchartsGraphicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
