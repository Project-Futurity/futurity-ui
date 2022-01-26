import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ContextMenuComponent} from "ngx-contextmenu";

interface Task {
  name: string;
}

interface Column {
  index: number;
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-kanban-page',
  templateUrl: './kanban-page.component.html',
  styleUrls: ['./kanban-page.component.css']
})
export class KanbanPageComponent {
  creationNewTask = false;
  creationColumnIndex: number = -1;
  @ViewChild("input_box") creationTaskInput: ElementRef;
  @ViewChild(ContextMenuComponent, {static: true}) basicMenu: ContextMenuComponent;

  creationNewColumn = false;
  @ViewChild("input_column") creationColumnInput: ElementRef;

  columns: Column[] = [
    {
      index: 1, name: "To do", tasks: [
        {name: "Spring boot"},
        {name: "Spring boot"},
        {name: "Spring boot"},
      ]
    },
  ];

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  creationTaskUnFocus(event: any) {
    const task = event.target.value as string;

    if (task) {
      this.columns.forEach(column => {
        if (column.index === this.creationColumnIndex) {
          if (task != '+') {
            column.tasks.push({name: task});
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
      this.columns.push({
        name: column,
        tasks: [],
        index: 24
      });
    }

    this.creationNewColumn = false;
  }

  delete(value: any) {
    if (value.index) {
      // deleting column
      this.columns = this.columns.filter(column => column.index !== value.index);
    } else {
      // deleting task
      this.columns.forEach(column => {
        column.tasks = column.tasks.filter(task => task.name !== value.name)
      });
    }
  }

  startCreateTask(column: Column) {
    this.creationNewTask = true;
    this.creationColumnIndex = column.index;
    this.changeDetector.detectChanges();
    this.creationTaskInput.nativeElement.focus();
  }

  startCreateColumn() {
    this.creationNewColumn = true;
    this.changeDetector.detectChanges();
    this.creationColumnInput.nativeElement.focus();
  }
}
