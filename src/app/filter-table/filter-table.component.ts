import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.css']
})
export class FilterTableComponent {
  cars = [
    {
      brand: 'Toyota',
      year: 10,
      color: 'blue',
      price: 100,
    },
    {
      brand: 'Benz',
      year: 3,
      color: 'black',
      price: 150,
    },
    {
      brand: 'KTR',
      year: 16,
      color: 'silver',
      price: 200,
    }
  ];
}
