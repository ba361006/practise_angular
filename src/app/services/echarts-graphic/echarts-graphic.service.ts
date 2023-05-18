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

@Injectable({
  providedIn: 'root'
})
export class EchartsGraphicService{
  private VM_HEADER_WIDTH = 64;
  private VM_HEADER_HEIGHT = 100;
  private VM_BODY_WIDTH = 58;
  private VM_BODY_HEIGHT = 70;

  private rectGenerator: EchartsGraphic.RectangleGenerator;
  private textGenerator: EchartsGraphic.TextGenerator;

  constructor() { 
    this.rectGenerator = new EchartsGraphic.RectangleGenerator();
    this.textGenerator = new EchartsGraphic.TextGenerator();
  }

  public getVMGroup(
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
        this.generateVMHeaderRect(x,y,status),
        this.generateVMBodyRect(x,y),
        this.generateHeaderText(x,y,name),
        this.generateUtilisationText(x,y,utilisation),
        this.generateStatusText(x,y,status),
      ]
    }
    return VMGroup;
  };

  private generateVMHeaderRect(x:number, y:number, VMStatus:VMStatus){
    return this.rectGenerator.genreate(
      x, 
      y, 
      this.VM_HEADER_WIDTH, 
      this.VM_HEADER_HEIGHT, 
      EchartsGraphic.Colour.green
    );
  }

  private generateVMBodyRect(x:number, y:number){
    return this.rectGenerator.genreate(
      x + 3,
      y + 27,
      this.VM_BODY_WIDTH,
      this.VM_BODY_HEIGHT,
      EchartsGraphic.Colour.white,
    )
  }

  private generateHeaderText(x:number, y:number, name:string){
    return this.textGenerator.generate(
      x + 15, 
      y + 6, 
      name, 
      EchartsGraphic.Font.header, 
      EchartsGraphic.Colour.white
    )
  }

  private generateUtilisationText(x:number, y:number, utilisation:number){
    return this.textGenerator.generate(
      x + 11, 
      y + 40, 
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
} // end of class
