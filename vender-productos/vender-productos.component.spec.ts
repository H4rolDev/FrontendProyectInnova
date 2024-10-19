import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderProductosComponent } from './vender-productos.component';

describe('VenderProductosComponent', () => {
  let component: VenderProductosComponent;
  let fixture: ComponentFixture<VenderProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VenderProductosComponent]
    });
    fixture = TestBed.createComponent(VenderProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
