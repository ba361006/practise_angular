import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableModule } from 'primeng/table';
import { FilterTableComponent } from './filter-table.component';
import { FilterWidgetComponent } from '../filter-widget/filter-widget.component';

describe('FilterTableComponent', () => {
  let component: FilterTableComponent;
  let fixture: ComponentFixture<FilterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableModule],
      // adding FilterWidgetComponent to declarations can solve this problem issued from karma
      // Error: NG0304: 'app-filter-widget' is not a known element 
      declarations: [ FilterTableComponent, FilterWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
