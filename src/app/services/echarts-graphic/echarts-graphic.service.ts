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
    vmHeader = '16px sans-serif',
    vmUtilisation = '22px sans-serif',
    vmStatus = '16px sans-serif',
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

  export class BaseGenerator{
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
  private readonly HEADER_WIDTH: number = 64;
  private readonly HEADER_HEIGHT: number = 100;
  private readonly BODY_WIDTH: number = 58;
  private readonly BODY_HEIGHT: number = 70;
  private readonly BODY_X_OFFSET: number = 3;
  private readonly BODY_Y_OFFSET: number = 27;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super()
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  public getVMGroup(
    vmName: string,
    utilisation: number,
    status: VMStatus,
    x: number,
    y: number,
  ): echarts.GraphicComponentOption {
    const baseCoordinate = {x:x, y:y} as Coordinate;
    const vmNameCoordinate = this.getVmNameCoordinate(vmName, EchartsGraphic.Font.vmHeader, baseCoordinate);
    const utilisationCoordinate = this.getUtilisationCoordinate(utilisation.toString(), EchartsGraphic.Font.vmUtilisation, baseCoordinate);
    const statusCoordinate = this.getStatusCoordinate(status, EchartsGraphic.Font.vmStatus, baseCoordinate);
    let VMGroup: echarts.GraphicComponentOption = {
      type: 'group',
      onclick: () => console.log('VM clicked'),
      children: [
        this.generateVMHeaderRect(baseCoordinate ,utilisationColourMapper(utilisation)),
        this.generateVMBodyRect(baseCoordinate),
        this.generateVMNameText(vmNameCoordinate, vmName),
        this.generateUtilisationText(utilisationCoordinate, utilisation, vmBodyTextColourMapper(utilisation)),
        this.generateStatusText(statusCoordinate,status, vmBodyTextColourMapper(utilisation)),
      ]
    }
    return VMGroup;
  };

  private generateVMHeaderRect(coordinate: Coordinate, colour: EchartsGraphic.Colour){
    return this.rectGenerator.genreate(
      coordinate.x, 
      coordinate.y, 
      this.HEADER_WIDTH, 
      this.HEADER_HEIGHT, 
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
      EchartsGraphic.Font.vmHeader, 
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
      EchartsGraphic.Font.vmHeader, 
      colour,
    )
  }

  private getVmNameCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Coordinate) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + (this.HEADER_WIDTH - shape.x)/2),
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
  private readonly BODY_WIDTH = 120;
  private readonly BODY_HEIGHT = 100;
  private readonly BODY_X_OFFSET = 32;
  private readonly BODY_Y_OFFSET = -5;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super()
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
      this.BODY_WIDTH,
      this.BODY_HEIGHT,
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
      x:Math.round(coordinate.x + this.BODY_X_OFFSET + (this.BODY_WIDTH - shape.x)/2),
      y:Math.round(coordinate.y + this.BODY_Y_OFFSET + (this.BODY_HEIGHT - shape.y)/2),
    } as Coordinate;
  }
}

class ZoneGenerator extends EchartsGraphic.BaseGenerator{
  private readonly BODY_WIDTH = 100;
  private readonly BODY_HEIGHT = 70;
  private readonly BODY_CORNER_ROUND = [15,15,15,15];
  private readonly BODY_BORDER_WIDTH = 1;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super()
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
      this.BODY_WIDTH,
      this.BODY_HEIGHT,
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
      x:Math.round(coordinate.x + (this.BODY_WIDTH - shape.x)/2),
      y:Math.round(coordinate.y + (this.BODY_HEIGHT - shape.y)/2),
    } as Coordinate;
  }
}



@Injectable({
  providedIn: 'root'
})
export class EchartsGraphicService{
  private vmGroupGenerator: VMGroupGenerator
  private lbGenerator: LoadBalanerGenerator
  private zoneGenerator: ZoneGenerator

  constructor() {
    this.vmGroupGenerator = new VMGroupGenerator();
    this.lbGenerator = new LoadBalanerGenerator();
    this.zoneGenerator = new ZoneGenerator();
  }

  public getVMGroup(
    vmName: string,
    utilisation: number,
    status: VMStatus,
    x: number,
    y: number,
  ): echarts.GraphicComponentOption {
    return this.vmGroupGenerator.getVMGroup(vmName, utilisation, status, x, y)
  };

  public getLoadBalancer(
    throughput: number, 
    x: number, 
    y: number
  ): echarts.GraphicComponentOption{
    return this.lbGenerator.getLoadBalancer(throughput, x, y);
  };

  public getZone(
    name: string, 
    x: number, 
    y: number
  ): echarts.GraphicComponentOption{
    return this.zoneGenerator.getZone(name, x, y);
  };
}
