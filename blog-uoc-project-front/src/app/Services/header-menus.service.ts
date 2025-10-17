import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderMenus } from '../Models/header-menus.dto';

@Injectable({
  providedIn: 'root',
})
export class HeaderMenusService {
  // headerManagement: Observable que emite el estado del header
  headerManagement: BehaviorSubject<HeaderMenus> =
    new BehaviorSubject<HeaderMenus>({
      showAuthSection: false,
      showNoAuthSection: true,
    });
}
