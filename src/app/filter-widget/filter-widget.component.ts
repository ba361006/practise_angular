// import { Component, Input } from '@angular/core';
// import { IHeaderFilter } from '../filter-table/filter-table.component';

// @Component({
//   selector: 'app-filter-widget',
//   templateUrl: './filter-widget.component.html',
//   styleUrls: ['./filter-widget.component.css']
// })
// export class FilterWidgetComponent{
//   @Input() headerFilters!: IHeaderFilter[]
// }

import { Component, Input } from '@angular/core';
import { IHeaderFilter } from '../filter-table/filter-table.component';

@Component({
  selector: 'app-filter-widget',
  templateUrl: './filter-widget.component.html',
  styleUrls: ['./filter-widget.component.css']
})
export class FilterWidgetComponent {
  @Input() headerFilters!: IHeaderFilter[];

  public headerFiltersTemplate: any;
}
