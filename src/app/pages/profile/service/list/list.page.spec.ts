import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileServicePage } from './list.page';

describe('ProfileServicePage', () => {
  let component: ProfileServicePage;
  let fixture: ComponentFixture<ProfileServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileServicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
