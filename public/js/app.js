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

    var AppModel = Backbone.Model.extend({
        defaults: {}
    });

    app.model = new AppModel();

    var AppView = Backbone.View.extend({
        el: 'body',

        events: {
            // Для попапов
            'click .js-pay_method': 'showPayMethod',
            'click .btn_feedbadk': 'showFeedback',
            'change .popup': 'changePopus',
            'click .js-close_popup': 'closePopup',

            'click .method': 'changeMethod'
        },

        // Попап с выбором способа получения
        showPayMethod: function showPayMethod() {
            $('.popup--method').fadeIn(250);
            $('#all').addClass('overlay');
        },

        // Попап с обратной связью
        showFeedback: function showFeedback() {
            $('.popup--feedback').fadeIn(250);
            $('#all').addClass('overlay');
        },

        // Закрыть попап
        closePopup: function closePopup() {
            $('.popup').fadeOut(250);
            $('#all').removeClass('overlay');
        },

        // Выбор способа получения
        changeMethod: function changeMethod(e) {
            $('.method').on('click', function () {
                console.log(this);
            });
        }
    });

    app.view = new AppView();
});

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
        type: 'once' // "once" or "two_weeks"
    },

    // Подсчет общей суммы займа (ОД + Проценты + Комиссии)
    calculateLoanSum: function calculateLoanSum(sum, period) {
        var total;

        sum = parseInt(sum);
        period = parseInt(period);

        total = Math.ceil((sum + sum * _constants2.default.feeIssue) * (_constants2.default.tariffs[0].percent * period + 1));

        /*        if (sum <= AppConstants.tariffs[0].max_sum) {
                    // Считаем по первому тарифу
                    total = Math.ceil((sum + sum * AppConstants.feeIssue) * (AppConstants.tariffs[0].percent * period + 1));
                } else {
                    // Считаем по второму тарифу
                    var percent = AppConstants.tariffs[1].percent * 7;
                    var n_weeks = period;
                    var annuity = (percent * Math.pow((1 + percent), n_weeks)) / (Math.pow((1 + percent), n_weeks) - 1);
                    total = Math.ceil((sum + sum * AppConstants.feeIssue * AppConstants.feeIssue) * annuity * n_weeks);
                }*/

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
        'change input[type=tel].js-sum': 'changeSumField',

        'input input[type=range].js-slider--period': 'changePeriodRange',
        'change input[type=tel].js-period': 'changePeriodField'
    },

    initialize: function initialize() {
        this.model.on('change', this.change, this);
    },

    // Выбор суммы при помощи ползунка
    changeSumRange: function changeSumRange(e) {
        var min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        var fieldSum = $('input[name=sum]');

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

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + ' ₽');
    },

    // -- Выбор суммы при помощи поля
    changeSumField: function changeSumField(e) {
        // Изменяем ползунок
        var range = $('input[type=range].js-slider--sum');

        $(range).val(e.target.value);

        // Стили для ползунка
        $(range).css({
            'backgroundSize': (range.val() - range.attr('min')) * 100 / (range.attr('max') - range.attr('min')) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        if (range.val() > 10000) {
            $(range).css({
                'background-image': 'linear-gradient(rgb(254, 150, 39), rgb(254, 150, 39))'
            });
        }

        $('.js-sum').val(e.target.value);
        // @TODO: Пока без рубля
        // Подставляем символ рубля
        /*        if (~$('.js-sum').val().indexOf('₽')) {
                    $('.js-sum').val(e.target.value);
                } else {
                    $('.js-sum').val(e.target.value + ' ₽');
                }*/

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + ' ₽');
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function changePeriodRange(e) {
        var min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        var fieldPeriod = $('input[name=period]');

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        // @TODO: Пока без дней ( + ' дней')
        $(fieldPeriod).val(e.target.value);
    },

    // -- Выбор срока при помощи поля
    changePeriodField: function changePeriodField(e) {
        // Изменяем ползунок
        var range = $('input[type=range].js-slider--period');

        $(range).val(e.target.value);

        // Стили для ползунка
        $(range).css({
            'backgroundSize': (range.val() - range.attr('min')) * 100 / (range.attr('max') - range.attr('min')) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        if (range.val() > 10000) {
            $(range).css({
                'background-image': 'linear-gradient(rgb(254, 150, 39), rgb(254, 150, 39))'
            });
        }

        $('.js-period').val(e.target.value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEVBQUUsWUFBWTtBQUNWLFdBQU8sR0FBUCxHQUFhLEVBQWI7O0FBRUE7QUFDQSxRQUFJLGNBQUosR0FBcUIsa0NBQXdCLEVBQXhCLENBQXJCO0FBR0EsUUFBSSxrQkFBSixHQUF5QixpQ0FBdUI7QUFDNUMsZUFBTyxJQUFJLGNBRGlDO0FBRTVDLFlBQUk7QUFGd0MsS0FBdkIsQ0FBekI7O0FBS0EsUUFBSSxXQUFXLFNBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBc0I7QUFDakMsa0JBQVU7QUFEdUIsS0FBdEIsQ0FBZjs7QUFJQSxRQUFJLEtBQUosR0FBWSxJQUFJLFFBQUosRUFBWjs7QUFFQSxRQUFJLFVBQVUsU0FBUyxJQUFULENBQWMsTUFBZCxDQUFxQjtBQUMvQixZQUFJLE1BRDJCOztBQUcvQixnQkFBUTtBQUNKO0FBQ0Esb0NBQXdCLGVBRnBCO0FBR0osbUNBQXVCLGNBSG5CO0FBSUosNkJBQWlCLGFBSmI7QUFLSixxQ0FBeUIsWUFMckI7O0FBT0osNkJBQWlCO0FBUGIsU0FIdUI7O0FBYS9CO0FBQ0EsdUJBQWUseUJBQVk7QUFDdkIsY0FBRSxnQkFBRixFQUFvQixNQUFwQixDQUEyQixHQUEzQjtBQUNBLGNBQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsU0FBbkI7QUFDSCxTQWpCOEI7O0FBbUIvQjtBQUNBLHNCQUFjLHdCQUFZO0FBQ3RCLGNBQUUsa0JBQUYsRUFBc0IsTUFBdEIsQ0FBNkIsR0FBN0I7QUFDQSxjQUFFLE1BQUYsRUFBVSxRQUFWLENBQW1CLFNBQW5CO0FBQ0gsU0F2QjhCOztBQXlCL0I7QUFDQSxvQkFBWSxzQkFBWTtBQUNwQixjQUFFLFFBQUYsRUFBWSxPQUFaLENBQW9CLEdBQXBCO0FBQ0EsY0FBRSxNQUFGLEVBQVUsV0FBVixDQUFzQixTQUF0QjtBQUNILFNBN0I4Qjs7QUErQi9CO0FBQ0Esc0JBQWMsc0JBQVUsQ0FBVixFQUFhO0FBQ3ZCLGNBQUUsU0FBRixFQUFhLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsWUFBWTtBQUNqQyx3QkFBUSxHQUFSLENBQVksSUFBWjtBQUNILGFBRkQ7QUFHSDtBQXBDOEIsS0FBckIsQ0FBZDs7QUF1Q0EsUUFBSSxJQUFKLEdBQVcsSUFBSSxPQUFKLEVBQVg7QUFFSCxDQTNERDs7Ozs7Ozs7O0FDREE7Ozs7OztBQUVBLElBQUksc0JBQXNCLFNBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBc0I7QUFDNUM7QUFDQSxjQUFVO0FBQ04sYUFBSyxJQURDO0FBRU4sZ0JBQVEsRUFGRjtBQUdOLGNBQU0sTUFIQSxDQUdPO0FBSFAsS0FGa0M7O0FBUTVDO0FBQ0Esc0JBQWtCLDBCQUFVLEdBQVYsRUFBZSxNQUFmLEVBQXVCO0FBQ3JDLFlBQUksS0FBSjs7QUFFQSxjQUFNLFNBQVMsR0FBVCxDQUFOO0FBQ0EsaUJBQVMsU0FBUyxNQUFULENBQVQ7O0FBRUEsZ0JBQVEsS0FBSyxJQUFMLENBQVUsQ0FBQyxNQUFNLE1BQU0sb0JBQWEsUUFBMUIsS0FBdUMsb0JBQWEsT0FBYixDQUFxQixDQUFyQixFQUF3QixPQUF4QixHQUFrQyxNQUFsQyxHQUEyQyxDQUFsRixDQUFWLENBQVI7O0FBRVI7Ozs7Ozs7Ozs7O0FBV1EsZUFBTyxLQUFQO0FBQ0g7QUE3QjJDLENBQXRCLENBQTFCLEMsQ0FMQTs7O2tCQXFDZSxtQjs7Ozs7Ozs7O0FDakNmOzs7Ozs7QUFFQSxJQUFJLHFCQUFxQixTQUFTLElBQVQsQ0FBYyxNQUFkLENBQXFCOztBQUUxQyxZQUFRO0FBQ0osa0RBQTBDLGdCQUR0QztBQUVKLHlDQUFpQyxnQkFGN0I7O0FBSUoscURBQTZDLG1CQUp6QztBQUtKLDRDQUFvQztBQUxoQyxLQUZrQzs7QUFVMUMsZ0JBQVksc0JBQVk7QUFDcEIsYUFBSyxLQUFMLENBQVcsRUFBWCxDQUFjLFFBQWQsRUFBd0IsS0FBSyxNQUE3QixFQUFxQyxJQUFyQztBQUVILEtBYnlDOztBQWUxQztBQUNBLG9CQUFnQix3QkFBVSxDQUFWLEVBQWE7QUFDekIsWUFBSSxNQUFNLEVBQUUsTUFBRixDQUFTLEdBQW5CO0FBQUEsWUFDSSxNQUFNLEVBQUUsTUFBRixDQUFTLEdBRG5CO0FBQUEsWUFFSSxNQUFNLEVBQUUsTUFBRixDQUFTLEtBRm5COztBQUlBLFlBQUksV0FBVyxFQUFFLGlCQUFGLENBQWY7O0FBRUEsVUFBRSxFQUFFLE1BQUosRUFBWSxHQUFaLENBQWdCO0FBQ1osOEJBQWtCLENBQUMsTUFBTSxHQUFQLElBQWMsR0FBZCxJQUFxQixNQUFNLEdBQTNCLElBQWtDLFFBRHhDO0FBRVosK0JBQW1CO0FBRlAsU0FBaEI7O0FBS0EsWUFBSSxNQUFNLEtBQVYsRUFBaUI7QUFDYixjQUFFLEVBQUUsTUFBSixFQUFZLEdBQVosQ0FBZ0I7QUFDWixvQ0FBb0I7QUFEUixhQUFoQjtBQUdIOztBQUVELFVBQUUsUUFBRixFQUFZLEdBQVosQ0FBZ0IsRUFBRSxNQUFGLENBQVMsS0FBVCxHQUFpQixJQUFqQzs7QUFFQTtBQUNBLFVBQUUsYUFBRixFQUFpQixJQUFqQixDQUFzQixFQUFFLE1BQUYsQ0FBUyxLQUFULEdBQWlCLElBQXZDO0FBRUgsS0F2Q3lDOztBQXlDMUM7QUFDQSxvQkFBZ0Isd0JBQVUsQ0FBVixFQUFhO0FBQ3pCO0FBQ0EsWUFBSSxRQUFRLEVBQUUsa0NBQUYsQ0FBWjs7QUFFQSxVQUFFLEtBQUYsRUFBUyxHQUFULENBQWEsRUFBRSxNQUFGLENBQVMsS0FBdEI7O0FBRUE7QUFDQSxVQUFFLEtBQUYsRUFBUyxHQUFULENBQWE7QUFDVCw4QkFBa0IsQ0FBQyxNQUFNLEdBQU4sS0FBYyxNQUFNLElBQU4sQ0FBVyxLQUFYLENBQWYsSUFBb0MsR0FBcEMsSUFBMkMsTUFBTSxJQUFOLENBQVcsS0FBWCxJQUFvQixNQUFNLElBQU4sQ0FBVyxLQUFYLENBQS9ELElBQW9GLFFBRDdGO0FBRVQsK0JBQW1CO0FBRlYsU0FBYjs7QUFLQSxZQUFJLE1BQU0sR0FBTixLQUFjLEtBQWxCLEVBQXlCO0FBQ3JCLGNBQUUsS0FBRixFQUFTLEdBQVQsQ0FBYTtBQUNULG9DQUFvQjtBQURYLGFBQWI7QUFHSDs7QUFFRCxVQUFFLFNBQUYsRUFBYSxHQUFiLENBQWlCLEVBQUUsTUFBRixDQUFTLEtBQTFCO0FBQ0E7QUFDQTtBQUNSOzs7Ozs7QUFNUTtBQUNBLFVBQUUsYUFBRixFQUFpQixJQUFqQixDQUFzQixFQUFFLE1BQUYsQ0FBUyxLQUFULEdBQWlCLElBQXZDO0FBQ0gsS0F2RXlDOztBQXlFMUM7QUFDQSx1QkFBbUIsMkJBQVUsQ0FBVixFQUFhO0FBQzVCLFlBQUksTUFBTSxFQUFFLE1BQUYsQ0FBUyxHQUFuQjtBQUFBLFlBQ0ksTUFBTSxFQUFFLE1BQUYsQ0FBUyxHQURuQjtBQUFBLFlBRUksTUFBTSxFQUFFLE1BQUYsQ0FBUyxLQUZuQjs7QUFJQSxZQUFJLGNBQWMsRUFBRSxvQkFBRixDQUFsQjs7QUFFQSxVQUFFLEVBQUUsTUFBSixFQUFZLEdBQVosQ0FBZ0I7QUFDWiw4QkFBa0IsQ0FBQyxNQUFNLEdBQVAsSUFBYyxHQUFkLElBQXFCLE1BQU0sR0FBM0IsSUFBa0MsUUFEeEM7QUFFWiwrQkFBbUI7QUFGUCxTQUFoQjs7QUFLQTtBQUNBLFVBQUUsV0FBRixFQUFlLEdBQWYsQ0FBbUIsRUFBRSxNQUFGLENBQVMsS0FBNUI7QUFDSCxLQXhGeUM7O0FBMEYxQztBQUNBLHVCQUFtQiwyQkFBVSxDQUFWLEVBQWE7QUFDNUI7QUFDQSxZQUFJLFFBQVEsRUFBRSxxQ0FBRixDQUFaOztBQUVBLFVBQUUsS0FBRixFQUFTLEdBQVQsQ0FBYSxFQUFFLE1BQUYsQ0FBUyxLQUF0Qjs7QUFFQTtBQUNBLFVBQUUsS0FBRixFQUFTLEdBQVQsQ0FBYTtBQUNULDhCQUFrQixDQUFDLE1BQU0sR0FBTixLQUFjLE1BQU0sSUFBTixDQUFXLEtBQVgsQ0FBZixJQUFvQyxHQUFwQyxJQUEyQyxNQUFNLElBQU4sQ0FBVyxLQUFYLElBQW9CLE1BQU0sSUFBTixDQUFXLEtBQVgsQ0FBL0QsSUFBb0YsUUFEN0Y7QUFFVCwrQkFBbUI7QUFGVixTQUFiOztBQUtBLFlBQUksTUFBTSxHQUFOLEtBQWMsS0FBbEIsRUFBeUI7QUFDckIsY0FBRSxLQUFGLEVBQVMsR0FBVCxDQUFhO0FBQ1Qsb0NBQW9CO0FBRFgsYUFBYjtBQUdIOztBQUVELFVBQUUsWUFBRixFQUFnQixHQUFoQixDQUFvQixFQUFFLE1BQUYsQ0FBUyxLQUE3QjtBQUNIO0FBOUd5QyxDQUFyQixDQUF6QixDLENBTkE7Ozs7a0JBdUhlLGtCOzs7Ozs7OztBQ3ZIZjs7O0FBR0EsSUFBSSxlQUFlO0FBQ2YsYUFBUyxDQUFDO0FBQ04sa0JBQVUsQ0FESjtBQUVOLGNBQU0sU0FGQTtBQUdOLG1CQUFXLENBSEw7QUFJTixtQkFBVyxLQUpMO0FBS04saUJBQVMsSUFMSDtBQU1OLGlCQUFTLEtBTkg7QUFPTixpQkFBUyxLQVBIO0FBUU4scUJBQWE7QUFDVCxpQkFBSyxDQURJO0FBRVQsaUJBQUs7QUFGSSxTQVJQO0FBWU4sbUJBQVc7QUFDUCxpQkFBSyxDQURFO0FBRVAsaUJBQUs7QUFGRSxTQVpMO0FBZ0JOLHFCQUFhO0FBaEJQLEtBQUQsRUFpQk47QUFDQyxrQkFBVSxDQURYO0FBRUMsY0FBTSxTQUZQO0FBR0MsbUJBQVcsS0FIWjtBQUlDLG1CQUFXLEtBSlo7QUFLQyxpQkFBUyxLQUxWO0FBTUMsaUJBQVMsS0FOVjtBQU9DLGlCQUFTLE1BUFY7QUFRQyxxQkFBYTtBQUNULGlCQUFLLENBREk7QUFFVCxpQkFBSztBQUZJLFNBUmQ7QUFZQyxtQkFBVztBQUNQLGlCQUFLLEVBREU7QUFFUCxpQkFBSztBQUZFLFNBWlo7QUFnQkMscUJBQWE7QUFoQmQsS0FqQk07QUFETSxDQUFuQjs7a0JBc0NlLFkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JNb2RlbCBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvclZpZXcgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JWaWV3JztcblxuJChmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LmFwcCA9IHt9O1xuXG4gICAgLy8g0JrQsNC70YzQutGD0LvRj9GC0L7RgFxuICAgIGFwcC5sb2FuQ2FsY3VsYXRvciA9IG5ldyBMb2FuQ2FsY3VsYXRvck1vZGVsKHtcblxuICAgIH0pO1xuICAgIGFwcC5sb2FuQ2FsY3VsYXRvclZpZXcgPSBuZXcgTG9hbkNhbGN1bGF0b3JWaWV3KHtcbiAgICAgICAgbW9kZWw6IGFwcC5sb2FuQ2FsY3VsYXRvcixcbiAgICAgICAgZWw6ICcjbG9hbkNhbGN1bGF0b3InXG4gICAgfSk7XG5cbiAgICBsZXQgQXBwTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgICAgICBkZWZhdWx0czoge31cbiAgICB9KTtcblxuICAgIGFwcC5tb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXG4gICAgdmFyIEFwcFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnYm9keScsXG5cbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAvLyDQlNC70Y8g0L/QvtC/0LDQv9C+0LJcbiAgICAgICAgICAgICdjbGljayAuanMtcGF5X21ldGhvZCc6ICdzaG93UGF5TWV0aG9kJyxcbiAgICAgICAgICAgICdjbGljayAuYnRuX2ZlZWRiYWRrJzogJ3Nob3dGZWVkYmFjaycsXG4gICAgICAgICAgICAnY2hhbmdlIC5wb3B1cCc6ICdjaGFuZ2VQb3B1cycsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWNsb3NlX3BvcHVwJzogJ2Nsb3NlUG9wdXAnLFxuXG4gICAgICAgICAgICAnY2xpY2sgLm1ldGhvZCc6ICdjaGFuZ2VNZXRob2QnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQstGL0LHQvtGA0L7QvCDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y9cbiAgICAgICAgc2hvd1BheU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1tZXRob2QnKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9GM0Y5cbiAgICAgICAgc2hvd0ZlZWRiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLWZlZWRiYWNrJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQl9Cw0LrRgNGL0YLRjCDQv9C+0L/QsNC/XG4gICAgICAgIGNsb3NlUG9wdXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cCcpLmZhZGVPdXQoMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIGNoYW5nZU1ldGhvZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5tZXRob2QnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFyaWZmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuXG4vKiAgICAgICAgaWYgKHN1bSA8PSBBcHBDb25zdGFudHMudGFyaWZmc1swXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICAvLyDQodGH0LjRgtCw0LXQvCDQv9C+INC/0LXRgNCy0L7QvNGDINGC0LDRgNC40YTRg1xuICAgICAgICAgICAgdG90YWwgPSBNYXRoLmNlaWwoKHN1bSArIHN1bSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSkgKiAoQXBwQ29uc3RhbnRzLnRhcmlmZnNbMF0ucGVyY2VudCAqIHBlcmlvZCArIDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0LLRgtC+0YDQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IEFwcENvbnN0YW50cy50YXJpZmZzWzFdLnBlcmNlbnQgKiA3O1xuICAgICAgICAgICAgdmFyIG5fd2Vla3MgPSBwZXJpb2Q7XG4gICAgICAgICAgICB2YXIgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykpIC8gKE1hdGgucG93KCgxICsgcGVyY2VudCksIG5fd2Vla3MpIC0gMSk7XG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIGFubnVpdHkgKiBuX3dlZWtzKTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIExvYW5DYWxjdWxhdG9yVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1zdW0nOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgfSxcblxuICAgIC8vINCS0YvQsdC+0YAg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9C30YPQvdC60LBcbiAgICBjaGFuZ2VTdW1SYW5nZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IG1pbiA9IGUudGFyZ2V0Lm1pbixcbiAgICAgICAgICAgIG1heCA9IGUudGFyZ2V0Lm1heCxcbiAgICAgICAgICAgIHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIGxldCBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpO1xuXG4gICAgICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAodmFsIC0gbWluKSAqIDEwMCAvIChtYXggLSBtaW4pICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHZhbCA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKGZpZWxkU3VtKS52YWwoZS50YXJnZXQudmFsdWUgKyAnIOKCvScpO1xuXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtVxuICAgICAgICAkKCcuanMtb3V0LXN1bScpLmh0bWwoZS50YXJnZXQudmFsdWUgKyAnIOKCvScpO1xuXG4gICAgfSxcblxuICAgIC8vIC0tINCS0YvQsdC+0YAg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9GPXG4gICAgY2hhbmdlU3VtRmllbGQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0L/QvtC70LfRg9C90L7QulxuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bScpO1xuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgLy8g0KHRgtC40LvQuCDQtNC70Y8g0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHJhbmdlLnZhbCgpIC0gcmFuZ2UuYXR0cignbWluJykpICogMTAwIC8gKHJhbmdlLmF0dHIoJ21heCcpIC0gcmFuZ2UuYXR0cignbWluJykpICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJhbmdlLnZhbCgpID4gMTAwMDApIHtcbiAgICAgICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KHJnYigyNTQsIDE1MCwgMzkpLCByZ2IoMjU0LCAxNTAsIDM5KSknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5qcy1zdW0nKS52YWwoZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAvLyBAVE9ETzog0J/QvtC60LAg0LHQtdC3INGA0YPQsdC70Y9cbiAgICAgICAgLy8g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDRgdC40LzQstC+0Lsg0YDRg9Cx0LvRj1xuLyogICAgICAgIGlmICh+JCgnLmpzLXN1bScpLnZhbCgpLmluZGV4T2YoJ+KCvScpKSB7XG4gICAgICAgICAgICAkKCcuanMtc3VtJykudmFsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5qcy1zdW0nKS52YWwoZS50YXJnZXQudmFsdWUgKyAnIOKCvScpO1xuICAgICAgICB9Ki9cblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LVcbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5odG1sKGUudGFyZ2V0LnZhbHVlICsgJyDigr0nKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgbGV0IGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAVE9ETzog0J/QvtC60LAg0LHQtdC3INC00L3QtdC5ICggKyAnINC00L3QtdC5JylcbiAgICAgICAgJChmaWVsZFBlcmlvZCkudmFsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VQZXJpb2RGaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDQv9C+0LvQt9GD0L3QvtC6XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJyk7XG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAvLyDQodGC0LjQu9C4INC00LvRjyDQv9C+0LvQt9GD0L3QutCwXG4gICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAocmFuZ2UudmFsKCkgLSByYW5nZS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAocmFuZ2UuYXR0cignbWF4JykgLSByYW5nZS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmFuZ2UudmFsKCkgPiAxMDAwMCkge1xuICAgICAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQocmdiKDI1NCwgMTUwLCAzOSksIHJnYigyNTQsIDE1MCwgMzkpKSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLmpzLXBlcmlvZCcpLnZhbChlLnRhcmdldC52YWx1ZSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyJdfQ==
