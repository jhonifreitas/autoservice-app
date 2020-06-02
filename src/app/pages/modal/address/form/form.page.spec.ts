import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AddressFormModal } from './form.page';

describe('AddressFormModal', () => {
  let component: AddressFormModal;
  let fixture: ComponentFixture<AddressFormModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressFormModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
