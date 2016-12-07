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
            // Способ выдачи
            'click .method': 'changeMethod',

            // Табы 'почему мы'
            'click .btn-about': 'changeAboutTab',

            // Слайдер
            'click .arrow--right': 'nextSlide',
            'click .arrow--left': 'prevSlide',

            // Для попапов
            'click .js-btn_register': 'showRegister',
            'click .js-pay_method': 'showPayMethod',
            'click .btn_feedback': 'showFeedback',
            'change .popup': 'changePopus',
            'click .js-close_popup': 'closePopup'
        },

        // Выбор способа получения
        changeMethod: function changeMethod() {
            $('.method').toggleClass('method--active');

            // -- Подставляем текст
            $('.js-pay_method').html($('.method--active').find('.js-text_method').html());
        },

        // Переключение табов (должно работать и на десктопе)
        changeAboutTab: function changeAboutTab(e) {
            $('.btn-about--active').add(e.target).toggleClass('btn-about--active');

            var tabId = $(e.target).attr('data-tab');

            $('.js-change-content').removeClass('js-change-content--active');

            $('#aboutTab-' + tabId).addClass('js-change-content--active');
        },

        // Следующий слайд
        nextSlide: function nextSlide(e) {
            $(e.target).parent().parent().find('.content-slider').css({
                'transition': '.3s ease-out',
                'left': function left(index, value) {
                    if (parseFloat(value) <= -540) {
                        return value = 0;
                    }
                    return parseFloat(value) - 270 + 'px';
                }
            });
        },
        // Предыдущий слайд
        prevSlide: function prevSlide(e) {
            $(e.target).parent().parent().find('.content-slider').css({
                'transition': '.3s ease-out',
                'left': function left(index, value) {
                    if (parseFloat(value) === 0) {
                        return value = -540;
                    }
                    return parseFloat(value) + 270 + 'px';
                }
            });
        },

        // Попап регистрации
        showRegister: function showRegister() {
            $('.popup--register').fadeIn(250);
            $('#all').addClass('overlay');
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

        if (sum <= _constants2.default.tarrifs[0].max_sum) {
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

        $('.js-out-sum').css('color', '#3bb38e');

        if (val > 10000) {
            $(e.target).css({
                'background-image': 'linear-gradient(rgb(254, 150, 39), rgb(254, 150, 39))'
            });
            $('.js-out-sum').css('color', '#fe9627');
        }

        $(fieldSum).val(e.target.value + ' ₽');

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + '  ₽');
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

        $('.js-out-sum').css('color', '#3bb38e');

        if (range.val() > 10000) {
            $(range).css({
                'background-image': 'linear-gradient(rgb(254, 150, 39), rgb(254, 150, 39))'
            });
            $('.js-out-sum').css('color', '#fe9627');
        }

        $('.js-sum').val(e.target.value);
        // @TODO: Пока без рубля
        // Подставляем символ рубля
        if (~$('.js-sum').val().indexOf('₽')) {
            $('.js-sum').val(e.target.value);
        } else {
            $('.js-sum').val(e.target.value + ' ₽');
        }

        // Подставляем значение
        $('.js-out-sum').html(e.target.value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEVBQUUsWUFBWTtBQUNWLFdBQU8sR0FBUCxHQUFhLEVBQWI7O0FBRUE7QUFDQSxRQUFJLGNBQUosR0FBcUIsa0NBQXdCLEVBQXhCLENBQXJCO0FBR0EsUUFBSSxrQkFBSixHQUF5QixpQ0FBdUI7QUFDNUMsZUFBTyxJQUFJLGNBRGlDO0FBRTVDLFlBQUk7QUFGd0MsS0FBdkIsQ0FBekI7O0FBS0EsUUFBSSxXQUFXLFNBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBc0I7QUFDakMsa0JBQVU7QUFEdUIsS0FBdEIsQ0FBZjs7QUFJQSxRQUFJLEtBQUosR0FBWSxJQUFJLFFBQUosRUFBWjs7QUFFQSxRQUFJLFVBQVUsU0FBUyxJQUFULENBQWMsTUFBZCxDQUFxQjtBQUMvQixZQUFJLE1BRDJCOztBQUcvQixnQkFBUTtBQUNKO0FBQ0EsNkJBQWlCLGNBRmI7O0FBSUo7QUFDQSxnQ0FBb0IsZ0JBTGhCOztBQU9KO0FBQ0EsbUNBQXVCLFdBUm5CO0FBU0osa0NBQXNCLFdBVGxCOztBQVdKO0FBQ0Esc0NBQTBCLGNBWnRCO0FBYUosb0NBQXdCLGVBYnBCO0FBY0osbUNBQXVCLGNBZG5CO0FBZUosNkJBQWlCLGFBZmI7QUFnQkoscUNBQXlCO0FBaEJyQixTQUh1Qjs7QUFzQi9CO0FBQ0Esc0JBQWMsd0JBQVk7QUFDdEIsY0FBRSxTQUFGLEVBQWEsV0FBYixDQUF5QixnQkFBekI7O0FBRUE7QUFDQSxjQUFFLGdCQUFGLEVBQW9CLElBQXBCLENBQXlCLEVBQUUs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LGlCQUFLO0FBRkksU0FSZDtBQVlDLG1CQUFXO0FBQ1AsaUJBQUssRUFERTtBQUVQLGlCQUFLO0FBRkUsU0FaWjtBQWdCQyxxQkFBYTtBQWhCZCxLQWpCTTtBQURNLENBQW5COztrQkFzQ2UsWSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvck1vZGVsIGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yTW9kZWwnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yVmlldyBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcnO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICAvLyDQmtCw0LvRjNC60YPQu9GP0YLQvtGAXG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yID0gbmV3IExvYW5DYWxjdWxhdG9yTW9kZWwoe1xuXG4gICAgfSk7XG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yVmlldyA9IG5ldyBMb2FuQ2FsY3VsYXRvclZpZXcoe1xuICAgICAgICBtb2RlbDogYXBwLmxvYW5DYWxjdWxhdG9yLFxuICAgICAgICBlbDogJyNsb2FuQ2FsY3VsYXRvcidcbiAgICB9KTtcblxuICAgIGxldCBBcHBNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgICAgIGRlZmF1bHRzOiB7fVxuICAgIH0pO1xuXG4gICAgYXBwLm1vZGVsID0gbmV3IEFwcE1vZGVsKCk7XG5cbiAgICB2YXIgQXBwVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdib2R5JyxcblxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIC8vINCh0L/QvtGB0L7QsSDQstGL0LTQsNGH0LhcbiAgICAgICAgICAgICdjbGljayAubWV0aG9kJzogJ2NoYW5nZU1ldGhvZCcsXG5cbiAgICAgICAgICAgIC8vINCi0LDQsdGLICfQv9C+0YfQtdC80YMg0LzRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLWFib3V0JzogJ2NoYW5nZUFib3V0VGFiJyxcblxuICAgICAgICAgICAgLy8g0KHQu9Cw0LnQtNC10YBcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLXJpZ2h0JzogJ25leHRTbGlkZScsXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1sZWZ0JzogJ3ByZXZTbGlkZScsXG5cbiAgICAgICAgICAgIC8vINCU0LvRjyDQv9C+0L/QsNC/0L7QslxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fcmVnaXN0ZXInOiAnc2hvd1JlZ2lzdGVyJyxcbiAgICAgICAgICAgICdjbGljayAuanMtcGF5X21ldGhvZCc6ICdzaG93UGF5TWV0aG9kJyxcbiAgICAgICAgICAgICdjbGljayAuYnRuX2ZlZWRiYWNrJzogJ3Nob3dGZWVkYmFjaycsXG4gICAgICAgICAgICAnY2hhbmdlIC5wb3B1cCc6ICdjaGFuZ2VQb3B1cycsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWNsb3NlX3BvcHVwJzogJ2Nsb3NlUG9wdXAnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIGNoYW5nZU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLm1ldGhvZCcpLnRvZ2dsZUNsYXNzKCdtZXRob2QtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyAtLSDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INGC0LXQutGB0YJcbiAgICAgICAgICAgICQoJy5qcy1wYXlfbWV0aG9kJykuaHRtbCgkKCcubWV0aG9kLS1hY3RpdmUnKS5maW5kKCcuanMtdGV4dF9tZXRob2QnKS5odG1sKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyICjQtNC+0LvQttC90L4g0YDQsNCx0L7RgtCw0YLRjCDQuCDQvdCwINC00LXRgdC60YLQvtC/0LUpXG4gICAgICAgIGNoYW5nZUFib3V0VGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1hYm91dC0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLWFib3V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI2Fib3V0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCh0LvQtdC00YPRjtGJ0LjQuSDRgdC70LDQudC0XG4gICAgICAgIG5leHRTbGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5jb250ZW50LXNsaWRlcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnLjNzIGVhc2Utb3V0JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodmFsdWUpIDw9IC01NDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIC0gMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g0J/RgNC10LTRi9C00YPRidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBwcmV2U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID0gLTU0MDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgKyAyNzAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tcmVnaXN0ZXInKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0LLRi9Cx0L7RgNC+0Lwg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIHNob3dQYXlNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tbWV0aG9kJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfRjNGOXG4gICAgICAgIHNob3dGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JfQsNC60YDRi9GC0Ywg0L/QvtC/0LDQv1xuICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFyaWZmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcmlmZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIExvYW5DYWxjdWxhdG9yVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1zdW0nOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgfSxcblxuICAgIC8vINCS0YvQsdC+0YAg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9C30YPQvdC60LBcbiAgICBjaGFuZ2VTdW1SYW5nZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IG1pbiA9IGUudGFyZ2V0Lm1pbixcbiAgICAgICAgICAgIG1heCA9IGUudGFyZ2V0Lm1heCxcbiAgICAgICAgICAgIHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIGxldCBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpO1xuXG4gICAgICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAodmFsIC0gbWluKSAqIDEwMCAvIChtYXggLSBtaW4pICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5jc3MoJ2NvbG9yJywgJyMzYmIzOGUnKTtcblxuICAgICAgICBpZiAodmFsID4gMTAwMDApIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KHJnYigyNTQsIDE1MCwgMzkpLCByZ2IoMjU0LCAxNTAsIDM5KSknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtJykuY3NzKCdjb2xvcicsICcjZmU5NjI3Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKGZpZWxkU3VtKS52YWwoZS50YXJnZXQudmFsdWUgKyAnIOKCvScpO1xuXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtVxuICAgICAgICAkKCcuanMtb3V0LXN1bScpLmh0bWwoZS50YXJnZXQudmFsdWUgKyAnICDigr0nKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVN1bUZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKTtcblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5qcy1vdXQtc3VtJykuY3NzKCdjb2xvcicsICcjM2JiMzhlJyk7XG5cbiAgICAgICAgaWYgKHJhbmdlLnZhbCgpID4gMTAwMDApIHtcbiAgICAgICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KHJnYigyNTQsIDE1MCwgMzkpLCByZ2IoMjU0LCAxNTAsIDM5KSknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtJykuY3NzKCdjb2xvcicsICcjZmU5NjI3Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuanMtc3VtJykudmFsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgLy8gQFRPRE86INCf0L7QutCwINCx0LXQtyDRgNGD0LHQu9GPXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0YHQuNC80LLQvtC7INGA0YPQsdC70Y9cbiAgICAgICAgaWYgKH4kKCcuanMtc3VtJykudmFsKCkuaW5kZXhPZign4oK9JykpIHtcbiAgICAgICAgICAgICQoJy5qcy1zdW0nKS52YWwoZS50YXJnZXQudmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLmpzLXN1bScpLnZhbChlLnRhcmdldC52YWx1ZSArICcg4oK9Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LVcbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5odG1sKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgbGV0IGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAVE9ETzog0J/QvtC60LAg0LHQtdC3INC00L3QtdC5ICggKyAnINC00L3QtdC5JylcbiAgICAgICAgJChmaWVsZFBlcmlvZCkudmFsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VQZXJpb2RGaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDQv9C+0LvQt9GD0L3QvtC6XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJyk7XG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAvLyDQodGC0LjQu9C4INC00LvRjyDQv9C+0LvQt9GD0L3QutCwXG4gICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAocmFuZ2UudmFsKCkgLSByYW5nZS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAocmFuZ2UuYXR0cignbWF4JykgLSByYW5nZS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmFuZ2UudmFsKCkgPiAxMDAwMCkge1xuICAgICAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQocmdiKDI1NCwgMTUwLCAzOSksIHJnYigyNTQsIDE1MCwgMzkpKSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLmpzLXBlcmlvZCcpLnZhbChlLnRhcmdldC52YWx1ZSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyJdfQ==
