import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ForgotPage } from './forgot.page';

describe('ForgotPage', () => {
  let component: ForgotPage;
  let fixture: ComponentFixture<ForgotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
