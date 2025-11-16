import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { ModalLogout } from './modal-logout/modal-logout';
import { ModalManageFamily } from './modal-manage-family/modal-manage-family';
import { UsersService } from './services/users.service';
import { ModalAddMember } from './modal-add-member/modal-add-member';
import { InvitesService } from './services/invites.service';
import { Users } from './share/users';
import { FirstAccessService } from './services/first-access.service';
import { CommonModule } from '@angular/common';
import { LocalStorage } from './share/local-storage';
import { PendingIssuesService } from './services/pending-issues.service';
import { ModalPendingIssues } from './modal-pending-issues/modal-pending-issues';
import { ModalAddPendingIssues } from './modal-add-pending-issues/modal-add-pending-issues';
import { ModalEditPendingIssues } from './modal-edit-pending-issues/modal-edit-pending-issues';
import { ModalPendingIssuesHistory } from './modal-pending-issues-history/modal-pending-issues-history';
import { ModalDeletePendingIssue } from './modal-delete-pending-issue/modal-delete-pending-issue';
import { ModalPendingIssuesCreationNotification } from './modal-pending-issues-creation-notification/modal-pending-issues-creation-notification';
import { ModalPendingIssuesResetNotification } from './modal-pending-issues-reset-notification/modal-pending-issues-reset-notification';
import { ModalAddRevenues } from './modal-add-revenues/modal-add-revenues';
import { ModalSuccess } from './modal-success/modal-success';
import { ModalInternalError } from './modal-internal-error/modal-internal-error';
import { ModalResetPasswordRequest } from './modal-reset-password-request/modal-reset-password-request';
import { StatementService } from './services/statement.service';
import { StatementDetailsService } from './services/statement-details.service';
import { ModalStatementDetails } from './modal-statement-details/modal-statement-details';
import { ModalSetBudgets } from './modal-set-budgets/modal-set-budgets';
import { SavingsService } from './services/savings.service';
import { BudgetsService } from './services/budgets.service';
import { ModalInfo } from './modal-info/modal-info';
import { ModalAddSavings } from './modal-add-savings/modal-add-savings';
import { ModalAddExpenses } from './modal-add-expenses/modal-add-expenses';
import { ExpensesService } from './services/expenses.service';
import { ModalBudgetTransfering } from './modal-budget-transfering/modal-budget-transfering';
import { ModalLoading } from './modal-loading/modal-loading';
import { ModalIncreaseBudget } from './modal-increase-budget/modal-increase-budget';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ModalManageFamily,
    ModalAddMember,
    ModalLogout,
    ModalPendingIssues,
    ModalAddPendingIssues,
    ModalEditPendingIssues,
    ModalPendingIssuesHistory,
    ModalDeletePendingIssue,
    ModalPendingIssuesCreationNotification,
    ModalPendingIssuesResetNotification,
    ModalAddRevenues,
    ModalSuccess,
    ModalInternalError,
    ModalResetPasswordRequest,
    ModalSetBudgets,
    ModalStatementDetails,
    ModalInfo,
    ModalAddSavings,
    ModalAddExpenses,
    ModalBudgetTransfering,
    ModalLoading,
    ModalIncreaseBudget,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    AuthService,
    SessionService,
    UsersService,
    InvitesService,
    FirstAccessService,
    PendingIssuesService,
    StatementService,
    StatementDetailsService,
    SavingsService,
    BudgetsService,
    ExpensesService
  ]
})
export class App  {
  protected title = 'pfinances';  

  private users = new Users;
  private localStorage = new LocalStorage;

  public loadUsers() {
    this.users.userId = this.localStorage.getUserId()!;
    this.users.familyId = this.localStorage.getFamilyId()!;
    this.users.accessToken = this.localStorage.getAccessToken()!;
    this.users.getUsers();
  }

}
