import { ChangeDetectorRef, Component,Input,NgModule,OnInit, Output } from '@angular/core';
import { EmployeeService } from '../../../../lib/services/employee-service/employee.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { NbDialogService } from '@nebular/theme';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { ViewDetailsComponent } from './view-details/view-details.component';



@Component({
  selector: 'ngx-employee-listing',
  templateUrl: './employee-listing.component.html',
  styleUrls: ['./employee-listing.component.scss']
})
export class EmployeeListingComponent implements OnInit {
  searchInput:string = "";
  emailid:any;
  employeeList$: Observable<any>;
  pagesize = ['10', '20', '30', '40'];
  private updateEmployeeList$ = new Subject<null>();
  private params: Params;
  loading: boolean = false;
  settings = {
    mode: 'external',
    actions: {
      add: false
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      parentId: {
        title: 'Corporate Name', type: 'string',
        filter: false
      },
      firstName: {
        title: 'Employee First Name', type: 'string',
        filter: false
      },
      lastName: {
        title: 'Employee Last Name', type: 'string',
        filter: false
      },
      mobileNo: {
        title: 'Mobile No', type: 'string',
        filter: false
      },
      emailId: {
        title: 'Email Id', type: 'string',
        filter: false
      },
      isActive: {
        title: 'Status', type: 'custom',
        filter: false,
        renderComponent: ToggleButtonComponent,
        onComponentInitFunction: (instance: any) => {
          this.onUpdateConfirm(instance);
        }
      },
      link: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        actions: false,
        renderComponent: ViewDetailsComponent
      }
    }


  }


  constructor(private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute, private readonly dialog: NbDialogService,
    private cd: ChangeDetectorRef) {
    this.params = this.activatedRoute.parent.snapshot.params;
  }
  
  searchemail(){
    this.employeeList$ =  this.employeeService.fetchEmployee(this.params,this.searchInput);
  }
  

  ngOnInit() {
    this.employeeList$ = this.updateEmployeeList$.pipe(
      tap(() => this.loading = true),
      switchMap(() => this.employeeService.fetchEmployee(this.params,)),
      map((res) => {
        return res
      },
        (error) => {
          this.loading = false;
        }
      ),
      tap(() => this.loading = false)
    )

  }


  selectedRow($event) {
    this.router.navigate([`${this.params.id}/corporate/${this.params.corpId}/employee/${$event.data.emailId}/profile`]);
  }

  ngAfterViewInit() {
    this.updateEmployeeList$.next();
    this.cd.detectChanges();
  };

  ngOnDestroy(): void {
    this.updateEmployeeList$.complete();
  };

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    }).onClose.subscribe((res) => this.updateEmployeeList$.next());
  }

  onDeleteConfirm(event): void {
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Warning',
        message: 'Are you sure, do you want to delete ?'
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          this.employeeService.deleteEmployee(this.params, event.data).subscribe((res) => res);
          this.showDialog('Success', 'Employee has been Deleted.');
        }
      })
    ).subscribe((res) => res);
  };

  onUpdateConfirm(instance): void {
    instance.toggleResponse.pipe(
      tap((res) => this.showConfirmDialog('Update Warning', 'Are you sure, do you want to update ?', res)),
    ).subscribe(res => res);
  }

  showConfirmDialog(status, message, data?) {
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: status,
        message: message
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          data.data.isActive = data.status;
          this.employeeService.updateEmployeestatus(data.data).subscribe((res) => {
            this.dialog.open(SuccessDialogComponent, {
              context: {
                title: 'Success',
                message: 'Employee status has been updated.'
              }
            }).onClose.subscribe((res) => this.updateEmployeeList$.next())
          },
            error => this.dialog.open(SuccessDialogComponent, {
              context: {
                title: 'Error',
                message: 'Something went wrong.please contact the administrator.'
              }
            }).onClose.subscribe((res) => this.updateEmployeeList$.next()))
        } else {
          this.updateEmployeeList$.next();
        }
      })
    ).subscribe((res) => res);
  };
}

