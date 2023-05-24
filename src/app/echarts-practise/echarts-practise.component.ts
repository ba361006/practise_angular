import { Component } from '@angular/core';
import { EchartsGraphicService, VMStatus } from '../services/echarts-graphic/echarts-graphic.service';
import * as echarts from 'echarts';

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
          elements: [
            this.echartsService.getVMGroup('VM1', 0, VMStatus.online, 50, 50),
            this.echartsService.getVMGroup('VM12', 16, VMStatus.online, 150, 50),
            this.echartsService.getVMGroup('VM123', 50, VMStatus.offline, 250, 50),
            this.echartsService.getVMGroup('VM1230', 87, VMStatus.offline, 350, 50),
            this.echartsService.getVMGroup('VM110', 53, VMStatus.offline, 450, 50),
            this.echartsService.getVMGroup('VM10', 4, VMStatus.offline, 550, 50),
            this.echartsService.getVMGroup('VM9', 37, VMStatus.offline, 650, 50),
            this.echartsService.getVMGroup('VM0', 100, VMStatus.offline, 750, 50),
            this.echartsService.getLoadBalancer(49, 550, 400),
            this.echartsService.getZone('A', 50, 415),
            this.echartsService.getZone('B', 1050, 415),
            this.echartsService.drawLine(50, 200, 100, 250),
          ]
        }
      })
    }
  }
}
