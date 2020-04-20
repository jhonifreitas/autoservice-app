import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AutonomousFormPage } from './form.page';

describe('AutonomousFormPage', () => {
  let component: AutonomousFormPage;
  let fixture: ComponentFixture<AutonomousFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutonomousFormPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AutonomousFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
