import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JobDonePage } from './list.page';

describe('JobDonePage', () => {
  let component: JobDonePage;
  let fixture: ComponentFixture<JobDonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDonePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JobDonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
