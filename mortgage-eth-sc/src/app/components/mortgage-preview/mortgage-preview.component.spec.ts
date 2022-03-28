import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgagePreviewComponent } from './mortgage-preview.component';

describe('MortgagePreviewComponent', () => {
  let component: MortgagePreviewComponent;
  let fixture: ComponentFixture<MortgagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgagePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
