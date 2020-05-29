import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AvaliationPage } from './avaliation.page';

describe('AvaliationPage', () => {
  let component: AvaliationPage;
  let fixture: ComponentFixture<AvaliationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliationPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AvaliationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
