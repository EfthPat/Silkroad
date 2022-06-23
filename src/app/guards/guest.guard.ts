import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {roles} from "../constants/roles";
import {endpoints} from "../constants/pageLinks";

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let userRole = this.authService.getUserRole()

    if (userRole === roles[0])
      return true;

    this.router.navigate([endpoints.browse])

    return false;
  }

}
