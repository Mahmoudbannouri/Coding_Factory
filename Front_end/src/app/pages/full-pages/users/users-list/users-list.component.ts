import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
nameComparator: any;
clearSearch() {
throw new Error('Method not implemented.');
}
openAddUserModal() {
throw new Error('Method not implemented.');
}
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows: User[] = [];
  tempData: User[] = [];
  loading = true;
  limitRef = 10;
  ColumnMode = ColumnMode;

  columns = [
    { name: 'ID', prop: 'id', width: 80 },
    { name: 'Name', prop: 'name', width: 150 },
    { name: 'Email', prop: 'email', width: 200 },
    { name: 'Roles', prop: 'roles', width: 150 },
    { name: 'Verified', prop: 'verified', width: 100 },
    { name: 'Status', prop: 'enabled', width: 100 },
    { name: 'Actions', prop: 'actions', width: 150 }
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.rows = users;
        this.tempData = [...users];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load users');
        this.loading = false;
      }
    });
  }

  toggleUserStatus(user: User): void {
    const action$ = user.enabled
      ? this.userService.disableUser(user.id)
      : this.userService.enableUser(user.id);

    action$.subscribe({
      next: () => {
        const updatedUser = { ...user, enabled: !user.enabled };

        // Update in rows array
        const index = this.rows.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.rows[index] = updatedUser;
          this.rows = [...this.rows];
        }

        // Update in tempData for filtering
        const tempIndex = this.tempData.findIndex(u => u.id === user.id);
        if (tempIndex !== -1) {
          this.tempData[tempIndex] = updatedUser;
        }

        this.toastr.success(`User ${updatedUser.enabled ? 'enabled' : 'disabled'} successfully`);
      },
      error: () => {
        this.toastr.error('Failed to update user status');
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.rows = this.rows.filter(u => u.id !== user.id);
          this.tempData = this.tempData.filter(u => u.id !== user.id);
          this.toastr.success('User deleted successfully');
        },
        error: () => this.toastr.error('Failed to delete user')
      });
    }
  }

  filterUpdate(event: Event): void {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    this.rows = this.tempData.filter(user =>
      user.name.toLowerCase().includes(val) ||
      user.email.toLowerCase().includes(val)
    );
    this.table.offset = 0;
  }

  updateLimit(limit: any): void {
    this.limitRef = parseInt(limit.target.value, 10);
  }
}
