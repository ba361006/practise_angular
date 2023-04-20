import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// This line is necessary to fix a problem with some versions of Zone.js
declare const require: any;

// First, initialize the testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then, load all the .spec files in the application
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
