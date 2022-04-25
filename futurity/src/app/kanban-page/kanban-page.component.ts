import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute} from "@angular/router";
import {ColumnService} from "../shared/services/column.service";
import {TaskService} from "../shared/services/task.service";
import {ProjectColumn, Task} from "../shared/interfaces/project-ui";
import {ErrorHandler} from "../shared/services/error-handler";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-kanban-page',
  templateUrl: './kanban-page.component.html',
  styleUrls: ['./kanban-page.component.css']
})
export class KanbanPageComponent implements OnInit {
  projectId: number;

  creationNewTask = false;
  creationColumnIndex: number = -1;
  @ViewChild("input_box") creationTaskInput: ElementRef;
  @ViewChild(ContextMenuComponent, {static: true}) basicMenu: ContextMenuComponent;

  creationNewColumn = false;
  @ViewChild("input_column") creationColumnInput: ElementRef;

  columns: ProjectColumn[] = [];

  constructor(private changeDetector: ChangeDetectorRef, private route: ActivatedRoute,
              private columnService: ColumnService, private taskService: TaskService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("id") as unknown as number;

    this.columnService.getColumns(this.projectId).subscribe({
      next: columns => this.columns = columns,
      error: () => ErrorHandler.showPopupAlert("Can't load the columns.", this.modalService)
    });
  }

  dropColumn(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      if (event.previousIndex != event.currentIndex) {
        this.columnService.changeColumnIndex({
          from: event.previousIndex,
          to: event.currentIndex,
          projectId: this.projectId
        }).subscribe({
          error: () => {
            ErrorHandler.showPopupAlert("Can't move the column.", this.modalService);
            moveItemInArray(event.container.data, currentIndex, previousIndex)
          }
        });
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }
    }
  }

  dropTask(event: CdkDragDrop<any[]>, columnTo: number) {
    if (event.previousContainer === event.container) {
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      if (event.previousIndex != event.currentIndex) {
        this.taskService.changeTaskIndex(this.projectId, {
          fromColumn: columnTo,
          toColumn: columnTo,
          from: event.previousIndex,
          to: event.currentIndex
        }).subscribe({
          error: () => {
            ErrorHandler.showPopupAlert("Can't move the task.", this.modalService);
            moveItemInArray(event.container.data, currentIndex, previousIndex);
          }
        });
      }
    } else {
      const previous = event.previousContainer.data;
      const columnFrom = this.columns.findIndex(column => column.tasks.length == previous.length
        && column.tasks.every((elem, index) => elem == previous[index]));

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      this.taskService.changeTaskIndex(this.projectId, {
        fromColumn: columnFrom,
        toColumn: columnTo,
        from: event.previousIndex,
        to: event.currentIndex
      }).subscribe({
        error: () => {
          ErrorHandler.showPopupAlert("Can't move the task.", this.modalService);
          transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
        }
      });
    }
  }

  creationTaskUnFocus(event: any) {
    const task = event.target.value as string;

    if (task) {
      this.columns.forEach((column, index) => {
        if (index === this.creationColumnIndex) {
          if (task != '+') {
            const columnIndex = this.columns.indexOf(column);
            const taskToAdd: Task = {name: task, columnIndex: columnIndex};
            const index = column.tasks.push(taskToAdd) - 1;
            const request = {
              projectId: this.projectId, taskName: task,
              columnIndex: columnIndex
            };

            this.taskService.createTask(request).subscribe({
              error: () => {
                ErrorHandler.showPopupAlert("Can't create the task.", this.modalService);
                this.columns.splice(index, 1);
              }
            })
          }
        }
      });
    }

    this.creationColumnIndex = -1;
    this.creationNewTask = false;
  }

  creationColumnUnFocus(event: any) {
    const column = event.target.value as string;

    if (column) {
      let columnToAdd: ProjectColumn = {name: column, tasks: []};
      const index = this.columns.push(columnToAdd) - 1;

      this.columnService.createColumn({projectId: this.projectId, name: column}).subscribe({
        error: () => {
          ErrorHandler.showPopupAlert("Can't create the column.", this.modalService);
          this.columns.splice(index, 1);
        }
      })
    }

    this.creationNewColumn = false;
  }

  delete(value: any) {
    if (value.tasks) {
      // deleting column
      const index = this.columns.indexOf(value);
      this.columns.splice(index, 1);

      this.columnService.deleteColumn({index: index, projectId: this.projectId}).subscribe({
        error: () => {
          ErrorHandler.showPopupAlert("Can't delete the column.", this.modalService);
          this.columns.splice(index, 0, value);
        }
      });
    } else {
      // deleting task
      const index = this.columns[value.columnIndex].tasks.indexOf(value);
      this.columns[value.columnIndex].tasks.splice(index, 1);

      this.taskService.deleteTask({
        taskIndex: index, projectId: this.projectId,
        columnIndex: value.columnIndex
      }).subscribe({
        error: () => {
          ErrorHandler.showPopupAlert("Can't delete the task.", this.modalService);
          this.columns[value.columnIndex].tasks.splice(index, 0, value);
        }
      })
    }
  }

  startCreateTask(column: ProjectColumn) {
    this.creationNewTask = true;
    this.creationColumnIndex = this.columns.indexOf(column);
    this.changeDetector.detectChanges();
    this.creationTaskInput.nativeElement.focus();
  }

  startCreateColumn() {
    this.creationNewColumn = true;
    this.changeDetector.detectChanges();
    this.creationColumnInput.nativeElement.focus();
  }
}
