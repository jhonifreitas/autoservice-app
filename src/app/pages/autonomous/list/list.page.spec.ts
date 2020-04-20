import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutonomousPage } from './list.page';

describe('AutonomousPage', () => {
  let component: AutonomousPage;
  let fixture: ComponentFixture<AutonomousPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutonomousPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutonomousPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
