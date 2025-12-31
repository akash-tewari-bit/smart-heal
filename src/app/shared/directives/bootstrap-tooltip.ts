import { Directive, ElementRef } from '@angular/core';
declare var bootstrap: any;

@Directive({
  selector: '[appBootstrapTooltip]',
  standalone: false
})
export class BootstrapTooltip {
 private tooltipInstance: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const hostElement = this.el.nativeElement;

    // Look for the next sibling as tooltip content
    const nextElement = hostElement.nextElementSibling;
    const htmlContent =
      nextElement && nextElement.classList.contains('tooltip-content')
        ? nextElement.innerHTML
        : '';

    // Initialize Bootstrap tooltip with HTML content
    this.tooltipInstance = new bootstrap.Tooltip(hostElement, {
      html: true,
      title: htmlContent,
      customClass: 'my-custom-tooltip',
      placement: 'top', // default — you can enhance to read from attributes
    });
  }

  ngOnDestroy(): void {
    this.tooltipInstance?.dispose();
  }
}
