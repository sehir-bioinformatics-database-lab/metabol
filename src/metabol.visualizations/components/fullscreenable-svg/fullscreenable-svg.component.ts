import { Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import {CoreVisualizationComponent} from '../core-visualization';
import {FbaNode, FbaLink, SubsystemNode} from '../../models/fbaiteration';
@Component({
  selector: 'fullscreenable-svg',
  templateUrl: 'fullscreenable-svg.component.html',
  styleUrls: ['fullscreenable-svg.component.css']
})
export class FullScreenableSvgComponent {

  @Input() isFullScreen: Boolean;
  @Input() nodes: Array<FbaNode>;

  @Output() isFullScreenChange: EventEmitter<Boolean>;

  zoom: d3.behavior.Zoom<any>;
  scale: number;
  translate: Array<number>;


  constructor(private elementRef: ElementRef) {
    this.scale = 1;
    this.translate = [0, 0];

    this.isFullScreen = this.isFullScreen || false;
    this.isFullScreenChange = new EventEmitter<Boolean>();
  }

  scaleValue() {

    let bound: any = document.querySelector("svg g");
    let bounds = bound.getBBox();
    let parent = document.querySelector("svg").getBoundingClientRect();

    let fullWidth = parent.width,
        fullHeight = parent.height;

    let width = bounds.width,
        height = bounds.height;

    let midX = bounds.x + width / 2,
        midY = bounds.y + height / 2;

    let svg = document.querySelector("svg g");
    let svgSize = svg.getBoundingClientRect();


    if ((svgSize.height - parent.height) > (svgSize.width - parent.width)) {
      this.scale = (this.scale * (parent.height / svgSize.height)) - 0.02
      console.log("minimized from height");
    }

    else {
      this.scale = (this.scale * (parent.width / svgSize.width));
      console.log("minimized from width");
    }


    let translate_x = fullWidth / 2 - this.scale * midX,
        translate_y =  fullHeight / 2 - this.scale * midY;
    this.translate = [translate_x, translate_y]


    console.log("translate value", this.translate)
    console.log("scale value", this.scale)
  }

  ngOnInit() {
    this.zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', () => this.onZoom());

    d3.select(this.elementRef.nativeElement)
      .select('svg')
      .call(this.zoom);
  }

  onZoom() {
    this.scale = this.zoom.scale();
    this.translate = this.zoom.translate();
  }


  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.isFullScreenChange.emit(this.isFullScreen);
  }

  getSizeOfSvg(): [number, number] {
    let sizes = document.getElementsByTagName("svg")[0].getBoundingClientRect();
    return [sizes.width, sizes.height];
  }

}
