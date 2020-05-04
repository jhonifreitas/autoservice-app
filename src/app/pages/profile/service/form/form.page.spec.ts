import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProfileServiceFormPage } from './form.page';

describe('ProfileServiceFormPage', () => {
  let component: ProfileServiceFormPage;
  let fixture: ComponentFixture<ProfileServiceFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileServiceFormPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileServiceFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
