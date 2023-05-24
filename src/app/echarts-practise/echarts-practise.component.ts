import { Component } from '@angular/core';
import { EchartsGraphicService, VMStatus, EchartsElement } from '../services/echarts-graphic/echarts-graphic.service';
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
      const VM1 = this.echartsService.getVMGroup('VM1', 0, VMStatus.online, 50, 50);
      const VM12 = this.echartsService.getVMGroup('VM12', 16, VMStatus.online, 150, 50);
      const VM123 = this.echartsService.getVMGroup('VM123', 50, VMStatus.offline, 250, 50);
      const VM1230 = this.echartsService.getVMGroup('VM1230', 87, VMStatus.offline, 350, 50);
      const VM110 = this.echartsService.getVMGroup('VM110', 53, VMStatus.offline, 450, 50);
      const VM10 = this.echartsService.getVMGroup('VM10', 4, VMStatus.offline, 550, 50);
      const VM9 = this.echartsService.getVMGroup('VM9', 37, VMStatus.offline, 650, 50);
      const VM0 = this.echartsService.getVMGroup('VM0', 100, VMStatus.offline, 750, 50);
      const lb = this.echartsService.getLoadBalancer(49, 550, 400);
      const zoneA = this.echartsService.getZone('A', 50, 415);
      const zoneB = this.echartsService.getZone('B', 1050, 415);
      chart.setOption({
        graphic: {
          elements: [
            VM1.element,
            VM12.element,
            VM123.element,
            VM1230.element,
            VM110.element,
            VM10.element,
            VM9.element,
            VM0.element,
            lb,
            zoneA,
            zoneB,
            this.echartsService.drawLine({x:610, y:400}, VM1.bottom),
            this.echartsService.drawLine({x:610, y:400}, VM1230.bottom),
          ]
        }
      })
    }
  }
}
