import { Component } from '@angular/core';

import { products } from '../products';

// html/css can access properties under the class that specifies the templateUrl/styleUrls to it
// and the html can use the tag 

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = products;
  hello = {name:'hi'};
  share() {
    window.alert('The product has been shared!');
  }

  onNotify() {
    window.alert("You will be notified when the product goes on sale");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/