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
      const VM1 = this.echartsService.getVMGroup(50, 50, 'VM1', 0, VMStatus.online);
      const VM12 = this.echartsService.getVMGroup(150, 50, 'VM12', 16, VMStatus.online);
      const VM123 = this.echartsService.getVMGroup(250, 50, 'VM123', 50, VMStatus.offline);
      const VM1230 = this.echartsService.getVMGroup(350, 50, 'VM1230', 87, VMStatus.offline);
      const VM110 = this.echartsService.getVMGroup(450, 50, 'VM110', 53, VMStatus.offline);
      const VM10 = this.echartsService.getVMGroup(550, 50, 'VM10', 4, VMStatus.offline);
      const VM9 = this.echartsService.getVMGroup(650, 50, 'VM9', 37, VMStatus.offline);
      const VM0 = this.echartsService.getVMGroup(750, 50, 'VM0', 100, VMStatus.offline);
      const lb = this.echartsService.getLoadBalancer(550, 400, 49);
      const zoneA = this.echartsService.getZone(50, 415, 'A');
      const zoneB = this.echartsService.getZone(1050, 415, 'B');
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
