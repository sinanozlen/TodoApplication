// services/task.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  _id?: any;
  startDate: string;
  endDate: string;
  title: string;
  user: any;
  completed: boolean;
  parentTask?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  api: string = "http://localhost:5000/api/tasks";

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.api, task);
  }

  updateTask(id: any, model: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.api}/${id}`, model);
  }

  deleteTask(id: any): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  getTaskDetail(id: string): Observable<any> {
    return this.http.get(`${this.api}/detail?id=${id}`);
  }
}
