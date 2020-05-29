import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ServiceFormPage } from './form.page';

describe('ServiceFormPage', () => {
  let component: ServiceFormPage;
  let fixture: ComponentFixture<ServiceFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFormPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
