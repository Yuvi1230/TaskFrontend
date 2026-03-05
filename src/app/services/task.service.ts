// path: src/app/services/task.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivityLogResponse, Priority, TaskComment, TaskCommentRequest, TaskRequest, TaskResponse, TaskSummaryResponse, UserResponse } from '../models/task.model';
import { Observable } from 'rxjs';
// import { CommentResponse } from '../models/comment.model';  // <-- add this

@Injectable({ providedIn: 'root' })
// export class TaskService {
//   #http = inject(HttpClient);
//   #base = `${environment.apiBaseUrl}/api/tasks`;

//   // REMOVE this line (it breaks things):
//   // http: any;

//   // ------- Tasks -------
//   list(): Observable<TaskResponse[]> {
//     return this.#http.get<TaskResponse[]>(this.#base);
//   }

//   create(req: TaskRequest): Observable<TaskResponse> {
//     return this.#http.post<TaskResponse>(this.#base, req);
//   }

//   get(id: number): Observable<TaskResponse> {
//     return this.#http.get<TaskResponse>(`${this.#base}/${id}`);
//   }

//   update(id: number, req: TaskRequest): Observable<TaskResponse> {
//     return this.#http.put<TaskResponse>(`${this.#base}/${id}`, req);
//   }

//   remove(id: number): Observable<void> {
//     return this.#http.delete<void>(`${this.#base}/${id}`);
//   }

//   // ------- Comments -------
//   getComments(taskId: number): Observable<CommentResponse[]> {
//     return this.#http.get<CommentResponse[]>(
//       `${this.#base}/${taskId}/comments`
//     );
//   }

//   postComment(taskId: number, text: string): Observable<CommentResponse> {
//     return this.#http.post<CommentResponse>(
//       `${this.#base}/${taskId}/comments`,
//       { text }
//     );
//   }

//   deleteComment(commentId: number): Observable<void> {
//     // Comments delete endpoint is not under /tasks
//     return this.#http.delete<void>(`${environment.apiBaseUrl}/api/comments/${commentId}`);
//   }
// }
export class TaskService {
  #http = inject(HttpClient);
  #base = `${environment.apiBaseUrl}/api/tasks`;
  #commentBase = `${environment.apiBaseUrl}/api/comments`;

  list(priority?: Priority): Observable<TaskResponse[]> {
    const params = priority ? { priority } : undefined;
    return this.#http.get<TaskResponse[]>(this.#base, { params });
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

  getComments(taskId: number): Observable<TaskComment[]> {
    return this.#http.get<TaskComment[]>(`${this.#base}/${taskId}/comments`);
  }

  createComment(taskId: number, req: TaskCommentRequest): Observable<TaskComment> {
    return this.#http.post<TaskComment>(`${this.#base}/${taskId}/comments`, req);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.#http.delete<void>(`${this.#commentBase}/${commentId}`);
  }

  listUsers(): Observable<UserResponse[]> {
    return this.#http.get<UserResponse[]>(`${environment.apiBaseUrl}/api/users`);
  }

  summary(): Observable<TaskSummaryResponse> {
    return this.#http.get<TaskSummaryResponse>(`${this.#base}/summary`);
  }

  activity(): Observable<ActivityLogResponse[]> {
    return this.#http.get<ActivityLogResponse[]>(`${environment.apiBaseUrl}/api/activity`);
  }
}