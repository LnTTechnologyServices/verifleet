import controller from './fleetHealth.controller';

import './fleetHealth.scss';
import webTemplate from './fleetHealth.web.html';
import './fleetHealth.web.scss';
import mobileTemplate from './fleetHealth.mobile.html';
import './fleetHealth.mobile.scss';

let fleetHealthDirective = function() {
  return {
    restrict: 'E',
    scope: {},
    template: function() {
      if (window.ionic) {
        return mobileTemplate;
      } else {
        return webTemplate;
      }
    },
    controller: controller,
    bindToController: {
      data: '<',
      normalLabel: '@',
      alarmLabel: '@',
      warningLabel: '@',
      onViewData: '&'
    },
    controllerAs: 'vm',

    link: function postLink(scope, element, attrs, controller, transcludeFn) {
      controller.scope = scope;

      const alarmColor = '#BC0E00';
      const normalColor = '#37C91A';
      const warningColor = '#F4CB00';

      const canvas = element.find('canvas')[0];
      canvas.id = 'fleetHealthCanvas' + (new Date().getTime());
      const ctx = canvas.getContext('2d');

      const stop1 = canvas.width / 3;
      const stop2 = stop1 * 2;
      const center = canvas.width / 2;
      const horizontalOverrun = 50; // the amount by which the left and right triangles run past the edge of the canvas

      const inactiveGradient = ctx.createRadialGradient(canvas.width/2,canvas.height/2,5*canvas.width/8,canvas.width/2,canvas.height/2,canvas.width/5);
      inactiveGradient.addColorStop(0, '#ffffff');
      inactiveGradient.addColorStop(1, '#dfdfdf');

      function drawTriangles(activeStatus) {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        //draw the 'warning' triangle (the triangle on the left)
        ctx.beginPath();
        ctx.moveTo(-horizontalOverrun, canvas.height);
        ctx.lineTo(center, 0);
        ctx.lineTo(stop1, canvas.height);
        ctx.closePath();
        ctx.fillStyle = activeStatus === 'warning' ? warningColor : inactiveGradient;
        ctx.fill();

        //draw the 'normal' triangle (center)
        ctx.beginPath();
        ctx.moveTo(stop1, canvas.height);
        ctx.lineTo(center, 0);
        ctx.lineTo(stop2, canvas.height);
        ctx.closePath();
        ctx.fillStyle = activeStatus === 'normal' ? normalColor : inactiveGradient;
        ctx.fill();

        //draw the 'alert' triangle (right)
        ctx.beginPath();
        ctx.moveTo(stop2, canvas.height);
        ctx.lineTo(center, 0);
        ctx.lineTo(canvas.width + horizontalOverrun, canvas.height);
        ctx.fillStyle = activeStatus === 'alarm' ? alarmColor : inactiveGradient;
        ctx.fill();
        ctx.closePath();

        //outline inner triangle and the bottom of all triangles
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.moveTo(stop1, canvas.height);
        ctx.lineTo(center, 0);
        ctx.lineTo(stop2, canvas.height);
        ctx.strokeStyle = '#999999';
        ctx.stroke();

        //clip out the content from the center of the donut chart.
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(center, 0);
        ctx.arc(center, -50, 150, 0, Math.PI, false);
        ctx.fillStyle = 'brown'; //doesn't matter actually...
        ctx.fill();
        ctx.restore();
      }

      scope.$watch('vm.activeStatus', function(newValue, oldValue) {
        drawTriangles(newValue.name);
      });

      element.on('$destroy', function() {
        // console.log("in fleetHealth directive $destroy handler...");
      });
    }
  }
};

export default fleetHealthDirective;
