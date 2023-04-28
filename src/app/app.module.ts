import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAlertsComponent } from './product-alerts/product-alerts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { HttpClientModule } from '@angular/common/http';
import { ShippingComponent } from './shipping/shipping.component';
import { FilterTableComponent } from './filter-table/filter-table.component';
import { FilterWidgetComponent } from './filter-widget/filter-widget.component';
import { TemplateVariableTestComponent } from './template-variable-test/template-variable-test.component';
import { PlaygroundComponent } from './playground/playground.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    TableModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent },
      { path: 'products/:productId', component: ProductDetailsComponent},
      { path: 'cart', component: CartComponent},
      { path: 'shipping', component: ShippingComponent},
      { path: 'filterTable', component: FilterTableComponent},
      { path: 'templateVariable', component: TemplateVariableTestComponent},
      { path: 'playground', component: PlaygroundComponent},
    ])
  ],
  declarations: [
    TopBarComponent,
    AppComponent,
    ProductListComponent,
    ProductAlertsComponent,
    ProductDetailsComponent,
    CartComponent,
    ShippingComponent,
    FilterTableComponent,
    FilterWidgetComponent,
    TemplateVariableTestComponent,
    PlaygroundComponent,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/