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
      const VM1 = this.echartsService.getVMGroup(50, 50, 'VM1', 0, VMStatus.online, 4, 1);
      const VM12 = this.echartsService.getVMGroup(150, 50, 'VM12', 16, VMStatus.online, 4, 1);
      const VM123 = this.echartsService.getVMGroup(250, 50, 'VM123', 50, VMStatus.offline, 4, 1);
      const VM1230 = this.echartsService.getVMGroup(350, 50, 'VM1230', 87, VMStatus.offline, 4, 1);
      const VM110 = this.echartsService.getVMGroup(450, 50, 'VM110', 53, VMStatus.offline, 4, 1);
      const VM10 = this.echartsService.getVMGroup(550, 50, 'VM10', 4, VMStatus.offline, 4, 1);
      const VM9 = this.echartsService.getVMGroup(650, 50, 'VM9', 37, VMStatus.offline, 4, 1);
      const VM0 = this.echartsService.getVMGroup(750, 50, 'VM0', 100, VMStatus.offline, 4, 1);
      const lb = this.echartsService.getLoadBalancer(550, 400, 49);
      const zoneA = this.echartsService.getZone(50, 415, 'A');
      const zoneB = this.echartsService.getZone(1050, 415, 'B');
      chart.setOption({
        graphic: {
          elements: [
            VM1.vmGroup.element,
            VM1.networkPerformance.element,
            VM12.vmGroup.element,
            VM12.networkPerformance.element,
            VM123.vmGroup.element,
            VM123.networkPerformance.element,
            VM1230.vmGroup.element,
            VM1230.networkPerformance.element,
            VM110.vmGroup.element,
            VM110.networkPerformance.element,
            VM10.vmGroup.element,
            VM10.networkPerformance.element,
            VM9.vmGroup.element,
            VM9.networkPerformance.element,
            VM0.vmGroup.element,
            VM0.networkPerformance.element,
            lb.element,
            zoneA.element,
            zoneB.element,
            this.echartsService.drawLine(lb.top, VM1.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM12.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM123.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM1230.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM110.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM10.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM9.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM0.networkPerformance.bottom),
            this.echartsService.drawLine(lb.left, zoneA.right),
            this.echartsService.drawLine(lb.right, zoneB.left),
          ]
        }
      })
    }
  }
}
