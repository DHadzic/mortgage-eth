import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageCreateComponent } from './mortgage-create.component';

describe('MortgageCreateComponent', () => {
  let component: MortgageCreateComponent;
  let fixture: ComponentFixture<MortgageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgageCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
