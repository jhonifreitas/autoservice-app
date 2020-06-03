import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ObservationDetailModal } from './detail.page';

describe('ObservationDetailModal', () => {
  let component: ObservationDetailModal;
  let fixture: ComponentFixture<ObservationDetailModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationDetailModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
