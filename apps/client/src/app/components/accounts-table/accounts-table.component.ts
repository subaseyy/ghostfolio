import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Account as AccountModel } from '@prisma/client';
import { get } from 'lodash';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'gf-accounts-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss']
})
export class AccountsTableComponent implements OnChanges, OnDestroy, OnInit {
  @Input() accounts: AccountModel[];
  @Input() baseCurrency: string;
  @Input() deviceType: string;
  @Input() locale: string;
  @Input() showActions: boolean;
  @Input() totalBalanceInBaseCurrency: number;
  @Input() totalValueInBaseCurrency: number;
  @Input() transactionCount: number;

  @Output() accountDeleted = new EventEmitter<string>();
  @Output() accountToUpdate = new EventEmitter<AccountModel>();

  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<AccountModel> =
    new MatTableDataSource();
  public displayedColumns = [];
  public isLoading = true;
  public routeQueryParams: Subscription;

  private unsubscribeSubject = new Subject<void>();

  public constructor(private router: Router) {}

  public ngOnInit() {}

  public ngOnChanges() {
    this.displayedColumns = [
      'status',
      'account',
      'platform',
      'transactions',
      'balance',
      'value',
      'currency',
      'valueInBaseCurrency',
      'comment'
    ];

    if (this.showActions) {
      this.displayedColumns.push('actions');
    }

    this.isLoading = true;

    if (this.accounts) {
      this.dataSource = new MatTableDataSource(this.accounts);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = get;

      this.isLoading = false;
    }
  }

  public onDeleteAccount(aId: string) {
    const confirmation = confirm(
      $localize`Do you really want to delete this account?`
    );

    if (confirmation) {
      this.accountDeleted.emit(aId);
    }
  }

  public onOpenAccountDetailDialog(accountId: string) {
    this.router.navigate([], {
      queryParams: { accountId, accountDetailDialog: true }
    });
  }

  public onOpenComment(aComment: string) {
    alert(aComment);
  }

  public onUpdateAccount(aAccount: AccountModel) {
    this.accountToUpdate.emit(aAccount);
  }

  public ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
