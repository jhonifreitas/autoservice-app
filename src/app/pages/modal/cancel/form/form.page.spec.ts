import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CancelFormModal } from './form.page';

describe('CancelFormModal', () => {
  let component: CancelFormModal;
  let fixture: ComponentFixture<CancelFormModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelFormModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
