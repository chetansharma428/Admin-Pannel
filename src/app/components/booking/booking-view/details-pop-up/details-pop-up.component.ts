import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BookingService } from '../../../../lib/services/booking-service/booking.service';

@Component({
  selector: 'vtech-ui-details-pop-up',
  templateUrl: './details-pop-up.component.html',
  styleUrls: ['./details-pop-up.component.scss']
})
export class DetailsPopUpComponent implements OnInit {

  @Input() header: { key: string, value: string };
  @Input() content: {
    key: string,
    icon: string,
    value: string
  }[];

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    console.log(this.header);
  }

  close(key: string) {
    this.bookingService.closeDetails(key);
  }

}
