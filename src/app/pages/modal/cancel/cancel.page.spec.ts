import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CancelModal } from './cancel.page';

describe('CancelModal', () => {
  let component: CancelModal;
  let fixture: ComponentFixture<CancelModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
