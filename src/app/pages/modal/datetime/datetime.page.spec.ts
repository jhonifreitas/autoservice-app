import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DatetimeModal } from './datetime.page';

describe('DatetimeModal', () => {
  let component: DatetimeModal;
  let fixture: ComponentFixture<DatetimeModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatetimeModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DatetimeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
