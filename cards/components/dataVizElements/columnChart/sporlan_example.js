angular
  .module(
    'cards.column', [
      'highcharts-ng',
    ]
  )
  .directive(
    'parkerColumn',
    function() {
      return {
        controller: controller,
        controllerAs: 'vm',
        restrict: 'E',
        scope: {
          data: '=',
          title: '@',
          width: '@',
          type: '@',
        },
        template: '<highchart style="height:270px" config="vm.config"></highchart>',
      };

      function controller($scope) {
        var vm = this;

        vm.config = {
          loading: true,
          options: {
            chart: {
              backgroundColor: 'transparent',
              spacingRight: 20,
              spacingLeft: 20,
              type: 'column',
              width: $scope.width,
            },
            colors: ['rgba(255,255,255,0.6)', '#8FE557', 'rgba(255,255,255,0.6)'],
            credits: {
              enabled: false,
            },
            exporting:{
              enabled: false
            },
            legend: {
              enabled: false,
            },
            plotOptions: {
              column: {
                maxPointWidth: 20,
                stacking: 'normal',
              },
            },
            title: {
              align: 'left',
              style: {
                fontSize: '1.3em',
                whiteSpace: 'nowrap',
              },
              text: $scope.title,
            },
            tooltip: {
              enabled: false,
            },
            yAxis: {
              gridLineWidth: 0,
              labels: {
                enabled: false,
              },
              tickInterval: 1,
              title: {
                text: null,
              },
            },
          },
          series: [{
            data: [],
            index: 1,
          }, {
            data: [],
            index: 3,
          }, {
            data: [],
            index: 2,
          }],
          xAxis: {
            categories: [],
            lineWidth: 0,
            tickWidth: 0,
          },
        };

        $scope.$watch(
          'data',
          function(r) {
            vm.config.loading = false;

            var barData = [],
              chart = vm.config.getHighcharts(),
              lineData = [],
              map = {
                color: ['#1751C6', '#E54538', '#FFE027', ],
              };

            var limit = {};
            switch ($scope.type) {
              case 'DA':
                var low_temperature_alarm = r.lines[0].data[0];
                var high_temperature_alarm = r.lines[1].data[0];
                var discharge_temperature = r.lines[2].data[0];
                var offset = Math.ceil((Math.max(discharge_temperature, high_temperature_alarm)-Math.min(discharge_temperature, low_temperature_alarm)) * 0.2);

                limit.max = Math.max(high_temperature_alarm, discharge_temperature) + Math.abs(offset);
                limit.min = Math.min(low_temperature_alarm, discharge_temperature) - Math.abs(offset);
                break;
              case 'SH':
                limit.max = 50;
                limit.min = 0;
                break;
            }

            for (var key in r) {
              switch (key) {
                case 'bars':
                  if (r[key].length === 1) {
                      r[key][0].name = '';
                  }

                  barData = r[key].map(
                    function(obj, i) {
                      var num = Math.round(obj.data[0] * 10) / 10;
                      var value = $scope.type !== 'DA' ? obj.data[0] : obj.data[0] + -limit.min;

                      return {
                        name: '<div style="font-size:large;font-weight:bold;">' + num + '</div><br><div style="font-size:medium;">' + obj.name + '</div>',
                        y: value,
                      };
                    }
                  );
                  break;
                case 'lines':
                  chart.yAxis[0].update({
                    plotLines: r[key].map(
                      function(obj, i) {
                        var num = Math.round(obj.data[0] * 10) / 10;
                        var value = $scope.type !== 'DA' ? obj.data[0] : obj.data[0] + -limit.min;

                        lineData.push({
                          y: value,
                        });

                        var params = {
                          color: map.color[i],
                          label: {
                            align: 'right',
                            style: {
                              'font-size': '1.5em',
                            },
                            text: num,
                            textAlign: 'left',
                            x: -10,
                            y: -5,
                          },
                          value: value,
                          width: 2,
                        };

                        if (i === 2) {
                          params.label.x = 10;
                          params.label.align = 'left';
                          params.label.textAlign = 'right';
                        }

                        return params;
                      }
                    ),
                  });
                  break;
              }
            }

            if ($scope.type === 'DA') {
              limit.max += -limit.min;
              limit.min += -limit.min;
            }

            var stack = {
              max: [],
              min: [],
            };
            barData.forEach(
              function(obj) {
                stack.max.push({
                  y: limit.max - Math.max(0, obj.y),
                });

                stack.min.push({
                  y: limit.min - Math.min(0, obj.y),
                });
              }
            )

            vm.config.getHighcharts().yAxis[0].setExtremes(limit.min, limit.max);
            vm.config.series[0].data = stack.max;
            vm.config.series[1].data = barData;
            vm.config.series[2].data = stack.min;
          }
        )
      }

    })

;