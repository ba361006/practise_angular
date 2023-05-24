import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

// this enum should be somewhere else, but we put it here for only practising
export enum VMStatus{
  online = 'Online',
  offline = 'Offline',
}

enum LBStatus{
  online = 'Online',
  offline = 'Offline',
}
export interface Coordinate{
  x: number,
  y: number,
}

export interface EchartsElement{
  element: echarts.GraphicComponentOption
  top: Coordinate
  bottom: Coordinate
  left: Coordinate
  right: Coordinate
}

export namespace EchartsGraphic{
  export enum Colour {
    white = '#ffffff',
    black = '#000000',
    grey = '#D0D0D0',
    textGrey = '#8E8E8E',
    green = '#00A600',
    yellow = '#f7941d',
    red = '#ee3c39',
  };

  export enum Font{
    vmName = '16px sans-serif',
    vmUtilisation = '22px sans-serif',
    vmStatus = '16px sans-serif',
    vmThroughput = '17px sans-serif',
    lbBody = '16px sans-serif',
    zoneBody = '16px sans-serif',
  };

  export enum TextAlign{
    left = 'left',
    centre = 'center',
    right = 'right',
  }
  export class RectangleGenerator {
    // echarts doc -> graphic.elements.rect
    genreate(
      x: number, 
      y: number, 
      width: number, 
      height: number, 
      colour: EchartsGraphic.Colour,
      round?: number[],
      borderColour?: EchartsGraphic.Colour,
      borderWidth?: number,
    ){
      return {
        type: 'rect',
        shape: {
          x: x,
          y: y,
          width: width,
          height: height,
          r: round,
        },
        style: {
          fill: colour, 
          stroke: borderColour,
          lineWidth: borderWidth,
        },
      };
    };
  }

  export class TextGenerator{
    // echarts doc -> graphic.elements.text
    generate(
      x: number,
      y: number,
      text: string,
      font: EchartsGraphic.Font,
      colour: EchartsGraphic.Colour,
      textAlign?: EchartsGraphic.TextAlign,
    ) {
      return {
        type: 'text', 
        x:x, 
        y:y, 
        style:{
          text: text,
          fill: colour,
          font: font,
          textAlign: textAlign,
        }
      };
    }
  };

  export class LineGenerator{
    generate(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ): echarts.GraphicComponentOption{
      return {
        type: 'line',
        shape: {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
        },
        style: {
          stroke: EchartsGraphic.Colour.black
        },
      };
    }
  }

  export abstract class BaseGenerator{
    protected WIDTH: number;
    protected HEIGHT: number;

    constructor(width: number, height: number){
      // width and height is the width and the height of the most outter object
      this.WIDTH = width;
      this.HEIGHT = height;
    }

    protected getTopCoordinate(upperLeft: Coordinate): Coordinate{
      return {x:Math.round(upperLeft.x+this.WIDTH/2), y:upperLeft.y}
    }
    protected getBottmCoordinate(upperLeft: Coordinate): Coordinate{
      return {x:Math.round(upperLeft.x+this.WIDTH/2), y:upperLeft.y+this.HEIGHT}
    }
    protected getleftCoordinate(upperLeft: Coordinate): Coordinate{
      return {x:upperLeft.x, y:Math.round(upperLeft.y+this.HEIGHT/2)};
    }
    protected getRightCoordinate(upperLeft: Coordinate): Coordinate{
      return {x:upperLeft.x+this.WIDTH, y:Math.round(upperLeft.y+this.HEIGHT/2)}
    }

    protected getTextShape(text: string, font: EchartsGraphic.Font): Coordinate{
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas context is not supported.');
      context.font = font;

      const lines = text.split('\n');
      let width = 0;
      let height = 0;
      for (const line of lines){
        const metrics = context.measureText(line);
        const lineWidth = metrics.width;
        const lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        width = Math.max(width, lineWidth)
        height += lineHeight;
      }
      return {x: width, y: height} as Coordinate;
    }
  };
}

