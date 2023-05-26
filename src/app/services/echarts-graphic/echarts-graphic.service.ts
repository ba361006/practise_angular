import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

// this enum should be somewhere else, but we put it here for only practising
export enum VMStatus{
  online = 'Online',
  offline = 'Offline',
}

export enum LBStatus{
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

export interface EchartsVMGroup{
  vmGroup: EchartsElement
  networkPerformance: EchartsElement
}

export namespace EchartsGraphic{
  export enum Colour {
    white = '#ffffff',
    black = '#000000',
    rectGrey = '#D0D0D0',
    textGrey = '#8E8E8E',
    green = '#00A600',
    yellow = '#f7941d',
    red = '#ee3c39',
  };

  export enum Font{
    vmName = '16px sans-serif',
    vmUtilisation = '22px sans-serif',
    vmStatus = '16px sans-serif',
    vmNetworkPerformance = '17px sans-serif',
    lbNetworkPerformance = '17px sans-serif',
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
      opacity: number = 0.3,
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
          stroke: EchartsGraphic.Colour.black,
          opacity: opacity,
        },
      };
    }
  }

  export abstract class BaseGenerator{
    protected OUTTER_WIDTH: number;
    protected OUTTER_HEIGHT: number;

    constructor(width: number, height: number){
      // width and height is the width and the height of the most outter object
      this.OUTTER_WIDTH = width;
      this.OUTTER_HEIGHT = height;
    }

    protected getTopCoordinate(upperLeft: Coordinate, width: number = this.OUTTER_WIDTH): Coordinate{
      return {x:Math.round(upperLeft.x+width/2), y:upperLeft.y};
    }
    protected getBottmCoordinate(upperLeft: Coordinate, width: number = this.OUTTER_WIDTH, height: number = this.OUTTER_HEIGHT): Coordinate{
      return {x:Math.round(upperLeft.x+width/2), y:upperLeft.y+height};
    }
    protected getLeftCoordinate(upperLeft: Coordinate, height: number = this.OUTTER_HEIGHT): Coordinate{
      return {x:upperLeft.x, y:Math.round(upperLeft.y+height/2)};
    }
    protected getRightCoordinate(upperLeft: Coordinate, width: number = this.OUTTER_WIDTH, height: number = this.OUTTER_HEIGHT): Coordinate{
      return {x:upperLeft.x+width, y:Math.round(upperLeft.y+height/2)};
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
const vmUtilisationToTextColour = (utilisation: number) => {
  switch(true){
    case isGrey(utilisation): return EchartsGraphic.Colour.rectGrey;
    case isGreen(utilisation): return EchartsGraphic.Colour.green;
    case isYellow(utilisation): return EchartsGraphic.Colour.yellow;
    case isRed(utilisation): return EchartsGraphic.Colour.red;
    default:
      // should never get here
      throw new Error(`Invalid utilisation: ${utilisation}`)
  }
}
const lbStatusToRectColour = (status: LBStatus) => {
  return {
    [LBStatus.online]: EchartsGraphic.Colour.green,
    [LBStatus.offline]: EchartsGraphic.Colour.rectGrey,
  }[status]
}

const lbStatusToTextColour = (status: LBStatus) => {
  return {
    [LBStatus.online]: EchartsGraphic.Colour.green,
    [LBStatus.offline]: EchartsGraphic.Colour.textGrey,
  }[status]
}

const vmStatusToTextColour = (status: VMStatus) => {
  return {
    [VMStatus.online]: EchartsGraphic.Colour.black,
    [VMStatus.offline]: EchartsGraphic.Colour.textGrey,
  }[status]
}

class VMGroupGenerator extends EchartsGraphic.BaseGenerator{
  private readonly INNER_WIDTH: number = 58;
  private readonly INNER_HEIGHT: number = 70;
  private readonly INNER_X_OFFSET: number = 3;
  private readonly INNER_Y_OFFSET: number = 27;
  private readonly NETWORK_PERFORMANCE_Y_OFFSET: number = 5;
  private readonly NETWORK_PERFORMANCE_BOTTOM_Y_OFFSET: number = 8;

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
    const vmNameCoordinate = this.getVmNameCoordinate(coordinate, vmName, EchartsGraphic.Font.vmName);
    const utilisationCoordinate = this.getUtilisationCoordinate(coordinate, utilisation.toString(), EchartsGraphic.Font.vmUtilisation);
    const statusCoordinate = this.getStatusCoordinate(coordinate, status, EchartsGraphic.Font.vmStatus);
    const vmGroup: echarts.GraphicComponentOption = {
      type: 'group',
      onclick: () => console.log('VM clicked'),
      children: [
        this.generateVMHeaderRect(coordinate ,vmUtilisationToTextColour(utilisation)),
        this.generateVMBodyRect(coordinate),
        this.generateVMNameText(vmNameCoordinate, vmName),
        this.generateUtilisationText(utilisationCoordinate, utilisation, vmStatusToTextColour(status)),
        this.generateStatusText(statusCoordinate, status, vmStatusToTextColour(status)),
      ]
    }
    return {
      top: this.getTopCoordinate(coordinate),
      bottom: this.getBottmCoordinate(coordinate),
      left: this.getLeftCoordinate(coordinate),
      right: this.getRightCoordinate(coordinate),
      element: vmGroup,
    } as EchartsElement;
  };

  public getVMNetworkPerformance(
    coordinate: Coordinate,
    throughput: number,
    packetRate: number,
    status: VMStatus,
  ): EchartsElement{
    const text = `${throughput} Gbps\n${packetRate} Kpps`;
    const networkPerformanceCoordinate = this.getNetworkPerformanceCoordinate(coordinate, text, EchartsGraphic.Font.vmNetworkPerformance);
    const networkPerformance: echarts.GraphicComponentOption = this.generateNetworkPerformanceText(networkPerformanceCoordinate, text, vmStatusToTextColour(status))
    const textShape = this.getTextShape(text, EchartsGraphic.Font.vmNetworkPerformance);
    textShape.y += this.NETWORK_PERFORMANCE_BOTTOM_Y_OFFSET;
    return {
      top: this.getTopCoordinate(networkPerformanceCoordinate, textShape.x),
      bottom: this.getBottmCoordinate(networkPerformanceCoordinate, textShape.x, textShape.y),
      left: this.getLeftCoordinate(networkPerformanceCoordinate, textShape.y),
      right: this.getRightCoordinate(networkPerformanceCoordinate, textShape.x, textShape.y),
      element: networkPerformance,
    } as EchartsElement;
  }

  private generateVMHeaderRect(coordinate: Coordinate, colour: EchartsGraphic.Colour){
    return this.rectGenerator.genreate(
      coordinate.x, 
      coordinate.y, 
      this.OUTTER_WIDTH, 
      this.OUTTER_HEIGHT, 
      colour,
    );
  }

  private generateVMBodyRect(coordinate: Coordinate){
    return this.rectGenerator.genreate(
      coordinate.x + this.INNER_X_OFFSET,
      coordinate.y + this.INNER_Y_OFFSET,
      this.INNER_WIDTH,
      this.INNER_HEIGHT,
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

  private generateNetworkPerformanceText(cooridnate: Coordinate, text: string, colour: EchartsGraphic.Colour){
    return this.textGenerator.generate(
      cooridnate.x,
      cooridnate.y,
      text,
      EchartsGraphic.Font.vmNetworkPerformance,
      colour,
    )
  }

  private getVmNameCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + (this.OUTTER_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + (this.INNER_Y_OFFSET - shape.y)/2),
    } as Coordinate
  }
  
  private getUtilisationCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font) {
    const shape = this.getTextShape(text+'%', font);
    return {
      x: Math.round(coordinate.x + this.INNER_X_OFFSET + (this.INNER_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + this.INNER_Y_OFFSET + 0.18*this.INNER_HEIGHT),
    } as Coordinate
  }

  private getStatusCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + this.INNER_X_OFFSET + (this.INNER_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + this.INNER_Y_OFFSET + (this.INNER_HEIGHT - (0.18*this.INNER_HEIGHT+shape.y)))
    } as Coordinate;
  }

  private getNetworkPerformanceCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + (this.OUTTER_WIDTH - shape.x)/2),
      y: this.getBottmCoordinate(coordinate).y + this.NETWORK_PERFORMANCE_Y_OFFSET,
    } as Coordinate;
  }
}

