(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

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

            // Регистрация
            'click .js-btn_register': 'handleRegister',

            // Для попапов
            'click .js-show_register': 'showRegister',
            'click .js-pay_method': 'showPayMethod',
            'click .btn_feedback': 'showFeedback',
            'change .popup': 'changePopus',
            'click .js-close_popup': 'closePopup'
        },

        initialize: function initialize() {
            $('#userPhone').mask("+7 (999) 999-9999");
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

        handleRegister: function handleRegister() {
            var phone = $('#userPhone').val(),
                pass = $('#userPass').val(),
                repPass = $('#userRepeatPass').val();

            // Если пароли не совпадают
            if (pass !== repPass) {
                $('.js-err-repeat-pass').show();
            } else {
                $('.js-err-repeat-pass').hide();
            }

            // Если пароль короткий
            if (pass.length < 6) {
                $('.js-err-val-pass').show();
            } else if (pass.length >= 6) {
                $('.js-err-val-pass').hide();
            }

            // Проверка телефона
            if (phone.length !== 17) {
                $('.js-err-val-phone').show();
            } else {
                $('.js-err-val-phone').hide();
            }

            if (phone.length === 17 && pass === repPass && pass.length >= 6) {
                $('.js-btn_register').removeClass('is-disabled');
            } else {
                $('.js-btn_register').addClass('is-disabled');
            }

            var data = {
                phone: phone,
                pass: pass
            };

            console.log(JSON.stringify(data));

            // Запрос
            if (!$('.js-btn_register').hasClass('is-disabled')) {
                _helpers2.default.ajaxWrapper('/register', 'POST', JSON.stringify(data), function (data) {
                    if (data.status === 'succes') {
                        console.log('register');
                    } else {
                        console.log('err');
                    }
                });
            }
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

},{"./app/LoanCalculatorModel":2,"./app/LoanCalculatorView":3,"./constants":4,"./helpers":5}],2:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by fred on 08.12.16.
 */
var AppHelpers = {
    // @TODO: url
    baseUrl: 'landing',

    // ajax
    ajaxWrapper: function ajaxWrapper(url, type, data, successCallback, errorCallback) {
        type = type || 'POST';
        data = data || {};
        successCallback = successCallback || function (data) {};
        errorCallback = errorCallback || function (ermsg) {
            console.log(ermsg);
        };

        $.ajax({
            url: AppHelpers.baseUrl + url,
            type: type,
            data: data,
            success: function success(data) {
                if (data.declined == 1) {
                    console.log('decline');
                } else {
                    return successCallback(data);
                }
            },
            error: errorCallback
        });
    }
};

