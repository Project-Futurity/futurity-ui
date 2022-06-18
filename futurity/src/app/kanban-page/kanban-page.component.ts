import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute} from "@angular/router";
import {ColumnService} from "../shared/services/column.service";
import {TaskService} from "../shared/services/task.service";
import {ProjectColumn, TaskChangingIndex, Task} from "../shared/interfaces/project-ui";
import {ErrorHandler} from "../shared/services/error-handler";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfigureTaskFormComponent} from "../configure-task-form/configure-task-form.component";
import * as moment from "moment/moment";
import {DATE_FORMAT} from "../shared/interfaces/time";
import {ChangeTaskDeadlineDto} from "../shared/dto/project-dto";

@Component({
  selector: 'app-kanban-page',
  templateUrl: './kanban-page.component.html',
  styleUrls: ['./kanban-page.component.css']
})
export class KanbanPageComponent implements OnInit {
  projectId: number;

  creationNewTask = false;
  creationColumnIndex = -1;
  changingColumnIndex = -1;
  changingTask = false;

  private readonly NOT_EXISTING_TASK_INDEX: TaskChangingIndex = {taskIndex: -1, columnIndex: -1};
  changingTaskIndex: TaskChangingIndex = this.NOT_EXISTING_TASK_INDEX;
  @ViewChild("input_task_change") changingTaskInput: ElementRef;
  @ViewChild("input_box") creationTaskInput: ElementRef;
  @ViewChild("columnMenu", {static: true}) columnMenu: ContextMenuComponent;
  @ViewChild("taskMenu", {static: true}) taskMenu: ContextMenuComponent;

  creationNewColumn = false;
  changingColumn = false;
  @ViewChild("input_column_change") changingColumnInput: ElementRef;
  @ViewChild("input_column") creationColumnInput: ElementRef;

  columns: ProjectColumn[] = [];
  columnsAreLoaded = false;

  readonly COLUMN_NAME_LENHGT = 22;
  readonly TASK_NAME_LENHGT = 28;
  readonly TASK_IS_DONE = "Task is done";
  readonly DEADLINE_IS_VIOLATED = "Deadline is violated!";
  readonly DEADLINE_TODAY = "Deadline today!";

