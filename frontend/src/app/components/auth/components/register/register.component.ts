import { Component } from '@angular/core';
import { SharedModule } from '../../../../common/shared/shared.module';
import { NgForm } from '@angular/forms';
import { RegisterModel } from '../../../models/register.model';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: RegisterModel = new RegisterModel();

  constructor(
    private _auth: AuthService,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  register(form: NgForm) {
    if (form.valid) {
      this._auth.register(this.model).subscribe({
        next: () => {
          this._toastr.success("Kullanıcı kaydı başarıyla tamamlandı. Lütfen giriş yapınız.");
          this._router.navigateByUrl("/login");
        },
        error: (err) => {
          console.error("Kayıt başarısız:", err);
          this._toastr.error("Kayıt başarısız! Lütfen tekrar deneyin.");
        }
      });
    }
  }
}
