import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedUsersComponent } from './liked-users.component';

describe('LikedUsersComponent', () => {
  let component: LikedUsersComponent;
  let fixture: ComponentFixture<LikedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikedUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
