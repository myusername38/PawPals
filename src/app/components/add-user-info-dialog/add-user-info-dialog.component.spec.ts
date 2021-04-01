import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserInfoDialogComponent } from './add-user-info-dialog.component';

describe('AddUserInfoDialogComponent', () => {
  let component: AddUserInfoDialogComponent;
  let fixture: ComponentFixture<AddUserInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