class LoadBalanerGenerator extends EchartsGraphic.BaseGenerator{
  private readonly INNER_X_OFFSET = 27;
  private readonly INNER_Y_OFFSET = -10;
  private readonly NETWORK_PERFORMANCE_Y_OFFSET = 5;
  private readonly NETWORK_PERFORMANCE_X_OFFSET = 5;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super(120, 100)
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  public getLoadBalancer(coordinate: Coordinate, name: string, status: LBStatus, throughput: number): EchartsElement{
    const lbBodyText = `${name}\n\n(${status})`;
    const vmThroughputText = throughput.toString() + ' Gbps'
    const lbBodyTextCoordinate = this.getLBBodyCoordinate(coordinate, lbBodyText, EchartsGraphic.Font.lbBody);
    const lbNetworkPerformanceTopCoordinate = this.getLBNetworkPerformanceTopCoordinate(coordinate, vmThroughputText, EchartsGraphic.Font.lbNetworkPerformance)
    const lbNetworkPerformanceLeftCoordinate = this.getLBNetworkPerformanceLeftCoordinate(coordinate, vmThroughputText, EchartsGraphic.Font.lbNetworkPerformance)
    const lbNetworkPerformanceRightCoordinate = this.getLBNetworkPerformanceRightCoordinate(coordinate, vmThroughputText, EchartsGraphic.Font.lbNetworkPerformance)
    const lbGroup: echarts.GraphicComponentOption = {
      type: 'group',
      onclick: () => console.log('LB clicked'),
      children: [
        this.generateLBBodyRect(coordinate, lbStatusToRectColour(status)),
        this.generateLBBodyText(lbBodyTextCoordinate, lbBodyText),
        this.generateLBNetworkPerformanceText(lbNetworkPerformanceTopCoordinate, vmThroughputText),
        this.generateLBNetworkPerformanceText(lbNetworkPerformanceLeftCoordinate, vmThroughputText),
        this.generateLBNetworkPerformanceText(lbNetworkPerformanceRightCoordinate, vmThroughputText),
      ]
    };
    return {
      top: this.getTopCoordinate(coordinate),
      bottom: this.getBottmCoordinate(coordinate),
      left: this.getLeftCoordinate(coordinate),
      right: this.getRightCoordinate(coordinate),
      element: lbGroup,
    } as EchartsElement;
  }
  
