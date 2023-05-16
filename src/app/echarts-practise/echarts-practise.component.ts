import { Component } from '@angular/core';
import * as echarts from 'echarts';


@Component({
  selector: 'app-echarts-practise',
  templateUrl: './echarts-practise.component.html',
  styleUrls: ['./echarts-practise.component.scss']
})
export class EchartsPractiseComponent {
  ngOnInit() {
    const element = document.getElementById('main');
    if (element) {
      let chart = echarts.init(element);
      chart.setOption({
        title: {
          text: 'ECharts entry example'
        },
        tooltip: {},
        legend: {
          data:['Sales']
        },
        xAxis: {
          data: ["shirt","cardigan","chiffon shirt","pants","heels","socks"]
        },
        yAxis: {},
        series: [{
          name: 'Sales',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
    }
  }
}
