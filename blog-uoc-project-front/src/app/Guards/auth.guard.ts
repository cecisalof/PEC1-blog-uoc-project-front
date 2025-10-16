import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../Services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      /* 
      **** Descripción ****
      Este guard
      valida si existe el access_token en el localStorage, 
      si no existe redirige al usuario a la pantalla de login. 
      *** Fin Descripción ***
      */
    const access_token = this.localStorageService.get('access_token');
    if (access_token) {
      // logged in so return true
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
