import { Component } from '@angular/core';
import { EchartsGraphicService, VMStatus, LBStatus } from '../services/echarts-graphic/echarts-graphic.service';
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
      const lb = this.echartsService.getLoadBalancer(575, 400, 'LB-01', LBStatus.offline, 46);
      const zoneA = this.echartsService.getZone(50, 415, 'A');
      const zoneB = this.echartsService.getZone(1150, 415, 'B');
      const VM1 = this.echartsService.getVMGroup(50, 50, 'VM1', 0, VMStatus.offline, 4, 0);
      const VM2 = this.echartsService.getVMGroup(150, 50, 'VM2', 0, VMStatus.offline, 0, 0);
      const VM3 = this.echartsService.getVMGroup(250, 50, 'VM333', 50, VMStatus.online, 4, 1);
      const VM4 = this.echartsService.getVMGroup(350, 50, 'VM4444', 87, VMStatus.online, 0, 0);
      const VM5 = this.echartsService.getVMGroup(450, 50, 'VM5', 53, VMStatus.online, 4, 1);
      const VM6 = this.echartsService.getVMGroup(550, 50, 'VM6', 4, VMStatus.online, 4, 1);
      const VM7 = this.echartsService.getVMGroup(650, 50, 'VM7', 37, VMStatus.online, 4, 1);
      const VM8 = this.echartsService.getVMGroup(750, 50, 'VM8', 45, VMStatus.online, 4, 1);
      const VM9 = this.echartsService.getVMGroup(850, 50, 'VM9', 69, VMStatus.online, 4, 1);
      const VM10 = this.echartsService.getVMGroup(950, 50, 'VM10', 1, VMStatus.online, 4, 1);
      const VM11 = this.echartsService.getVMGroup(1050, 50, 'VM11', 0, VMStatus.online, 0, 2);
      const VM12 = this.echartsService.getVMGroup(1150, 50, 'VM12', 100, VMStatus.online, 4, 1);
      chart.setOption({
        graphic: {
          elements: [
            VM1.vmGroup.element,
            VM1.networkPerformance.element,
            VM2.vmGroup.element,
            VM2.networkPerformance.element,
            VM3.vmGroup.element,
            VM3.networkPerformance.element,
            VM4.vmGroup.element,
            VM4.networkPerformance.element,
            VM5.vmGroup.element,
            VM5.networkPerformance.element,
            VM6.vmGroup.element,
            VM6.networkPerformance.element,
            VM7.vmGroup.element,
            VM7.networkPerformance.element,
            VM8.vmGroup.element,
            VM8.networkPerformance.element,
            VM9.vmGroup.element,
            VM9.networkPerformance.element,
            VM10.vmGroup.element,
            VM10.networkPerformance.element,
            VM11.vmGroup.element,
            VM11.networkPerformance.element,
            VM12.vmGroup.element,
            VM12.networkPerformance.element,
            lb.element,
            zoneA.element,
            zoneB.element,
            this.echartsService.drawLine(lb.top, VM1.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM2.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM3.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM4.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM5.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM6.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM7.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM8.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM9.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM10.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM11.networkPerformance.bottom),
            this.echartsService.drawLine(lb.top, VM12.networkPerformance.bottom),
            this.echartsService.drawLine(lb.left, zoneA.right),
            this.echartsService.drawLine(lb.right, zoneB.left),
          ]
        }
      })
    }
  }
}
