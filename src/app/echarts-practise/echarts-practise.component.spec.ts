import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsPractiseComponent } from './echarts-practise.component';

describe('EchartsPractiseComponent', () => {
  let component: EchartsPractiseComponent;
  let fixture: ComponentFixture<EchartsPractiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EchartsPractiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchartsPractiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
