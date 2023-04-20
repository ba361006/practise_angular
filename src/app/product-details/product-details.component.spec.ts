import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ProductDetailsComponent } from './product-details.component';
import { ActivatedRoute } from '@angular/router';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports tells angular to provide a mock implementation of the HttpClient service
      // that components or services depend on
      // for example, CartService at product-details.component.ts requires HttpClient
      // this can solve the problem issued from karma
      // NullInjectorError: No provider for HttpClient!
      imports: [HttpClientTestingModule],

      // providers injects the implementation to an object
      // for example, it will always get '1' if any invokes ActivatedRoute.snapshot.paramMap.get
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {snapshot:{paramMap: {get: (key:string) => '1'}}}
        },
      ],
      declarations: [ ProductDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have h2', () => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });
});