  constructor(private changeDetector: ChangeDetectorRef, private route: ActivatedRoute,
              private columnService: ColumnService, private taskService: TaskService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("id") as unknown as number;

    this.columnService.getColumns(this.projectId).subscribe({
      next: columns => {
        this.columns = columns;
        this.columnsAreLoaded = true;
      },
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
          from: event.previousIndex, to: event.currentIndex, projectId: this.projectId
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
          fromColumn: columnTo, toColumn: columnTo,
          from: event.previousIndex, to: event.currentIndex
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
      const task = this.columns[columnFrom].tasks[event.previousIndex];

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      this.taskService.changeTaskIndex(this.projectId, {
        fromColumn: columnFrom,
        toColumn: columnTo,
        from: event.previousIndex,
        to: event.currentIndex
      }).subscribe({
        next: () => task.columnId = this.columns[columnTo].id,
        error: () => {
          ErrorHandler.showPopupAlert("Can't move the task.", this.modalService);
          transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
        }
      });
    }
  }

  creationTaskUnFocus(event: any) {
    const task = event.target.value as string;

    if (task && this.creationNewTask) {
      if (task != '+') {
        const column = this.columns[this.creationColumnIndex];
        const taskToAdd: Task = {name: task, columnId: column.id, deadline: null};
        const index = column.tasks.push(taskToAdd) - 1;

        this.openModal(data => {
          const request = {
            projectId: this.projectId, taskName: task, columnId: column.id, deadline: data
          };
          taskToAdd.deadline = data;

          this.taskService.createTask(request).subscribe({
            next: id => taskToAdd.id = id,
            error: () => {
              ErrorHandler.showPopupAlert("Can't create the task.", this.modalService);
              column.tasks.splice(index, 1);
            }
          });
        }, () => column.tasks.splice(index, 1))
      }
    }

    this.abortTaskCreation();
  }

  changeTaskDeadline(task: Task) {
    this.openModal((data) => {
      const previousDeadline = task.deadline;
      task.deadline = data;

      const request: ChangeTaskDeadlineDto = {
        projectId: this.projectId, columnId: task.columnId, taskId: task.id, deadline: data
      };

      this.taskService.changeTaskDeadline(request).subscribe({
        error: () => {
          ErrorHandler.showPopupAlert("Can't change deadline for the task.", this.modalService);
          task.deadline = previousDeadline;
        }
      })
    }, undefined, task.deadline);
  }

  private openModal(after: (data: string) => void, close?: () => void, startDate?: string): void {
    const modal = this.modalService.open(ConfigureTaskFormComponent, {
      centered: true, animation: true, scrollable: false
    });

    if (startDate) {
      const component = modal.componentInstance as ConfigureTaskFormComponent;
      component.setTimeToPicker(startDate);
    }

    modal.result.then(data => after(data), () => {
      if (close) close();
    });
  }

  abortTaskCreation() {
    this.creationColumnIndex = -1;
    this.creationNewTask = false;
  }

  creationColumnUnFocus(event: any) {
    const column = event.target.value as string;

    if (column && this.creationNewColumn) {
      const columnToAdd: ProjectColumn = {name: column, tasks: [], isDone: false};
      const index = this.columns.push(columnToAdd) - 1;

      this.columnService.createColumn({projectId: this.projectId, name: column}).subscribe({
        next: id => columnToAdd.id = id,
        error: () => {
          ErrorHandler.showPopupAlert("Can't create the column.", this.modalService);
          this.columns.splice(index, 1);
        }
      });
    }

    this.abortColumnCreation()
  }

  abortColumnCreation() {
    this.creationNewColumn = false;
  }

  deleteColumn(value: ProjectColumn) {
    const index = this.columns.indexOf(value);
    this.columns.splice(index, 1);

    this.columnService.deleteColumn({columnId: value.id, projectId: this.projectId}).subscribe({
      error: () => {
        this.columns.splice(index, 0, value);
        ErrorHandler.showPopupAlert("Can't delete the column.", this.modalService);
      }
    });
  }

  deleteTask(value: Task) {
    const column = this.columns.find(column => column.id == value.columnId);
    const index = column.tasks.indexOf(value);
    column.tasks.splice(index, 1);

    this.taskService.deleteTask({
      taskId: value.id, projectId: this.projectId, columnId: value.columnId
    }).subscribe({
      error: () => {
        ErrorHandler.showPopupAlert("Can't delete the task.", this.modalService);
        column.tasks.splice(index, 0, value);
      }
    })
  }

  startCreateTask(index: number) {
    this.creationNewTask = true;
    this.creationColumnIndex = index;
    this.changeDetector.detectChanges();
    this.creationTaskInput.nativeElement.focus();
  }

  startCreateColumn() {
    this.creationNewColumn = true;
    this.changeDetector.detectChanges();
    this.creationColumnInput.nativeElement.focus();
  }

  startChangeColumnName(index: number) {
    this.changingColumn = true;
    this.changingColumnIndex = index;
    this.changeDetector.detectChanges();
    this.changingColumnInput.nativeElement.focus();
  }

  abortColumnChanging() {
    this.changingColumn = false;
    this.changingColumnIndex = -1;
  }

  changeColumnName(event: any, column: ProjectColumn) {
    const name = event.target.value as string;

    if (name && this.changingColumn) {
      const previousName = column.name;

      if (name != previousName) {
        column.name = name;

        this.columnService.changeColumnName({
          columnName: name, columnId: column.id, projectId: this.projectId
        }).subscribe({
          error: () => {
            column.name = previousName;
            ErrorHandler.showPopupAlert("Can't rename the column.", this.modalService);
          }
        });
      }
    }

    this.abortColumnChanging();
  }

  startChangeTaskName(taskIndex: TaskChangingIndex) {
    this.changingTask = true;
    this.changingTaskIndex = taskIndex;
    this.changeDetector.detectChanges();
    this.changingTaskInput.nativeElement.focus();
  }

  abortTaskChanging() {
    this.changingTask = false;
    this.changingTaskIndex = this.NOT_EXISTING_TASK_INDEX;
  }

  changeTaskName(event: any, columnIndex: number, taskIndex: number) {
    const name = event.target.value as string;

    if (name && this.changingTask) {
      const task = this.columns[columnIndex].tasks[taskIndex];
      const previousName = task.name;

      if (name != previousName) {
        task.name = name;

        this.taskService.changeTaskName({
          taskName: name, taskId: task.id, columnId: task.columnId, projectId: this.projectId
        }).subscribe({
          error: () => {
            task.name = previousName;
            ErrorHandler.showPopupAlert("Can't rename the task.", this.modalService);
          }
        });
      }
    }

    this.abortTaskChanging();
  }

  showDeadline(deadline: string) {
    const time = moment(deadline);

    return time.format(DATE_FORMAT);
  }

  diffDeadline(deadline: string, isDone: boolean) {
    if (isDone) return this.TASK_IS_DONE;

    const time = moment(deadline);
    const now = moment();
    const days = time.diff(now, "days");

    if (days > 0) {
      return "Left " + days + " days to deadline";
    } else if (days == 0) {
      return this.DEADLINE_TODAY;
    } else {
      return this.DEADLINE_IS_VIOLATED;
    }
  }

  isDeadlineViolated(deadline: string, isDone: boolean) {
    if (isDone) {
      return false;
    }
    const time = moment(deadline);
    const now = moment();

    return now.isAfter(time);
  }

  markColumn(column: ProjectColumn) {
    const columnToDisable = this.columns.find(column => column.isDone == true);

    if (columnToDisable) {
      columnToDisable.isDone = false;
    }

    column.isDone = true;

    this.columnService.markColumn({
      projectId: this.projectId,
      columnIdToUnmark: columnToDisable ? columnToDisable.id : null,
      columnIdToMark: column.id
    }).subscribe({
      error: () => {
        column.isDone = false;

        if (columnToDisable) {
          columnToDisable.isDone = true;
        }

        ErrorHandler.showPopupAlert("Can't mark the column.", this.modalService);
      }
    });
  }
}
