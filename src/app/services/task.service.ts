// path: src/app/services/task.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TaskRequest, TaskResponse } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  #http = inject(HttpClient);
  #base = `${environment.apiBaseUrl}/api/tasks`;

  list(): Observable<TaskResponse[]> {
    return this.#http.get<TaskResponse[]>(this.#base);
  }

  create(req: TaskRequest): Observable<TaskResponse> {
    return this.#http.post<TaskResponse>(this.#base, req);
  }

  get(id: number): Observable<TaskResponse> {
    return this.#http.get<TaskResponse>(`${this.#base}/${id}`);
  }

  update(id: number, req: TaskRequest): Observable<TaskResponse> {
    return this.#http.put<TaskResponse>(`${this.#base}/${id}`, req);
  }

  remove(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#base}/${id}`);
  }
}