exports.default = AppHelpers;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjs7QUFPSjtBQUNBLG1DQUF1QixXQVJuQjtBQVNKLGtDQUFzQixXQVRsQjs7QUFXSjtBQUNBLHNDQUEwQixnQkFadEI7O0FBY0o7QUFDQSx1Q0FBMkIsY0FmdkI7QUFnQkosb0NBQXdCLGVBaEJwQjtBQWlCSixtQ0FBdUIsY0FqQm5CO0FBa0JKLDZCQUFpQixhQWxCYjtBQW1CSixxQ0FBeUI7QUFuQnJCLFNBSHVCOztBQXlCL0Isb0JBQVksc0JBQVk7QUFDcEIsY0FBRSxZQUFGLEVBQWdCLElBQWhCLENB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ckIsRUFBd0I7QUFDcEIsNEJBQVEsR0FBUixDQUFZLFNBQVo7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsMkJBQU8sZ0JBQWdCLElBQWhCLENBQVA7QUFDSDtBQUNKLGFBVkU7QUFXSCxtQkFBTztBQVhKLFNBQVA7QUFhSDtBQTFCWSxDQUFqQjs7a0JBNkJlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JWaWV3IGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yVmlldyc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAubG9hbkNhbGN1bGF0b3IgPSBuZXcgTG9hbkNhbGN1bGF0b3JNb2RlbCh7XG5cbiAgICB9KTtcbiAgICBhcHAubG9hbkNhbGN1bGF0b3JWaWV3ID0gbmV3IExvYW5DYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAubG9hbkNhbGN1bGF0b3IsXG4gICAgICAgIGVsOiAnI2xvYW5DYWxjdWxhdG9yJ1xuICAgIH0pO1xuXG4gICAgbGV0IEFwcE1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgZGVmYXVsdHM6IHt9XG4gICAgfSk7XG5cbiAgICBhcHAubW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblxuICAgIHZhciBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2JvZHknLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgLy8g0KHQv9C+0YHQvtCxINCy0YvQtNCw0YfQuFxuICAgICAgICAgICAgJ2NsaWNrIC5tZXRob2QnOiAnY2hhbmdlTWV0aG9kJyxcblxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9C/0L7Rh9C10LzRgyDQvNGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tYWJvdXQnOiAnY2hhbmdlQWJvdXRUYWInLFxuXG4gICAgICAgICAgICAvLyDQodC70LDQudC00LXRgFxuICAgICAgICAgICAgJ2NsaWNrIC5hcnJvdy0tcmlnaHQnOiAnbmV4dFNsaWRlJyxcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLWxlZnQnOiAncHJldlNsaWRlJyxcblxuICAgICAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fcmVnaXN0ZXInOiAnaGFuZGxlUmVnaXN0ZXInLFxuXG4gICAgICAgICAgICAvLyDQlNC70Y8g0L/QvtC/0LDQv9C+0LJcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvd19yZWdpc3Rlcic6ICdzaG93UmVnaXN0ZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1wYXlfbWV0aG9kJzogJ3Nob3dQYXlNZXRob2QnLFxuICAgICAgICAgICAgJ2NsaWNrIC5idG5fZmVlZGJhY2snOiAnc2hvd0ZlZWRiYWNrJyxcbiAgICAgICAgICAgICdjaGFuZ2UgLnBvcHVwJzogJ2NoYW5nZVBvcHVzJyxcbiAgICAgICAgICAgICdjbGljayAuanMtY2xvc2VfcG9wdXAnOiAnY2xvc2VQb3B1cCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnI3VzZXJQaG9uZScpLm1hc2soXCIrNyAoOTk5KSA5OTktOTk5OVwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQktGL0LHQvtGAINGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBjaGFuZ2VNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5tZXRob2QnKS50b2dnbGVDbGFzcygnbWV0aG9kLS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gLS0g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDRgtC10LrRgdGCXG4gICAgICAgICAgICAkKCcuanMtcGF5X21ldGhvZCcpLmh0bWwoJCgnLm1ldGhvZC0tYWN0aXZlJykuZmluZCgnLmpzLXRleHRfbWV0aG9kJykuaHRtbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YLQsNCx0L7QsiAo0LTQvtC70LbQvdC+INGA0LDQsdC+0YLQsNGC0Ywg0Lgg0L3QsCDQtNC10YHQutGC0L7Qv9C1KVxuICAgICAgICBjaGFuZ2VBYm91dFRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5idG4tYWJvdXQtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1hYm91dC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNhYm91dFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQodC70LXQtNGD0Y7RidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBuZXh0U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA8PSAtNTQwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSAtIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vINCf0YDQtdC00YvQtNGD0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgcHJldlNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IC01NDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpICsgMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHBob25lID0gJCgnI3VzZXJQaG9uZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3MgPSAkKCcjdXNlclBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICByZXBQYXNzID0gJCgnI3VzZXJSZXBlYXRQYXNzJykudmFsKCk7XG5cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglxuICAgICAgICAgICAgaWYgKHBhc3MgIT09IHJlcFBhc3MpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Ywg0LrQvtGA0L7RgtC60LjQuVxuICAgICAgICAgICAgaWYgKHBhc3MubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINGC0LXQu9C10YTQvtC90LBcbiAgICAgICAgICAgIGlmIChwaG9uZS5sZW5ndGggIT09IDE3KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZXBQYXNzICYmIHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgIHBhc3M6IHBhc3MsXG4gICAgICAgICAgICAgICAgLy8g0J/QtdGA0LXQtNCw0YLRjCDRgdGD0LzQvNGDINC4INGB0YDQvtC6XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICAgICAgICAgIC8vINCX0LDQv9GA0L7RgVxuICAgICAgICAgICAgaWYgKCEkKCcuanMtYnRuX3JlZ2lzdGVyJykuaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2NlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tcmVnaXN0ZXInKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0LLRi9Cx0L7RgNC+0Lwg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIHNob3dQYXlNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tbWV0aG9kJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfRjNGOXG4gICAgICAgIHNob3dGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JfQsNC60YDRi9GC0Ywg0L/QvtC/0LDQv1xuICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFyaWZmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcmlmZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIExvYW5DYWxjdWxhdG9yVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1zdW0nOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgfSxcblxuICAgIC8vINCS0YvQsdC+0YAg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9C30YPQvdC60LBcbiAgICBjaGFuZ2VTdW1SYW5nZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IG1pbiA9IGUudGFyZ2V0Lm1pbixcbiAgICAgICAgICAgIG1heCA9IGUudGFyZ2V0Lm1heCxcbiAgICAgICAgICAgIHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIGxldCBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpO1xuXG4gICAgICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAodmFsIC0gbWluKSAqIDEwMCAvIChtYXggLSBtaW4pICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5jc3MoJ2NvbG9yJywgJyMzYmIzOGUnKTtcblxuICAgICAgICBpZiAodmFsID4gMTAwMDApIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KHJnYigyNTQsIDE1MCwgMzkpLCByZ2IoMjU0LCAxNTAsIDM5KSknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtJykuY3NzKCdjb2xvcicsICcjZmU5NjI3Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKGZpZWxkU3VtKS52YWwoZS50YXJnZXQudmFsdWUgKyAnIOKCvScpO1xuXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtVxuICAgICAgICAkKCcuanMtb3V0LXN1bScpLmh0bWwoZS50YXJnZXQudmFsdWUgKyAnICDigr0nKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVN1bUZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKTtcblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5qcy1vdXQtc3VtJykuY3NzKCdjb2xvcicsICcjM2JiMzhlJyk7XG5cbiAgICAgICAgaWYgKHJhbmdlLnZhbCgpID4gMTAwMDApIHtcbiAgICAgICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KHJnYigyNTQsIDE1MCwgMzkpLCByZ2IoMjU0LCAxNTAsIDM5KSknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtJykuY3NzKCdjb2xvcicsICcjZmU5NjI3Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuanMtc3VtJykudmFsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgLy8gQFRPRE86INCf0L7QutCwINCx0LXQtyDRgNGD0LHQu9GPXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0YHQuNC80LLQvtC7INGA0YPQsdC70Y9cbiAgICAgICAgaWYgKH4kKCcuanMtc3VtJykudmFsKCkuaW5kZXhPZign4oK9JykpIHtcbiAgICAgICAgICAgICQoJy5qcy1zdW0nKS52YWwoZS50YXJnZXQudmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLmpzLXN1bScpLnZhbChlLnRhcmdldC52YWx1ZSArICcg4oK9Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LVcbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5odG1sKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgbGV0IGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAVE9ETzog0J/QvtC60LAg0LHQtdC3INC00L3QtdC5ICggKyAnINC00L3QtdC5JylcbiAgICAgICAgJChmaWVsZFBlcmlvZCkudmFsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VQZXJpb2RGaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDQv9C+0LvQt9GD0L3QvtC6XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJyk7XG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAvLyDQodGC0LjQu9C4INC00LvRjyDQv9C+0LvQt9GD0L3QutCwXG4gICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAocmFuZ2UudmFsKCkgLSByYW5nZS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAocmFuZ2UuYXR0cignbWF4JykgLSByYW5nZS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmFuZ2UudmFsKCkgPiAxMDAwMCkge1xuICAgICAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQocmdiKDI1NCwgMTUwLCAzOSksIHJnYigyNTQsIDE1MCwgMzkpKSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLmpzLXBlcmlvZCcpLnZhbChlLnRhcmdldC52YWx1ZSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA4LjEyLjE2LlxuICovXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICAvLyBAVE9ETzogdXJsXG4gICAgYmFzZVVybDogJ2xhbmRpbmcnLFxuXG4gICAgLy8gYWpheFxuICAgIGFqYXhXcmFwcGVyOiAodXJsLCB0eXBlLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spID0+IHtcbiAgICAgICAgdHlwZSA9IHR5cGUgfHwgJ1BPU1QnO1xuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgc3VjY2Vzc0NhbGxiYWNrID0gc3VjY2Vzc0NhbGxiYWNrIHx8IGZ1bmN0aW9uKGRhdGEpIHt9O1xuICAgICAgICBlcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjayB8fCBmdW5jdGlvbihlcm1zZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJtc2cpO1xuICAgICAgICB9O1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEFwcEhlbHBlcnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kZWNsaW5lZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWNsaW5lJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGVycm9yQ2FsbGJhY2tcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwSGVscGVyczsiXX0=
