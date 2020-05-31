import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PaymentInfoModal } from './info.page';

describe('PaymentInfoModal', () => {
  let component: PaymentInfoModal;
  let fixture: ComponentFixture<PaymentInfoModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentInfoModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentInfoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
