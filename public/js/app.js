(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _constants = require('./constants.js');

var _constants2 = _interopRequireDefault(_constants);

var _LoanCalculatorModel = require('./app/LoanCalculatorModel');

var _LoanCalculatorModel2 = _interopRequireDefault(_LoanCalculatorModel);

var _LoanCalculatorView = require('./app/LoanCalculatorView');

var _LoanCalculatorView2 = _interopRequireDefault(_LoanCalculatorView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {
    window.app = {};

    // Калькулятор
    app.loanCalculator = new _LoanCalculatorModel2.default({});
    app.loanCalculatorView = new _LoanCalculatorView2.default({
        model: app.loanCalculator,
        el: '#loanCalculator'
    });
});

// import Caculator from './app/Calculator'

// console.log('Сумма: ' + Caculator.sum());
// console.log(Caculator.period());
// console.log(Caculator.moneyBack());

/*
let AppModelCalculator = {
    sum: 0,
    period: 0,
    moneyBack: function () {
        return this.sum - this.period;
    }
};

AppModelCalculator.sum = function () {
    let res = 0;

    return res;
};

// Код для ползунка (Выбор суммы)
$('input[type=range].js-slider--sum').on('input', function(e){
    let min = e.target.min,
        max = e.target.max,
        val = e.target.value;

    let fieldSum = $('input[name=sum]');

    AppModelCalculator.sum = val;

    $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
        'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
    });

    if (val > 10000) {
        $(e.target).css({
            'background-image': 'linear-gradient(rgb(254, 150, 39), rgb(254, 150, 39))'
        });
    }

    $(fieldSum).val(e.target.value + ' ₽');
}).trigger('input');

// Код для ползунка (Срок займа)
$('input[type=range].js-slider--time').on('input', function(e){
    let min = e.target.min,
        max = e.target.max,
        val = e.target.value;

    let fieldPeriod = $('input[name=period]');

    AppModelCalculator.period = val;

    $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
    });

    $(fieldPeriod).val(e.target.value + ' дней');
}).trigger('input');

// Вывод значений для калькулятора
$('input[type=range].js-slider').on('input', function (e) {

});



*/

},{"./app/LoanCalculatorModel":2,"./app/LoanCalculatorView":3,"./constants.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoanCalculatorModel = Backbone.Model.extend({
    // Значения по умолчанию
    defaults: {
        sum: 6000,
        period: 12,
        type: 'once' // "once" или "two_weeks"
    },

    // Подсчет общей суммы займа (ОД + Проценты + Комиссии)
    calculateLoanSum: function calculateLoanSum(sum, period) {
        var total;

        sum = parseInt(sum);
        period = parseInt(period);

        if (sum <= _constants2.default.tariffs[0].max_sum) {
            // Считаем по первому тарифу
            total = Math.ceil((sum + sum * _constants2.default.feeIssue) * (_constants2.default.tariffs[0].percent * period + 1));
        } else {
            // Считаем по второму тарифу
            var percent = _constants2.default.tariffs[1].percent * 7;
            var n_weeks = period;
            var annuity = percent * Math.pow(1 + percent, n_weeks) / (Math.pow(1 + percent, n_weeks) - 1);
            total = Math.ceil((sum + sum * _constants2.default.feeIssue * _constants2.default.feeIssue) * annuity * n_weeks);
        }

        return total;
    }
}); /**
     * Created by fred on 06.12.16.
     */
