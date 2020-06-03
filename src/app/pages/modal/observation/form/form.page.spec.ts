import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ObservationFormModal } from './form.page';

describe('ObservationFormModal', () => {
  let component: ObservationFormModal;
  let fixture: ComponentFixture<ObservationFormModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationFormModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
