import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

// this enum should be somewhere else, but we put it here for only practising
export enum VMStatus{
  online = 'Online',
  offline = 'Offline',
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
      colour = EchartsGraphic.Colour.black,
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

@Injectable({
  providedIn: 'root'
})
export class EchartsGraphicService{
  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  getVMGroup(
    name: string,
    utilisation: number,
    status: VMStatus,
    x: number,
    y: number,
  ): echarts.GraphicComponentOption {
    let VMGroup: echarts.GraphicComponentOption = {
      type: 'group',
      draggable: true,
      onclick: () => console.log('VM clicked'),
      children: [
        this.rectGenerator.genreate(x, y, 64, 100, EchartsGraphic.Colour.green),
        this.rectGenerator.genreate(x+3, y+27, 58, 70, EchartsGraphic.Colour.white),
        this.textGenerator.generate(x+15, y+6, name,EchartsGraphic.Font.header, EchartsGraphic.Colour.white),
        this.textGenerator.generate(x+11, y+40, utilisation.toString()+'%', EchartsGraphic.Font.utilisation),
        this.textGenerator.generate(x+9, y+70, status, EchartsGraphic.Font.status),
      ]
    }
    return VMGroup;
  };
}
