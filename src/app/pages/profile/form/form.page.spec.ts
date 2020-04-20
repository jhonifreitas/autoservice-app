import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProfileFormPage } from './form.page';

describe('ProfileFormPage', () => {
  let component: ProfileFormPage;
  let fixture: ComponentFixture<ProfileFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFormPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
