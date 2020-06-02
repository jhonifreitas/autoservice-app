import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AddressDetailModal } from './detail.page';

describe('AddressDetailModal', () => {
  let component: AddressDetailModal;
  let fixture: ComponentFixture<AddressDetailModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressDetailModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