  private generateLBNetworkPerformanceText(coordinate: Coordinate, text: string){
    return this.textGenerator.generate(
      coordinate.x,
      coordinate.y,
      text,
      EchartsGraphic.Font.lbNetworkPerformance,
      EchartsGraphic.Colour.black,
    );
  }

  private generateLBBodyRect(coordinate: Coordinate, colour: EchartsGraphic.Colour) {
    return this.rectGenerator.genreate(
      coordinate.x,
      coordinate.y,
      this.OUTTER_WIDTH,
      this.OUTTER_HEIGHT,
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

  private getLBBodyCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font) {
    // we need the INNER_X_OFFSET because we set the textAlign to centre here
    const shape = this.getTextShape(text, font);
    return {
      x:Math.round(coordinate.x + this.INNER_X_OFFSET + (this.OUTTER_WIDTH - shape.x)/2),
      y:Math.round(coordinate.y + this.INNER_Y_OFFSET + (this.OUTTER_HEIGHT - shape.y)/2),
    } as Coordinate;
  }
  
  private getLBNetworkPerformanceTopCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font){
    const shape = this.getTextShape(text, font);
    return{
      x: coordinate.x + (this.OUTTER_WIDTH - shape.x)/2,
      y: coordinate.y - shape.y - this.NETWORK_PERFORMANCE_Y_OFFSET,
    };
  }
  private getLBNetworkPerformanceLeftCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font){
    const shape = this.getTextShape(text, font);
    const left = this.getLeftCoordinate(coordinate);
    return{
      x: left.x - shape.x - this.NETWORK_PERFORMANCE_X_OFFSET,
      y: left.y - shape.y - this.NETWORK_PERFORMANCE_Y_OFFSET,
    };
  }
  private getLBNetworkPerformanceRightCoordinate(coordinate: Coordinate, text: string, font: EchartsGraphic.Font){
    const shape = this.getTextShape(text, font);
    const right = this.getRightCoordinate(coordinate);
    return{
      x: right.x + this.NETWORK_PERFORMANCE_X_OFFSET,
      y: right.y - shape.y - this.NETWORK_PERFORMANCE_Y_OFFSET,
    };
  }
}

