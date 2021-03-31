import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDogDialogComponent } from './add-dog-dialog.component';

describe('AddDogDialogComponent', () => {
  let component: AddDogDialogComponent;
  let fixture: ComponentFixture<AddDogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDogDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
