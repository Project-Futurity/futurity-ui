import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[dragScroll]'
})
export class DragScrollDirective implements OnInit {
  private element: HTMLElement;
  private downX = 0;
  private isPressed: boolean;
  private disabledElements: string[] = [];

  @Input("drag-scroll-disable")
  get elements() { return this.disabledElements }
  set elements(value: string[]) { this.disabledElements = value; }

  constructor(private elementRef: ElementRef, private render: Renderer2) {}

  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.initDrag();
  }

  initDrag(): void {
    this.render.listen(this.element, "mousedown", e => this.handleClick(e));
    this.render.listen(this.element, "mousemove", e => this.handleMouseMoving(e))
    this.render.listen(this.element, "mouseup", () => this.handleDetach());
  }


  private handleClick(event: MouseEvent) {
    if (this.hasDisabledClass(event.target)) {
      return;
    }

    this.downX = event.clientX;
    this.isPressed = true;
  }

  private handleMouseMoving(event: MouseEvent) {
    event.preventDefault();
    if (event.clientX != this.downX && this.isPressed) {
      const clientX = event.clientX;
      this.element.scrollLeft = this.element.scrollLeft - clientX + this.downX;
      this.downX = clientX;
    }
  }

  private handleDetach() {
    this.isPressed = false;
  }

  private hasDisabledClass(element: any): boolean {
    const classList = element.classList as DOMTokenList;

    if (classList) {
      const contain = this.disabledElements.some(clazz => classList.contains(clazz));

      if (contain) {
        return true;
      }
    }

    return element.parentNode && this.hasDisabledClass(element.parentNode);
  }
}
