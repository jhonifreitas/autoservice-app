import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutonomousServicePage } from './list.page';

describe('AutonomousServicePage', () => {
  let component: AutonomousServicePage;
  let fixture: ComponentFixture<AutonomousServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutonomousServicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutonomousServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