// factory should be a library
// Make colour mapper factory that should produce vmcolour / lb colour / line colour
const isGrey = (utilisation: number) => utilisation == 0
const isGreen = (utilisation: number) => utilisation < 50
const isYellow = (utilisation: number) => 50 <= utilisation && utilisation <= 70
const isRed = (utilisation: number) => utilisation > 70
const vmBodyTextColourMapper = (utilisation: number) => {
  switch(true){
    case isGrey(utilisation): return EchartsGraphic.Colour.textGrey;
    case isGreen(utilisation): return EchartsGraphic.Colour.black;
    case isYellow(utilisation): return EchartsGraphic.Colour.black;
    case isRed(utilisation): return EchartsGraphic.Colour.black;
    default:
      // should never get here
      throw new Error(`Invalid utilisation: ${utilisation}`)
  }
}
const utilisationColourMapper = (utilisation: number) => {
  switch(true){
    case isGrey(utilisation): return EchartsGraphic.Colour.grey;
    case isGreen(utilisation): return EchartsGraphic.Colour.green;
    case isYellow(utilisation): return EchartsGraphic.Colour.yellow;
    case isRed(utilisation): return EchartsGraphic.Colour.red;
    default:
      // should never get here
      throw new Error(`Invalid utilisation: ${utilisation}`)
  }
}
const throughputColourMapper = (throughput: number) => {
  switch(true){
    case isGrey(throughput): return EchartsGraphic.Colour.grey;
    case isGreen(throughput): return EchartsGraphic.Colour.green;
    case isYellow(throughput): return EchartsGraphic.Colour.yellow;
    case isRed(throughput): return EchartsGraphic.Colour.red;
    default:
      // should never get here
      throw new Error(`Invalid throughput: ${throughput}`)
  }
}

class VMGroupGenerator extends EchartsGraphic.BaseGenerator{
  private readonly BODY_WIDTH: number = 58;
  private readonly BODY_HEIGHT: number = 70;
  private readonly BODY_X_OFFSET: number = 3;
  private readonly BODY_Y_OFFSET: number = 27;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super(64, 100);
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  public getVMGroup(
    coordinate: Coordinate,
    vmName: string,
    utilisation: number,
    status: VMStatus,
  ): EchartsElement {
    const vmNameCoordinate = this.getVmNameCoordinate(vmName, EchartsGraphic.Font.vmName, coordinate);
    const utilisationCoordinate = this.getUtilisationCoordinate(utilisation.toString(), EchartsGraphic.Font.vmUtilisation, coordinate);
    const statusCoordinate = this.getStatusCoordinate(status, EchartsGraphic.Font.vmStatus, coordinate);
    let VMGroup: echarts.GraphicComponentOption = {
      type: 'group',
      onclick: () => console.log('VM clicked'),
      children: [
        this.generateVMHeaderRect(coordinate ,utilisationColourMapper(utilisation)),
        this.generateVMBodyRect(coordinate),
        this.generateVMNameText(vmNameCoordinate, vmName),
        this.generateUtilisationText(utilisationCoordinate, utilisation, vmBodyTextColourMapper(utilisation)),
        this.generateStatusText(statusCoordinate,status, vmBodyTextColourMapper(utilisation)),
      ]
    }
    return {
      top: this.getTopCoordinate(coordinate),
      bottom: this.getBottmCoordinate(coordinate),
      left: this.getleftCoordinate(coordinate),
      right: this.getRightCoordinate(coordinate),
      element: VMGroup,
    } as EchartsElement;
  };

  private generateVMHeaderRect(coordinate: Coordinate, colour: EchartsGraphic.Colour){
    return this.rectGenerator.genreate(
      coordinate.x, 
      coordinate.y, 
      this.WIDTH, 
      this.HEIGHT, 
      colour,
    );
  }

  private generateVMBodyRect(coordinate: Coordinate){
    return this.rectGenerator.genreate(
      coordinate.x + this.BODY_X_OFFSET,
      coordinate.y + this.BODY_Y_OFFSET,
      this.BODY_WIDTH,
      this.BODY_HEIGHT,
      EchartsGraphic.Colour.white,
    )
  }

