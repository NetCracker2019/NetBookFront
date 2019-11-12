import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverypassrequestComponent } from './recoverypassrequest.component';

describe('RecoverypassrequestComponent', () => {
  let component: RecoverypassrequestComponent;
  let fixture: ComponentFixture<RecoverypassrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverypassrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverypassrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
