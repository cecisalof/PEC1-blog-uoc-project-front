import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDTO } from '../Models/category.dto';

interface deleteResponse {
  affected: number;
}

/*
*** Injectable: Decorator that marks a class as available to be provided and injected as a dependency.
*** providedIn: 'root': This means that the service is available application-wide as a singleton.
*** Singleton: Instance of a class that is shared across the entire application.
*/
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // En Angular, solo las propiedades públicas se pueden acceder desde el HTML (template).
  //Las privadas son internas al componente o servicio. Se usa private para proteger datos internos, como URLs, contadores, estados internos, o servicios inyectados que no deben manipularse directamente desde el HTML.
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getCategoriesByUserId(userId: string): Promise<CategoryDTO[]> {
    return this.http
      .get<CategoryDTO[]>('http://localhost:3000/users/categories/' + userId)
      .toPromise();
  }

  createCategory(category: CategoryDTO): Promise<CategoryDTO> {
    return this.http
      .post<CategoryDTO>(this.urlBlogUocApi, category)
      .toPromise();
  }

  getCategoryById(categoryId: string): Promise<CategoryDTO> {
    return this.http
      .get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId)
      .toPromise();
  }

  updateCategory(
    categoryId: string,
    category: CategoryDTO
  ): Promise<CategoryDTO> {
    return this.http
      .put<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId, category)
      .toPromise();
  }

  deleteCategory(categoryId: string): Promise<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlBlogUocApi + '/' + categoryId)
      .toPromise();
  }
}
