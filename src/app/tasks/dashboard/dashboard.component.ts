import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskRequest, TaskResponse, TaskStatus } from '../../models/task.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { TaskFormComponent } from '../task-form/task-form.component';

type Tab = 'ALL' | TaskStatus;

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, NavbarComponent, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  #tasks = inject(TaskService);

  tasks: TaskResponse[] = [];
  filteredTasks: TaskResponse[] = [];

  statusKeys: TaskStatus[] = ['ALL_TASK','TODO','IN_PROGRESS','DONE'];
  tab: Tab = 'ALL';

  // Precomputed counts for stats
  counts: Record<TaskStatus, number> = { ALL_TASK : 0 ,TODO: 0, IN_PROGRESS: 0, DONE: 0 };

  // Modal state
  showForm = false;
  selected: TaskResponse | null = null;

  ngOnInit(): void {
    this.reload();
  }

  // ------- Data Loading -------
  reload(): void {
    this.#tasks.list().subscribe((res) => {
      this.tasks = res;
      this.recomputeCounts();
      this.applyFilter();
    });
  }

  // ------- Derived State -------
  private recomputeCounts(): void {
    const c: Record<TaskStatus, number> = { ALL_TASK : this.tasks.length ,TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    for (const t of this.tasks) c[t.status] = (c[t.status] ?? 0) + 1;
    this.counts = c;
  }

  private applyFilter(): void {
    this.filteredTasks = this.tab === 'ALL'
      ? this.tasks.slice()
      : this.tasks.filter(t => t.status === this.tab);
  }

  // ------- UI Actions -------
  setTab(next: Tab): void {
    if (this.tab === next) return;
    this.tab = next;
    this.applyFilter();
  }

  openCreate(): void { this.selected = null; this.showForm = true; }
  openEdit(t: TaskResponse): void { this.selected = t; this.showForm = true; }
  closeForm(): void { this.showForm = false; this.selected = null; }

  // ------- Save from modal -------
  onSaved(data: TaskRequest): void {
    if (this.selected) {
      const id = this.selected.id;
      this.#tasks.update(id, data).subscribe((saved) => {
        this.tasks = this.tasks.map(t => t.id === id ? saved : t);
        this.recomputeCounts();
        this.applyFilter();
        this.closeForm();
      });
    } else {
      this.#tasks.create(data).subscribe((saved) => {
        this.tasks = [saved, ...this.tasks];
        this.recomputeCounts();
        this.applyFilter();
        this.closeForm();
      });
    }
  }

  // ------- Delete -------
  confirmDelete(t: TaskResponse): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.#tasks.remove(t.id).subscribe(() => {
        this.tasks = this.tasks.filter(x => x.id !== t.id);
        this.recomputeCounts();
        this.applyFilter();
      });
    }
  }

  // ------- View helpers -------
  trackById(_i: number, t: TaskResponse): number { return t.id; }

  label(s: string): string {
    switch (s) {
  case 'ALL_TASK': return 'All Tasks';
  case 'IN_PROGRESS': return 'In Progress';
  case 'DONE': return 'Done';
  default: return 'To-Do';
}
    // You can also switch/signalify this later for localization
  }
}