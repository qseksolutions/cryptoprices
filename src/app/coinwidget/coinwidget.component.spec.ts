import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinwidgetComponent } from './coinwidget.component';

describe('CoinwidgetComponent', () => {
  let component: CoinwidgetComponent;
  let fixture: ComponentFixture<CoinwidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinwidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinwidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
