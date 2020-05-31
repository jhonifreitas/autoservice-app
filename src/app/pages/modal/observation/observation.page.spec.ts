import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ObservationModal } from './observation.page';

describe('ObservationModal', () => {
  let component: ObservationModal;
  let fixture: ComponentFixture<ObservationModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
