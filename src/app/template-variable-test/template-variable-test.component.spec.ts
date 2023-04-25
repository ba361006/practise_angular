import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateVariableTestComponent } from './template-variable-test.component';

describe('TemplateVariableTestComponent', () => {
  let component: TemplateVariableTestComponent;
  let fixture: ComponentFixture<TemplateVariableTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateVariableTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateVariableTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