class ZoneGenerator extends EchartsGraphic.BaseGenerator{
  private readonly CORNER_ROUND = [15,15,15,15];
  private readonly OUTTER_BORDER_WIDTH = 1;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    super(100, 70)
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  public getZone(coordinate: Coordinate, name: string): EchartsElement{
    const bodyText = 'Zone ' + name;
    const lbBodyTextCoordinate = this.getZoneBodyCoordinate(bodyText, EchartsGraphic.Font.zoneBody, coordinate);
    let zoneGroup: echarts.GraphicComponentOption = {
      type: 'group',
      children: [
        this.generateZoneBodyRect(coordinate),
        this.generateZoneBodyText(lbBodyTextCoordinate, bodyText),
      ]
    };
    return {
      top: this.getTopCoordinate(coordinate),
      bottom: this.getBottmCoordinate(coordinate),
      left: this.getLeftCoordinate(coordinate),
      right: this.getRightCoordinate(coordinate),
      element: zoneGroup,
    } as EchartsElement;
  }
  

  private generateZoneBodyRect(coordinate: Coordinate) {
    return this.rectGenerator.genreate(
      coordinate.x,
      coordinate.y,
      this.OUTTER_WIDTH,
      this.OUTTER_HEIGHT,
      EchartsGraphic.Colour.white,
      this.CORNER_ROUND,
      EchartsGraphic.Colour.black,
      this.OUTTER_BORDER_WIDTH,
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
    // we need the INNER_X_OFFSET because we set the textAlign to centre here
    const shape = this.getTextShape(text, font);
    return {
      x:Math.round(coordinate.x + (this.OUTTER_WIDTH - shape.x)/2),
      y:Math.round(coordinate.y + (this.OUTTER_HEIGHT - shape.y)/2),
    } as Coordinate;
  }
}

class LinkGenerator{
  private lineGenerator: EchartsGraphic.LineGenerator;

  constructor(){
    this.lineGenerator = new EchartsGraphic.LineGenerator();
  }

  drawLine(
    from: Coordinate,
    to: Coordinate,
    opacity?: number,
  ): echarts.GraphicComponentOption{
    return this.lineGenerator.generate(
      from.x,
      from.y,
      to.x,
      to.y,
      opacity,
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
    throughput: number,
    packetRate: number,
  ): EchartsVMGroup {
    const upperLeftCooridnate: Coordinate = {x:x, y:y};
    return {
      vmGroup: this.vmGroupGenerator.getVMGroup(
        upperLeftCooridnate, 
        vmName, 
        utilisation, 
        status, 
      ),
      networkPerformance: this.vmGroupGenerator.getVMNetworkPerformance(
        upperLeftCooridnate,
        throughput,
        packetRate,
        status,
      )
    } as EchartsVMGroup;
  };

  public getLoadBalancer(
    x: number, 
    y: number,
    name: string,
    status: LBStatus, 
    throughput: number,
  ): EchartsElement{
    return this.lbGenerator.getLoadBalancer({x:x, y:y} as Coordinate, name, status, throughput);
  };

  public getZone(
    x: number, 
    y: number,
    name: string, 
  ): EchartsElement{
    return this.zoneGenerator.getZone({x:x, y:y} as Coordinate, name);
  };

  public drawLine(
    from: Coordinate,
    to: Coordinate,
    opacity?: number,
  ): echarts.GraphicComponentOption{
    return this.linkGenerator.drawLine(from, to, opacity);
  };
}
