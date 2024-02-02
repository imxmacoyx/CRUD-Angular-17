import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPersonaComponent } from './ver-persona.component';

describe('VerPersonaComponent', () => {
  let component: VerPersonaComponent;
  let fixture: ComponentFixture<VerPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPersonaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
