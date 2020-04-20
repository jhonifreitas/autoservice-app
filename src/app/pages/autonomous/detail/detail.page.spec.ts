import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutonomousDetailPage } from './detail.page';

describe('AutonomousDetailPage', () => {
  let component: AutonomousDetailPage;
  let fixture: ComponentFixture<AutonomousDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutonomousDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutonomousDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
