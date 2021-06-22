import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  salesOptions: any;
  revenueOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.salesOptions = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        height: '200px'
      },
      xAxis: [
        {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        }
      ],
      series: [
        {
          name: 'MONTHLY SALES',
          type: 'bar',
          barWidth: '10%',
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        },
      ],
    };

    this.revenueOptions = {
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
      }]
  };
  }
}