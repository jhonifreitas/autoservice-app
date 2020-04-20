import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AutonomousServiceFormPage } from './form.page';

describe('AutonomousServiceFormPage', () => {
  let component: AutonomousServiceFormPage;
  let fixture: ComponentFixture<AutonomousServiceFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutonomousServiceFormPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AutonomousServiceFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
