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
  @ViewChild(ContextMenuComponent, {static: true}) basicMenu: ContextMenuComponent;

  creationNewColumn = false;
  changingColumn = false;
  @ViewChild("input_column_change") changingColumnInput: ElementRef;
  @ViewChild("input_column") creationColumnInput: ElementRef;

  columns: ProjectColumn[] = [];
  columnsAreLoaded = false;

  readonly COLUMN_NAME_LENHGT = 22;
  readonly TASK_NAME_LENHGT = 28;

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
    this.columnsAreLoaded = true;
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

    if (task && this.creationNewTask) {
      if (task != '+') {
        const column = this.columns[this.creationColumnIndex];
        const columnIndex = this.columns.indexOf(column);
        const taskToAdd: Task = {name: task, columnIndex: columnIndex, deadline: null};
        const index = column.tasks.push(taskToAdd) - 1;

        const modal = this.modalService.open(ConfigureTaskFormComponent, {
          centered: true, animation: true, scrollable: false
        });

        modal.result.then(data => {
          const request = {
            projectId: this.projectId, taskName: task, columnIndex: columnIndex, deadline: data
          };
          taskToAdd.deadline = data;

          this.taskService.createTask(request).subscribe({
            error: () => {
              ErrorHandler.showPopupAlert("Can't create the task.", this.modalService);
              column.tasks.splice(index, 1);
            }
          });
        }, () => {
          column.tasks.splice(index, 1);
        });
      }
    }

    this.abortTaskCreation();
  }

  abortTaskCreation() {
    this.creationColumnIndex = -1;
    this.creationNewTask = false;
  }

  creationColumnUnFocus(event: any) {
    const column = event.target.value as string;

    if (column && this.creationNewColumn) {
      let columnToAdd: ProjectColumn = {name: column, tasks: []};
      const index = this.columns.push(columnToAdd) - 1;

      this.columnService.createColumn({projectId: this.projectId, name: column}).subscribe({
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

  delete(value: any) {
    if (value.tasks) {
      // deleting column
      const index = this.columns.indexOf(value);
      this.columns.splice(index, 1);

      this.columnService.deleteColumn({index: index, projectId: this.projectId}).subscribe({
        error: () => {
          this.columns.splice(index, 0, value);
          ErrorHandler.showPopupAlert("Can't delete the column.", this.modalService);
        }
      });
    } else {
      // deleting task
      const index = this.columns[value.columnIndex].tasks.indexOf(value);
      this.columns[value.columnIndex].tasks.splice(index, 1);

      this.taskService.deleteTask({
        taskIndex: index, projectId: this.projectId, columnIndex: value.columnIndex
      }).subscribe({
        error: () => {
          ErrorHandler.showPopupAlert("Can't delete the task.", this.modalService);
          this.columns[value.columnIndex].tasks.splice(index, 0, value);
        }
      })
    }
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

  changeColumnName(event: any, columnIndex: number) {
    const name = event.target.value as string;

    if (name && this.changingColumn) {
      const previousName = this.columns[columnIndex].name;

      if (name != previousName) {
        this.columns[columnIndex].name = name;

        this.columnService.changeColumnName({
          columnName: name, columnIndex: columnIndex, projectId: this.projectId
        }).subscribe({
          error: () => {
            this.columns[columnIndex].name = previousName;
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
      const previousName = this.columns[columnIndex].tasks[taskIndex].name;

      if (name != previousName) {
        this.columns[columnIndex].tasks[taskIndex].name = name;

        this.taskService.changeTaskName({
          taskName: name, taskIndex: taskIndex, columnIndex: columnIndex, projectId: this.projectId
        }).subscribe({
          error: () => {
            this.columns[columnIndex].tasks[taskIndex].name = previousName;
            ErrorHandler.showPopupAlert("Can't rename the task.", this.modalService);
          }
        });
      }
    }

    this.abortTaskChanging();
  }

  showDeadline(deadline: string) {
    const time = moment(deadline);
    let append = "";

    if (this.isDeadlineViolated(deadline)) {
      append = " deadline violated!";
    }

    return time.format("DD.MM.YY, HH:mm") + append;
  }

  diffDeadline(deadline: string) {
    const time = moment(deadline);
    const now = moment();
    const days = time.diff(now, "days");

    if (days == 0) {
      return "Deadline today!";
    } else if (days < 0) {
      return "Deadline is violated"
    } else {
      return "Left " + days + " days to deadline";
    }
  }

  isDeadlineViolated(deadline: string) {
    const time = moment(deadline);
    const current = moment();

    return current.isAfter(time);
  }
}
