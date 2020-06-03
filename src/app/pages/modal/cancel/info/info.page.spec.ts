import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CancelInfoModal } from './info.page';

describe('CancelInfoModal', () => {
  let component: CancelInfoModal;
  let fixture: ComponentFixture<CancelInfoModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelInfoModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelInfoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
