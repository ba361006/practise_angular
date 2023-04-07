import { Component, Input } from '@angular/core';
import { ColumnFilter } from 'primeng/table';

@Component({
  selector: 'app-filter-widget',
  templateUrl: './filter-widget.component.html',
  styleUrls: ['./filter-widget.component.css']
})
export class FilterWidgetComponent extends ColumnFilter{
}