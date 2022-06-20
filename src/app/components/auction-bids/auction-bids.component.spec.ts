import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionBidsComponent } from './auction-bids.component';

describe('AuctionBidsComponent', () => {
  let component: AuctionBidsComponent;
  let fixture: ComponentFixture<AuctionBidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionBidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
