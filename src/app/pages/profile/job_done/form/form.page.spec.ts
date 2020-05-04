import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { JobDoneFormPage } from './form.page';

describe('JobDoneFormPage', () => {
  let component: JobDoneFormPage;
  let fixture: ComponentFixture<JobDoneFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDoneFormPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(JobDoneFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
