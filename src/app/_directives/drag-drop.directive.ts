import { Directive, ElementRef, NgZone, OnInit } from '@angular/core';
import { ElementComponent } from '@app/_components/canvas/element/element.component';
declare var $: any;

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective implements OnInit {

  constructor(private el: ElementRef, private ngZone: NgZone, private elementComponent: ElementComponent) {

  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const element = $(this.el.nativeElement);
      const iconDiv = element.find('.iconclassname');
      element.find('.dd_icon').draggable({
        handle: '.circle',
        containment: '#canvas',
        start: () => { },
        stop: (event: Event, ui: any) => {
          this.elementComponent.endpoint.xpos = Math.round(ui.position.left);
          this.elementComponent.endpoint.ypos = Math.round(ui.position.top);
          this.elementComponent.dragEndedOuter(this.elementComponent.endpoint, ui.position);
        },
        drag: (event: Event, ui: any) => {
          this.elementComponent.dragMovedOuter(this.elementComponent.endpoint, ui.position);
        }
      });

      element.find('.dd_icon').droppable({
        drop: (event: Event, ui: any) => {
          console.log(event, ui);
        }
      });

      $(iconDiv).draggable({
        revert: true,
        containment: '#canvas',
        start: () => { },
        stop: (event: Event, ui: any) => {
          this.elementComponent.dragEndedInner(this.elementComponent.endpoint, ui.position);
        },
        drag: (event: Event, ui: any) => {
          this.elementComponent.dragMovedInner(this.elementComponent.endpoint, ui.position);
        }
      });
    });
  }
}