  private generateVMNameText(coordinate: Coordinate, vmName:string){
    return this.textGenerator.generate(
      coordinate.x, 
      coordinate.y, 
      vmName, 
      EchartsGraphic.Font.vmName, 
      EchartsGraphic.Colour.white,
    )
  }

  private generateUtilisationText(coordinate: Coordinate, utilisation:number, colour: EchartsGraphic.Colour){
    return this.textGenerator.generate(
      coordinate.x, 
      coordinate.y, 
      utilisation.toString()+'%', 
      EchartsGraphic.Font.vmUtilisation, 
      colour,
    )
  }

  private generateStatusText(coordinate: Coordinate, status:string, colour: EchartsGraphic.Colour){
    return this.textGenerator.generate(
      coordinate.x,
      coordinate.y,
      status, 
      EchartsGraphic.Font.vmName, 
      colour,
    )
  }

  private getVmNameCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Coordinate) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + (this.WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + (this.BODY_Y_OFFSET - shape.y)/2),
    } as Coordinate
  }
  
  private getUtilisationCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Coordinate) {
    const shape = this.getTextShape(text+'%', font);
    return {
      x: Math.round(coordinate.x + this.BODY_X_OFFSET + (this.BODY_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + this.BODY_Y_OFFSET + 0.18*this.BODY_HEIGHT),
    } as Coordinate
  }

  private getStatusCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Coordinate) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + this.BODY_X_OFFSET + (this.BODY_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + this.BODY_Y_OFFSET + (this.BODY_HEIGHT - (0.18*this.BODY_HEIGHT+shape.y)))
    } as Coordinate;
  }
}

class LoadBalanerGenerator extends EchartsGraphic.BaseGenerator{
  private readonly BODY_X_OFFSET = 32;
  private readonly BODY_Y_OFFSET = -5;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super(120, 100)
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  public getLoadBalancer(throughput: number, x: number, y: number): echarts.GraphicComponentOption{
    const baseCoordinate = {x: x, y: y};
    const lbBodyText = `Load\nBalancer\n(${this.throughputStatusMapper(throughput)})`;
    const lbBodyTextCoordinate = this.getLBBodyCoordinate(lbBodyText, EchartsGraphic.Font.lbBody, baseCoordinate);
    let lbGroup: echarts.GraphicComponentOption = {
      type: 'group',
      onclick: () => console.log('LB clicked'),
      children: [
        this.generateLBBodyRect(baseCoordinate, throughputColourMapper(throughput)),
        this.generateLBBodyText(lbBodyTextCoordinate, lbBodyText),
      ]
    };
    return lbGroup;
  }
  
  private throughputStatusMapper(throughput: number): string {
    // make this specific for lb after colour factory is done
    switch(true){
      case isGrey(throughput): return LBStatus.offline;
      case isGreen(throughput): return LBStatus.online;
      case isYellow(throughput): return LBStatus.online;
      case isRed(throughput): return LBStatus.online;
      default:
        // should never get here
        throw new Error(`Invalid throughput: ${throughput}`)
    }
  }

  private generateLBBodyRect(coordinate: Coordinate, colour: EchartsGraphic.Colour) {
    return this.rectGenerator.genreate(
      coordinate.x,
      coordinate.y,
      this.WIDTH,
      this.HEIGHT,
      colour,
    );
  }

  private generateLBBodyText(coordinate: Coordinate, text: string) {
    return this.textGenerator.generate(
      coordinate.x,
      coordinate.y,
      text,
      EchartsGraphic.Font.lbBody,
      EchartsGraphic.Colour.white,
      EchartsGraphic.TextAlign.centre,
    )
  }

