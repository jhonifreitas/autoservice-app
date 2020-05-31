import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AddressModal } from './address.page';

describe('AddressModal', () => {
  let component: AddressModal;
  let fixture: ComponentFixture<AddressModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
