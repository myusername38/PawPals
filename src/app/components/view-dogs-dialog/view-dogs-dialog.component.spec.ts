import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDogsDialogComponent } from './view-dogs-dialog.component';

describe('ViewDogsDialogComponent', () => {
  let component: ViewDogsDialogComponent;
  let fixture: ComponentFixture<ViewDogsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDogsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDogsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