exports.default = LoanCalculatorModel;

},{"../constants":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoanCalculatorView = Backbone.View.extend({

    events: {
        'input input[type=range].js-slider--sum': 'changeSumRange',
        'click span': 'test'
    },

    test: function test() {
        console.log('ok ...');
    }
}); /**
     * Created by fred on 06.12.16.
     */

exports.default = LoanCalculatorView;

},{"../constants":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by fred on 06.12.16.
 */
var AppConstants = {
    tarrifs: [{
        grade_id: 1,
        name: 'Обычный',
        min_limit: 0,
        max_limit: 29999,
        min_sum: 1500,
        max_sum: 29999,
        percent: 0.015,
        period_once: {
            min: 8,
            max: 30
        },
        period_tw: {
            min: 0,
            max: 0
        },
        description: 'доступен для всех заемщиков'
    }, {
        grade_id: 2,
        name: 'Премиум',
        min_limit: 30000,
        max_limit: 50000,
        min_sum: 30000,
        max_sum: 50000,
        percent: 0.0049,
        period_once: {
            min: 0,
            max: 0
        },
        period_tw: {
            min: 28,
            max: 84
        },
        description: 'будет доступен после своевременного погашения одного займа'
    }]
};

exports.default = AppConstants;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEVBQUUsWUFBWTtBQUNWLFdBQU8sR0FBUCxHQUFhLEVBQWI7O0FBRUE7QUFDQSxRQUFJLGNBQUosR0FBcUIsa0NBQXdCLEVBQXhCLENBQXJCO0FBR0EsUUFBSSxrQkFBSixHQUF5QixpQ0FBdUI7QUFDNUMsZUFBTyxJQUFJLGNBRGlDO0FBRTVDLFlBQUk7QUFGd0MsS0FBdkIsQ0FBekI7QUFLSCxDQVpEOztBQWNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJBOzs7Ozs7QUFFQSxJQUFJLHNCQUFzQixTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQzVDO0FBQ0EsY0FBVTtBQUNOLGFBQUssSUFEQztBQUVOLGdCQUFRLEVBRkY7QUFHTixjQUFNLE1BSEEsQ0FHTztBQUhQLEtBRmtDOztBQVE1QztBQUNBLHNCQUFrQiwwQkFBVSxHQUFWLEVBQWUsTUFBZixFQUF1QjtBQUNyQyxZQUFJLEtBQUo7O0FBRUEsY0FBTSxTQUFTLEdBQVQsQ0FBTjtBQUNBLGlCQUFTLFNBQVMsTUFBVCxDQUFUOztBQUVBLFlBQUksT0FBTyxvQkFBYSxPQUFiLENBQXFCLENBQXJCLEVBQXdCLE9BQW5DLEVBQTRDO0FBQ3hDO0FBQ0Esb0JBQVEsS0FBSyxJQUFMLENBQVUsQ0FBQyxNQUFNLE1BQU0sb0JBQWEsUUFBMUIsS0FBdUMsb0JBQWEsT0FBYixDQUFxQixDQUFyQixFQUF3QixPQUF4QixHQUFrQyxNQUFsQyxHQUEyQyxDQUFsRixDQUFWLENBQVI7QUFDSCxTQUhELE1BR087QUFDSDtBQUNBLGdCQUFJLFVBQVUsb0JBQWEsT0FBYixDQUFxQixDQUFyQixFQUF3QixPQUF4QixHQUFrQyxDQUFoRDtBQUNBLGdCQUFJLFVBQVUsTUFBZDtBQUNBLGdCQUFJLFVBQVcsVUFBVSxLQUFLLEdBQUwsQ0FBVSxJQUFJLE9BQWQsRUFBd0IsT0FBeEIsQ0FBWCxJQUFnRCxLQUFLLEdBQUwsQ0FBVSxJQUFJLE9BQWQsRUFBd0IsT0FBeEIsSUFBbUMsQ0FBbkYsQ0FBZDtBQUNBLG9CQUFRLEtBQUssSUFBTCxDQUFVLENBQUMsTUFBTSxNQUFNLG9CQUFhLFFBQW5CLEdBQThCLG9CQUFhLFFBQWxELElBQThELE9BQTlELEdBQXdFLE9BQWxGLENBQVI7QUFDSDs7QUFFRCxlQUFPLEtBQVA7QUFDSDtBQTNCMkMsQ0FBdEIsQ0FBMUIsQyxDQUxBOzs7a0JBbUNlLG1COzs7Ozs7Ozs7QUMvQmY7Ozs7OztBQUVBLElBQUkscUJBQXFCLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7O0FBRTFDLFlBQVE7QUFDSixrREFBMEMsZ0JBRHRDO0FBRUosc0JBQWM7QUFGVixLQUZrQzs7QUFPMUMsVUFBTSxnQkFBWTtBQUNkLGdCQUFRLEdBQVIsQ0FBWSxRQUFaO0FBQ0g7QUFUeUMsQ0FBckIsQ0FBekIsQyxDQU5BOzs7O2tCQWtCZSxrQjs7Ozs7Ozs7QUNsQmY7OztBQUdBLElBQUksZUFBZTtBQUNmLGFBQVMsQ0FBQztBQUNOLGtCQUFVLENBREo7QUFFTixjQUFNLFNBRkE7QUFHTixtQkFBVyxDQUhMO0FBSU4sbUJBQVcsS0FKTDtBQUtOLGlCQUFTLElBTEg7QUFNTixpQkFBUyxLQU5IO0FBT04saUJBQVMsS0FQSDtBQVFOLHFCQUFhO0FBQ1QsaUJBQUssQ0FESTtBQUVULGlCQUFLO0FBRkksU0FSUDtBQVlOLG1CQUFXO0FBQ1AsaUJBQUssQ0FERTtBQUVQLGlCQUFLO0FBRkUsU0FaTDtBQWdCTixxQkFBYTtBQWhCUCxLQUFELEVBaUJOO0FBQ0Msa0JBQVUsQ0FEWDtBQUVDLGNBQU0sU0FGUDtBQUdDLG1CQUFXLEtBSFo7QUFJQyxtQkFBVyxLQUpaO0FBS0MsaUJBQVMsS0FMVjtBQU1DLGlCQUFTLEtBTlY7QUFPQyxpQkFBUyxNQVBWO0FBUUMscUJBQWE7QUFDVCxpQkFBSyxDQURJO0FBRVQsaUJBQUs7QUFGSSxTQVJkO0FBWUMsbUJBQVc7QUFDUCxpQkFBSyxFQURFO0FBRVAsaUJBQUs7QUFGRSxTQVpaO0FBZ0JDLHFCQUFhO0FBaEJkLEtBakJNO0FBRE0sQ0FBbkI7O2tCQXNDZSxZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JWaWV3IGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yVmlldyc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAubG9hbkNhbGN1bGF0b3IgPSBuZXcgTG9hbkNhbGN1bGF0b3JNb2RlbCh7XG5cbiAgICB9KTtcbiAgICBhcHAubG9hbkNhbGN1bGF0b3JWaWV3ID0gbmV3IExvYW5DYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAubG9hbkNhbGN1bGF0b3IsXG4gICAgICAgIGVsOiAnI2xvYW5DYWxjdWxhdG9yJ1xuICAgIH0pO1xuXG59KTtcblxuLy8gaW1wb3J0IENhY3VsYXRvciBmcm9tICcuL2FwcC9DYWxjdWxhdG9yJ1xuXG4vLyBjb25zb2xlLmxvZygn0KHRg9C80LzQsDogJyArIENhY3VsYXRvci5zdW0oKSk7XG4vLyBjb25zb2xlLmxvZyhDYWN1bGF0b3IucGVyaW9kKCkpO1xuLy8gY29uc29sZS5sb2coQ2FjdWxhdG9yLm1vbmV5QmFjaygpKTtcblxuLypcbmxldCBBcHBNb2RlbENhbGN1bGF0b3IgPSB7XG4gICAgc3VtOiAwLFxuICAgIHBlcmlvZDogMCxcbiAgICBtb25leUJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VtIC0gdGhpcy5wZXJpb2Q7XG4gICAgfVxufTtcblxuQXBwTW9kZWxDYWxjdWxhdG9yLnN1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcmVzID0gMDtcblxuICAgIHJldHVybiByZXM7XG59O1xuXG4vLyDQmtC+0LQg0LTQu9GPINC/0L7Qu9C30YPQvdC60LAgKNCS0YvQsdC+0YAg0YHRg9C80LzRiylcbiQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSl7XG4gICAgbGV0IG1pbiA9IGUudGFyZ2V0Lm1pbixcbiAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICB2YWwgPSBlLnRhcmdldC52YWx1ZTtcblxuICAgIGxldCBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpO1xuXG4gICAgQXBwTW9kZWxDYWxjdWxhdG9yLnN1bSA9IHZhbDtcblxuICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgfSk7XG5cbiAgICBpZiAodmFsID4gMTAwMDApIHtcbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkKGZpZWxkU3VtKS52YWwoZS50YXJnZXQudmFsdWUgKyAnIOKCvScpO1xufSkudHJpZ2dlcignaW5wdXQnKTtcblxuLy8g0JrQvtC0INC00LvRjyDQv9C+0LvQt9GD0L3QutCwICjQodGA0L7QuiDQt9Cw0LnQvNCwKVxuJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS10aW1lJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSl7XG4gICAgbGV0IG1pbiA9IGUudGFyZ2V0Lm1pbixcbiAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICB2YWwgPSBlLnRhcmdldC52YWx1ZTtcblxuICAgIGxldCBmaWVsZFBlcmlvZCA9ICQoJ2lucHV0W25hbWU9cGVyaW9kXScpO1xuXG4gICAgQXBwTW9kZWxDYWxjdWxhdG9yLnBlcmlvZCA9IHZhbDtcblxuICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJ1xuICAgIH0pO1xuXG4gICAgJChmaWVsZFBlcmlvZCkudmFsKGUudGFyZ2V0LnZhbHVlICsgJyDQtNC90LXQuScpO1xufSkudHJpZ2dlcignaW5wdXQnKTtcblxuLy8g0JLRi9Cy0L7QtCDQt9C90LDRh9C10L3QuNC5INC00LvRjyDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LBcbiQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlcicpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uIChlKSB7XG5cbn0pO1xuXG5cblxuKi9cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIg0LjQu9C4IFwidHdvX3dlZWtzXCJcbiAgICB9LFxuXG4gICAgLy8g0J/QvtC00YHRh9C10YIg0L7QsdGJ0LXQuSDRgdGD0LzQvNGLINC30LDQudC80LAgKNCe0JQgKyDQn9GA0L7RhtC10L3RgtGLICsg0JrQvtC80LjRgdGB0LjQuClcbiAgICBjYWxjdWxhdGVMb2FuU3VtOiBmdW5jdGlvbiAoc3VtLCBwZXJpb2QpIHtcbiAgICAgICAgdmFyIHRvdGFsO1xuXG4gICAgICAgIHN1bSA9IHBhcnNlSW50KHN1bSk7XG4gICAgICAgIHBlcmlvZCA9IHBhcnNlSW50KHBlcmlvZCk7XG5cbiAgICAgICAgaWYgKHN1bSA8PSBBcHBDb25zdGFudHMudGFyaWZmc1swXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICAvLyDQodGH0LjRgtCw0LXQvCDQv9C+INC/0LXRgNCy0L7QvNGDINGC0LDRgNC40YTRg1xuICAgICAgICAgICAgdG90YWwgPSBNYXRoLmNlaWwoKHN1bSArIHN1bSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSkgKiAoQXBwQ29uc3RhbnRzLnRhcmlmZnNbMF0ucGVyY2VudCAqIHBlcmlvZCArIDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0LLRgtC+0YDQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IEFwcENvbnN0YW50cy50YXJpZmZzWzFdLnBlcmNlbnQgKiA3O1xuICAgICAgICAgICAgdmFyIG5fd2Vla3MgPSBwZXJpb2Q7XG4gICAgICAgICAgICB2YXIgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykpIC8gKE1hdGgucG93KCgxICsgcGVyY2VudCksIG5fd2Vla3MpIC0gMSk7XG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIGFubnVpdHkgKiBuX3dlZWtzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0b3RhbDtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hbkNhbGN1bGF0b3JNb2RlbDsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJzogJ2NoYW5nZVN1bVJhbmdlJyxcbiAgICAgICAgJ2NsaWNrIHNwYW4nOiAndGVzdCdcbiAgICB9LFxuXG4gICAgdGVzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnb2sgLi4uJyk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyJdfQ==
