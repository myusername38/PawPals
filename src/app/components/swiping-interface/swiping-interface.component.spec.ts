import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipingInterfaceComponent } from './swiping-interface.component';

describe('SwipingInterfaceComponent', () => {
  let component: SwipingInterfaceComponent;
  let fixture: ComponentFixture<SwipingInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwipingInterfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipingInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
