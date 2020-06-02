import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CompetenceModal } from './competence.page';

describe('CompetenceModal', () => {
  let component: CompetenceModal;
  let fixture: ComponentFixture<CompetenceModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetenceModal ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CompetenceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
