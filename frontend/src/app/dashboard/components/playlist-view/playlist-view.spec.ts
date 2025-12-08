import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistView } from './playlist-view';

describe('PlaylistView', () => {
  let component: PlaylistView;
  let fixture: ComponentFixture<PlaylistView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
