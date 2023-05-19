import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

// this enum should be somewhere else, but we put it here for only practising
export enum VMStatus{
  online = 'Online',
  offline = 'Offline',
}
export interface Cooridnate{
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
    header = '16px sans-serif',
    utilisation = '22px sans-serif',
    status = '16px sans-serif',
  };

  export class RectangleGenerator {
    genreate(
      x: number, 
      y: number, 
      width: number, 
      height: number, 
      colour: EchartsGraphic.Colour,
    ){
      return {
        type: 'rect',
        shape: {
          x: x,
          y: y,
          width: width,
          height: height,
        },
        style: {fill: colour},
      };
    };
  }

  export class TextGenerator{
    generate(
      x: number,
      y: number,
      text: string,
      font: EchartsGraphic.Font,
      colour: EchartsGraphic.Colour,
    ) {
      return {
        type: 'text', 
        x:x, 
        y:y, 
        style:{
          text: text,
          fill: colour,
          font: font,
        }
      };
    }
  };
}

// factory should be a library
// Make colour mapper factory that should produce vmcolour / lb colour / line colour
const isGrey = (utilisation: number) => utilisation == 0
const isGreen = (utilisation: number) => utilisation < 50
const isYellow = (utilisation: number) => 50 <= utilisation && utilisation <= 70
const isRed = (utilisation: number) => utilisation > 70
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

class VMGroupGenerator{
  private readonly VM_HEADER_WIDTH: number = 64;
  private readonly VM_HEADER_HEIGHT: number = 100;
  private readonly VM_BODY_WIDTH: number = 58;
  private readonly VM_BODY_HEIGHT: number = 70;
  private readonly VM_BODY_X_OFFSET: number = 3;
  private readonly VM_BODY_Y_OFFSET: number = 27;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
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
    const baseCoordinate = {x:x, y:y} as Cooridnate;
    const vmNameCoordinate = this.getVmNameCoordinate(vmName, EchartsGraphic.Font.header, baseCoordinate);
    const utilisationCoordinate = this.getUtilisationCoordinate(utilisation.toString(), EchartsGraphic.Font.utilisation, baseCoordinate);
    const statusCoordinate = this.getStatusCoordinate(status, EchartsGraphic.Font.status, baseCoordinate);
    let VMGroup: echarts.GraphicComponentOption = {
      type: 'group',
      draggable: true,
      onclick: () => console.log('VM clicked'),
      children: [
        this.generateVMHeaderRect(baseCoordinate ,utilisationColourMapper(utilisation)),
        this.generateVMBodyRect(baseCoordinate),
        this.generateVMNameText(vmNameCoordinate, vmName),
        this.generateUtilisationText(utilisationCoordinate, utilisation),
        this.generateStatusText(statusCoordinate,status),
      ]
    }
    return VMGroup;
  };

  private generateVMHeaderRect(coordinate: Cooridnate, colour: EchartsGraphic.Colour){
    return this.rectGenerator.genreate(
      coordinate.x, 
      coordinate.y, 
      this.VM_HEADER_WIDTH, 
      this.VM_HEADER_HEIGHT, 
      colour,
    );
  }

  private generateVMBodyRect(coordinate: Cooridnate){
    return this.rectGenerator.genreate(
      coordinate.x + this.VM_BODY_X_OFFSET,
      coordinate.y + this.VM_BODY_Y_OFFSET,
      this.VM_BODY_WIDTH,
      this.VM_BODY_HEIGHT,
      EchartsGraphic.Colour.white,
    )
  }

  private generateVMNameText(coordinate: Cooridnate, vmName:string){
    return this.textGenerator.generate(
      coordinate.x, 
      coordinate.y, 
      vmName, 
      EchartsGraphic.Font.header, 
      EchartsGraphic.Colour.white,
    )
  }

  private generateUtilisationText(coordinate: Cooridnate, utilisation:number){
    return this.textGenerator.generate(
      coordinate.x, 
      coordinate.y, 
      utilisation.toString()+'%', 
      EchartsGraphic.Font.utilisation, 
      EchartsGraphic.Colour.black
    )
  }

  private generateStatusText(coordinate: Cooridnate, status:string){
    return this.textGenerator.generate(
      coordinate.x,
      coordinate.y,
      status, 
      EchartsGraphic.Font.header, 
      EchartsGraphic.Colour.black
    )
  }

  private getTextShape(text: string, font: EchartsGraphic.Font): Cooridnate{
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context is not supported.');
    context.font = font;
    const metrics = context.measureText(text);
    const width = metrics.width;
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return {x: width, y: height} as Cooridnate;
  }

  private getVmNameCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Cooridnate) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + (this.VM_HEADER_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + (this.VM_BODY_Y_OFFSET - shape.y)/2),
    } as Cooridnate
  }
  
  private getUtilisationCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Cooridnate) {
    const shape = this.getTextShape(text+'%', font);
    return {
      x: Math.round(coordinate.x + this.VM_BODY_X_OFFSET + (this.VM_BODY_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + this.VM_BODY_Y_OFFSET + 0.18*this.VM_BODY_HEIGHT),
    } as Cooridnate
  }

  private getStatusCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Cooridnate) {
    const shape = this.getTextShape(text, font);
    return {
      x: Math.round(coordinate.x + this.VM_BODY_X_OFFSET + (this.VM_BODY_WIDTH - shape.x)/2),
      y: Math.round(coordinate.y + this.VM_BODY_Y_OFFSET + (this.VM_BODY_HEIGHT - (0.18*this.VM_BODY_HEIGHT+shape.y)))
    } as Cooridnate;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EchartsGraphicService{
  private vmGroupGenerator: VMGroupGenerator
  constructor() {
    this.vmGroupGenerator = new VMGroupGenerator();
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
}
