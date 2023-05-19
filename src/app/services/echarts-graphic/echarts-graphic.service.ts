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

  // this should be a class
  public getVMGroup(
    vmName: string,
    utilisation: number,
    status: VMStatus,
    x: number,
    y: number,
  ): echarts.GraphicComponentOption {
    const vmNameCoordinate = this.getVmNameCoordinate(vmName, EchartsGraphic.Font.header, {x:x, y:y})
    let VMGroup: echarts.GraphicComponentOption = {
      type: 'group',
      draggable: true,
      onclick: () => console.log('VM clicked'),
      children: [
        this.generateVMHeaderRect(x,y ,utilisationColourMapper(utilisation)),
        this.generateVMBodyRect(x,y),
        this.generateVMNameText(vmNameCoordinate, vmName),
        this.generateUtilisationText(x+this.utilisationXOffset(utilisation), y+this.utilisationYOffset(), utilisation),
        this.generateStatusText(x,y,status),
      ]
    }
    return VMGroup;
  };

  private generateVMHeaderRect(x: number, y: number, colour: EchartsGraphic.Colour){
    return this.rectGenerator.genreate(
      x, 
      y, 
      this.VM_HEADER_WIDTH, 
      this.VM_HEADER_HEIGHT, 
      colour,
    );
  }

  private generateVMBodyRect(x:number, y:number){
    return this.rectGenerator.genreate(
      x + this.VM_BODY_X_OFFSET,
      y + this.VM_BODY_Y_OFFSET,
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

  private generateUtilisationText(x:number, y:number, utilisation:number){
    return this.textGenerator.generate(
      x, 
      y, 
      utilisation.toString()+'%', 
      EchartsGraphic.Font.utilisation, 
      EchartsGraphic.Colour.black
    )
  }

  private generateStatusText(x:number, y:number, status:string){
    return this.textGenerator.generate(
      x + 9, 
      y + 70, 
      status, 
      EchartsGraphic.Font.header, 
      EchartsGraphic.Colour.black
    )
  }
  private getVmNameCoordinate(text: string, font: EchartsGraphic.Font, coordinate: Cooridnate) {
    const shape = this.getTextShape(text, font);
    return {
      x: coordinate.x + Math.round((this.VM_HEADER_WIDTH - shape.x)/2),
      y: coordinate.y + Math.round((this.VM_BODY_Y_OFFSET - shape.y)/2),
    } as Cooridnate
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

  private utilisationXOffset = (utilisation: number): number => {
    // 15 is when font size equals to 22px, each word should offest 7px to the left
    return this.VM_BODY_X_OFFSET + 15 - 7*(utilisation.toString().length-1);
  }

  private utilisationYOffset = (): number => {
    // should locate at around the 20% from the top of vm body
    return Math.ceil(this.VM_BODY_Y_OFFSET + this.VM_BODY_HEIGHT*0.2);
  };

  private statusXOffset = (): number => {
    const getDigitsInString = /\d+/;
    const matches = EchartsGraphic.Font.header.match(getDigitsInString);
    const statusFontSize = matches ? parseInt(matches[0]) : 0;
    return this.VM_BODY_WIDTH*0.2;
  }

  // private getTextShape(text: string, font: EchartsGraphic.Font): Cooridnate{
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d');
  //   if (!context) throw new Error('Canvas context is not supported.');
  //   context.font = font;
  //   const metrics = context.measureText(text);
  //   const width = metrics.width;
  //   const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  //   return {x: width, y: height} as Cooridnate;
    // util second works
    // const text = '100%'
    // context.font = 'sans-serif 22px';
    // let metrics = context.measureText(text);
    // let width = Math.round(metrics.width);
    // let height = Math.round(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

    // const utilXOffset = (value: number) => {
    //   return this.VM_BODY_X_OFFSET + Math.round((this.VM_BODY_WIDTH - value)/2);
    // }
    // const utilYOffset = (value: number) => {
    //   return Math.round((this.VM_BODY_Y_OFFSET - value)/2);
    // }
    // console.log(width);
    // console.log(utilXOffset(width));
    // console.log(utilYOffset(height));
    // console.log('-----------------------');
    
    // context.font = '22px sans-serif';
    // metrics = context.measureText(text);
    // width = Math.round(metrics.width);
    // height = Math.round(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    // console.log(width);
    // console.log(utilXOffset(width));
    // console.log(utilYOffset(height));

    // // FOr VM xOffset
    // const text = 'VM1'
    // context.font = 'sans-serif 16px';
    // let metrics = context.measureText(text);
    // let width = Math.round(metrics.width);
    // let height = Math.round(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

    // const vmNameXOffset = (value: number) => {
    //   return Math.round((this.VM_HEADER_WIDTH - value)/2);
    // }
    // const vmNameYOffset = (value: number) => {
    //   return Math.round((this.VM_BODY_Y_OFFSET - value)/2);
    // }
    // console.log(width);
    // console.log(vmNameXOffset(width));
    // console.log(vmNameYOffset(height));
    // console.log('-----------------------');
    
    // context.font = '16px sans-serif';
    // metrics = context.measureText(text);
    // width = Math.round(metrics.width);
    // height = Math.round(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    // console.log(width);
    // console.log(vmNameXOffset(width));
    // console.log(vmNameYOffset(height));

  // }
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
