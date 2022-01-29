import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute} from "@angular/router";
import {ColumnService} from "../shared/services/column.service";
import {ProjectColumn} from "../shared/dto/project-dto";

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
              private columnService: ColumnService) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("id") as unknown as number;

    this.columnService.getColumns(this.projectId).subscribe({
      next: columns => this.columns = columns
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      this.columnService.changeColumnIndex({
        from: event.previousIndex + 1,
        to: event.currentIndex + 1,
        projectId: this.projectId
      }).subscribe({
        next: () => moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
      });
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
    /*const task = event.target.value as string;

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
    this.creationNewTask = false;*/
  }

  creationColumnUnFocus(event: any) {
    const column = event.target.value as string;

    if (column) {
      this.columnService.createColumn({projectId: this.projectId, name: column}).subscribe({
        next: id => {
          this.columns.push({name: column, id: id});
        }
      })
    }

    this.creationNewColumn = false;
  }

  delete(value: any) {
  /*  if (value.index) {
      // deleting column
      this.columns = this.columns.filter(column => column.index !== value.index);
    } else {
      // deleting task
      this.columns.forEach(column => {
        column.tasks = column.tasks.filter(task => task.name !== value.name)
      });
    }*/
  }

 /* startCreateTask(column: Column) {
    this.creationNewTask = true;
    this.creationColumnIndex = column.index;
    this.changeDetector.detectChanges();
    this.creationTaskInput.nativeElement.focus();
  }*/

  startCreateColumn() {
    this.creationNewColumn = true;
    this.changeDetector.detectChanges();
    this.creationColumnInput.nativeElement.focus();
  }
}
