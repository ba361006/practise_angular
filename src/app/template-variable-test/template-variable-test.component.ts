import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-template-variable-test',
  templateUrl: './template-variable-test.component.html',
  styleUrls: ['./template-variable-test.component.css']
})
export class TemplateVariableTestComponent {
  TColumns = [
    {column: 'TColumn content 0'},
    {column: 'TColumn content 1'},
    {column: 'TColumn content 2'},
  ]
  
  TValues = [
    {value: 'Toyota'},
    {value: 'Benz'},
    {value: 'KTR',},
  ];

  columns = [
    {column: 'column content 0'},
    {column: 'column content 1'},
    {column: 'column content 2'},
  ]
  
  values = [
    {value: 'Toyota'},
    {value: 'Benz'},
    {value: 'KTR',},
  ];
}
