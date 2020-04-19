import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProfileRegisterPage } from './profile.page';

describe('ProfileRegisterPage', () => {
  let component: ProfileRegisterPage;
  let fixture: ComponentFixture<ProfileRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRegisterPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
