import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyExamListComponent } from './radiology-exam-list.component';

describe('RadiologyExamListComponent', () => {
  let component: RadiologyExamListComponent;
  let fixture: ComponentFixture<RadiologyExamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiologyExamListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
