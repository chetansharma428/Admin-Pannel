import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

import { BookingRoutingModule } from './booking.routing.module';
import { BookingComponent } from './booking/booking.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { NbSelectModule, NbAccordionModule, NbActionsModule, NbInputModule, NbButtonModule, NbIconModule, NbDialogModule, NbCardModule, NbCheckboxModule, NbToggleModule, NbTabsetModule, NbLayoutModule, NbTagModule, NbAutocompleteModule, NbDatepickerModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ListingComponent } from './booking-list/listing/listing.component';
import { BookingViewComponent } from './booking-view/booking-view.component';
import { BookingViewHeaderComponent } from './booking-view/booking-view-header/booking-view-header.component';
import { BookingViewStatusBarComponent } from './booking-view/booking-view-status-bar/booking-view-status-bar.component';
import { DetailsPopUpComponent } from './booking-view/details-pop-up/details-pop-up.component';
import { DetailCardComponent } from './booking-view/detail-card/detail-card.component';
import { PricingDetailComponent } from './booking-view/pricing-detail/pricing-detail.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    BookingComponent,
    BookingListComponent,
    ListingComponent,
    BookingViewComponent,
    BookingViewHeaderComponent,
    BookingViewStatusBarComponent,
    DetailsPopUpComponent,
    DetailCardComponent,
    PricingDetailComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    NbSelectModule, NbAccordionModule, NbActionsModule, NbInputModule, NbButtonModule, NbIconModule, NbDialogModule, NbCardModule, NbCheckboxModule, NbToggleModule, NbTabsetModule, NbLayoutModule, NbTagModule, NbAutocompleteModule, NbDatepickerModule,
    Ng2SmartTableModule,
    FormsModule, ReactiveFormsModule,
    MatMenuModule,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NbCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    NgxPaginationModule,
    NbSpinnerModule
  ]
})
export class BookingModule { }
