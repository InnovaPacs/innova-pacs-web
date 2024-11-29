import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacsConfigurationComponent } from './pacs-configuration.component';

describe('PacsConfigurationComponent', () => {
  let component: PacsConfigurationComponent;
  let fixture: ComponentFixture<PacsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacsConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
