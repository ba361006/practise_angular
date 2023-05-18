import { Component } from '@angular/core';
import { EchartsGraphicService } from '../services/echarts-graphic/echarts-graphic.service';
import * as echarts from 'echarts';

const hollowRect = 'path://m315,493H0V0h315v493Zm-10-368H9v358h296V125Z';
const colorWhite = '#ffffff';
const colorBlack = '#000000';
const colorGray = '#D0D0D0';
const colorTextGray = '#8E8E8E';
const colorGreen = '#00A600';
const colorYellow = '#f7941d';
const colorRed = '#ee3c39';
// let rectangle1 = {
//   id: 'rectangle1',
//   type: 'rect',
//   shape: {
//     x: 50,
//     y: 50,
//     width: 200,
//     height: 100
//   },
//   style: {
//     fill: '#ccc'
//   }
// };

// let rectangle2 = {
//   id: 'rectangle2',
//   type: 'rect',
//   shape: {
//     x: 300,
//     y: 50,
//     width: 200,
//     height: 100
//   },
//   style: {
//     fill: '#f00'
//   }
// };

// let link = {
//   type: 'line',
//   shape: {
//     x1: rectangle1.shape.x + rectangle1.shape.width / 2,  // middle of rectangle1
//     y1: rectangle1.shape.y + rectangle1.shape.height / 2,  // middle of rectangle1
//     x2: rectangle2.shape.x + rectangle2.shape.width / 2,  // middle of rectangle2
//     y2: rectangle2.shape.y + rectangle2.shape.height / 2  // middle of rectangle2
//   },
//   style: {
//     stroke: '#000'  // color of the line
//   },
//   z: 1000  // put the line on top
// };
// if (element) {
//   let chart = echarts.init(element);
//   chart.setOption({
//     graphic: {
//       elements: [rectangle1, rectangle2, link]
//     }
//   });
// }
    // const seriesTmp = [
    //   {
    //     type: 'graph',
    //     symbol: 'rect',
    //     data: [
    //       {
    //         name: name,
    //         x: 0,
    //         y: 0,
    //         label: {
    //           show: true,
    //           formatter: '{b}',
    //           position: 'insideTop',
    //           distance: 8,
    //         },
    //         symbolSize: [64, 100],
    //         itemStyle: { color: '#000000' },
    //       },
    //       {
    //         x: 0,
    //         y: 0,
    //         value: 0,
    //         symbolSize: [60, 70],
    //         label: {
    //           show: true,
    //           fontSize: 22,
    //           fontFamily: 'sans-serif',
    //           formatter: '{c}%',
    //           position: 'insideTop',
    //           distance: 10,
    //         },
    //       },
    //     ]
    //   },
    // ];
    // let rectanglesGroup = {
    //   type: 'group',
    //   draggable: true,
    //   onclick: () => console.log('hello'),
    //   children: [
    //     {
    //       type: 'rect',
    //       shape: {
    //         x: 50,
    //         y: 50,
    //         width: 200,
    //         height: 100
    //       },
    //       style: {
    //         fill: '#ccc'
    //       }
    //     },
    //     {
    //       type: 'rect',
    //       shape: {
    //         x: 100,
    //         y: 75,
    //         width: 100,
    //         height: 50
    //       },
    //       style: {
    //         fill: '#f00'
    //       }
    //     }
    //   ]
    // };
    // if (element) {
    //   let chart = echarts.init(element);
    //   chart.setOption({
    //     // series
    //     graphic: {
    //       elements: [rectanglesGroup]
    //     }
    //   });
    // }

@Component({
  selector: 'app-echarts-practise',
  templateUrl: './echarts-practise.component.html',
  styleUrls: ['./echarts-practise.component.scss']
})
export class EchartsPractiseComponent {
  constructor(private echartsService: EchartsGraphicService) {}
  ngOnInit() {
    const element = document.getElementById('main');
    if (element){
      let chart = echarts.init(element);
      chart.setOption({
        graphic: {
          elements: [this.echartsService.getVMGroup()]
        }
      })
    }
  }
}
