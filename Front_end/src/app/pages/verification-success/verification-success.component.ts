import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verification-success',
  templateUrl: './verification-success.component.html',
  styleUrls: ['./verification-success.component.scss']
})
export class VerificationSuccessComponent implements OnInit {
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.toastr.success(`Email ${this.email} verified successfully!`);
      setTimeout(() => {
        this.router.navigate(['/pages/login'], {
          replaceUrl: true
        });
      }, 3000);
    });
  }
}