import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

interface Column {
  name: string;
  tasks: string[];
}

@Component({
  selector: 'app-kanban-page',
  templateUrl: './kanban-page.component.html',
  styleUrls: ['./kanban-page.component.css']
})
export class KanbanPageComponent {
  columns: Column[] = [
    {
      name: "To do", tasks: [
        "Spring boot", "Spring security", "Spring MVC", "Spring data"
      ]
    },
    {name: "Done", tasks: ["Spring boot", "Spring security", "Spring MVC", "Spring data"]},
    {name: "Done", tasks: []},
    {name: "Done", tasks: ["Spring boot", "Spring security", "Spring MVC", "Spring data"]},
    {name: "Done", tasks: []},
    {name: "Done", tasks: []},
  ];

  constructor() {
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
}