  private getLBBodyCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Coordinate) {
    // we need the BODY_X_OFFSET because we set the textAlign to centre here
    const shape = this.getTextShape(text, font);
    return {
      x:Math.round(coordinate.x + this.BODY_X_OFFSET + (this.WIDTH - shape.x)/2),
      y:Math.round(coordinate.y + this.BODY_Y_OFFSET + (this.HEIGHT - shape.y)/2),
    } as Coordinate;
  }
}

class ZoneGenerator extends EchartsGraphic.BaseGenerator{
  private readonly BODY_CORNER_ROUND = [15,15,15,15];
  private readonly BODY_BORDER_WIDTH = 1;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super(100, 70)
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  public getZone(name: string, x: number, y: number): echarts.GraphicComponentOption{
    const baseCoordinate = {x: x, y: y};
    const bodyText = 'Zone ' + name;
    const lbBodyTextCoordinate = this.getZoneBodyCoordinate(bodyText, EchartsGraphic.Font.zoneBody, baseCoordinate);
    let lbGroup: echarts.GraphicComponentOption = {
      type: 'group',
      children: [
        this.generateZoneBodyRect(baseCoordinate),
        this.generateZoneBodyText(lbBodyTextCoordinate, bodyText),
      ]
    };
    return lbGroup;
  }
  

  private generateZoneBodyRect(coordinate: Coordinate) {
    return this.rectGenerator.genreate(
      coordinate.x,
      coordinate.y,
      this.WIDTH,
      this.HEIGHT,
      EchartsGraphic.Colour.white,
      this.BODY_CORNER_ROUND,
      EchartsGraphic.Colour.black,
      this.BODY_BORDER_WIDTH,
    );
  }

  private generateZoneBodyText(coordinate: Coordinate, text: string) {
    return this.textGenerator.generate(
      coordinate.x,
      coordinate.y,
      text,
      EchartsGraphic.Font.zoneBody,
      EchartsGraphic.Colour.black,
    )
  }

  private getZoneBodyCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Coordinate) {
    // we need the BODY_X_OFFSET because we set the textAlign to centre here
    const shape = this.getTextShape(text, font);
    return {
      x:Math.round(coordinate.x + (this.WIDTH - shape.x)/2),
      y:Math.round(coordinate.y + (this.HEIGHT - shape.y)/2),
    } as Coordinate;
  }
}

class LinkGenerator{
  private textGenerator: EchartsGraphic.TextGenerator;
  private lineGenerator: EchartsGraphic.LineGenerator;

  constructor(){
    this.textGenerator = new EchartsGraphic.TextGenerator();
    this.lineGenerator = new EchartsGraphic.LineGenerator();
  }

  drawLine(
    from: Coordinate,
    to: Coordinate
  ): echarts.GraphicComponentOption{
    return this.lineGenerator.generate(
      from.x,
      from.y,
      to.x,
      to.y,
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class EchartsGraphicService{
  private vmGroupGenerator: VMGroupGenerator
  private lbGenerator: LoadBalanerGenerator
  private zoneGenerator: ZoneGenerator
  private linkGenerator: LinkGenerator

  constructor() {
    this.vmGroupGenerator = new VMGroupGenerator();
    this.lbGenerator = new LoadBalanerGenerator();
    this.zoneGenerator = new ZoneGenerator();
    this.linkGenerator = new LinkGenerator();
  }

  public getVMGroup(
    x: number,
    y: number,
    vmName: string,
    utilisation: number,
    status: VMStatus,
  ): EchartsElement {
    return this.vmGroupGenerator.getVMGroup({x:x, y:y}, vmName, utilisation, status)
  };

  public getLoadBalancer(
    x: number, 
    y: number,
    throughput: number, 
  ): echarts.GraphicComponentOption{
    return this.lbGenerator.getLoadBalancer(throughput, x, y);
  };

  public getZone(
    x: number, 
    y: number,
    name: string, 
  ): echarts.GraphicComponentOption{
    return this.zoneGenerator.getZone(name, x, y);
  };

  public drawLine(
    from: Coordinate,
    to: Coordinate
  ): echarts.GraphicComponentOption{
    return this.linkGenerator.drawLine(from, to);
  };
}
