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
            'click .js-btn_feedback': 'handleFeedback',

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

        // Регистрация
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
                pass: pass,
                sum: app.loanCalculator.get('sum'),
                period: app.loanCalculator.get('period')
            };

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

        // Обработка формы обратной связи
        handleFeedback: function handleFeedback() {
            var theme = $('.js-feed-select_theme option:selected').val(),
                email = $('.js-feed-email').val(),
                message = $('.js-feed-message').val();

            var data = {
                theme: theme,
                email: email,
                message: message
            };

            email == 0 || message == 0 ? $('.js-btn_feedback').addClass('is-disabled') : $('.js-btn_feedback').removeClass('is-disabled');

            // Запрос

            if (!$('.js-btn_feedback').hasClass('is-disabled')) {
                console.log(data);
                _helpers2.default.ajaxWrapper('/feedback', 'POST', JSON.stringify(data), function (data) {
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
        period: 6,
        type: 'once' // "once" or "two_weeks"
    },

    // Подсчет общей суммы займа (ОД + Проценты + Комиссии)
    calculateLoanSum: function calculateLoanSum(sum, period) {
        var total;

        sum = parseInt(sum);
        period = parseInt(period);

        if (sum <= _constants2.default.tarrifs[0].max_sum) {
            // Считаем по первому тарифу
            total = Math.ceil((sum + sum * _constants2.default.feeIssue) * (_constants2.default.tarrifs[0].percent * period + 1));
        } else {
            // Считаем по второму тарифу
            var percent = _constants2.default.tarrifs[1].percent * 7;
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

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by fred on 06.12.16.
 */

var LoanCalculatorView = Backbone.View.extend({

    events: {
        'input input[type=range].js-slider--sum': 'changeSumRange',
        'change input[type=tel].js-sum': 'changeSumField',

        'input input[type=range].js-slider--period': 'changePeriodRange',
        'change input[type=tel].js-period': 'changePeriodField',

        // Для полей калькулятора
        'focus .range_field': 'lightBorderInput',
        'focusout .range_field': 'offLightBorderInput'
    },

    initialize: function initialize() {

        this.model.on('change', this.change, this);
    },

    change: function change() {
        var sum = this.model.get('sum'),
            period = this.model.get('period'),

        // Ползунок с выбора срока
        rangePeriod = $('input#period'),

        // Поле суммы
        fieldSum = $('input[name=sum]'),

        // Поле срока
        fieldPeriod = $('input[name=period]');

        // Подставляем значение суммы займа
        $('.js-out-sum').html(_helpers2.default.formatNumber(sum) + ' ₽');

        // -- в поле cуммы
        $(fieldSum).val(sum);
        // -- в поле период
        $(fieldPeriod).val(period);
        this.model.set('period', $(rangePeriod).val());

        if (sum > _constants2.default.sumBorder) {
            _helpers2.default.printResults();
            $('.js-range_info-period span:nth-child(1)').html('4 недели');
            $('.js-range_info-period span:nth-child(2)').html('12 недель');

            // Меняем значение ползунка
            this.changeRangeMorePeriod(12, 4);

            this.model.get('period') == 4 ? $('label[for=focusInpPeriod]').html('недели') : $('label[for=focusInpPeriod]').html('недель');
        } else {
            $('.info-back span').html('Возвращаете');
            $('.js-out-sum_back').html(_helpers2.default.formatNumber(this.model.calculateLoanSum(sum, period)) + ' ₽');
            $('.js-range_info-period span:nth-child(1)').html('8 дней');
            $('.js-range_info-period span:nth-child(2)').html('30 дней');
            $('label[for=focusInpPeriod]').html('дней');

            this.changeRangeMorePeriod(30, 8);
        }
    },

    // Изменение ползунка, если сумма больше
    changeRangeMorePeriod: function changeRangeMorePeriod(max, min) {
        var rangePeriod = $('input#period');

        $(rangePeriod).attr('max', max).attr('min', min).css({
            'backgroundSize': ($(rangePeriod).val() - $(rangePeriod).attr('min')) * 100 / ($(rangePeriod).attr('max') - $(rangePeriod).attr('min')) + '% 100%'
        });
    },

    // Выбор суммы при помощи ползунка
    changeSumRange: function changeSumRange(e) {
        var min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        this.model.set('sum', val);
    },

    // -- Выбор суммы при помощи поля
    changeSumField: function changeSumField(e) {
        // Изменяем ползунок
        var range = $('input[type=range].js-slider--sum');

        var $input = $(event.target);
        var sum = parseInt($input.val()) || 6000;
        var pow = Math.ceil(sum / 100) * 100;
        if (pow - sum > 50) {
            sum = pow - 100;
        } else {
            sum = pow;
        }
        $input.val(sum);

        if (sum > _constants2.default.tarrifs[1].max_sum) {
            this.model.set('sum', _constants2.default.tarrifs[1].max_sum);
            this.model.set({
                sum: _constants2.default.tarrifs[1].max_sum,
                type: 'two_weeks'
            });
        }

        if (sum < _constants2.default.tarrifs[0].min_sum) {
            this.model.set({
                sum: _constants2.default.tarrifs[0].min_sum,
                type: 'once'
            });
        }

        $(range).val(e.target.value);

        // Стили для ползунка
        $(range).css({
            'backgroundSize': (range.val() - range.attr('min')) * 100 / (range.attr('max') - range.attr('min')) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        this.model.set('sum', $('.js-sum').val());
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function changePeriodRange(e) {
        var min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        this.model.set('period', val);
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

        this.model.set('period', e.target.value);
    },

    lightBorderInput: function lightBorderInput(e) {
        $(e.target).next('label').css({
            'borderColor': '#18a4d2'
        });
    },

    offLightBorderInput: function offLightBorderInput(e) {
        $(e.target).next('label').css({
            'borderColor': '#b0bac5'
        });
    }
});

exports.default = LoanCalculatorView;

},{"../constants":4,"../helpers":5}],4:[function(require,module,exports){
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
    }],
    feeIssue: 0.05,
    factorMax: 0.15,
    factorMin: 0.01,
    sumBorder: 30000,
    FEE_ISSUE: 0.05, // Коммисия за выдачу
    PERCENT_STANDART: 0.015, // Стандартный процент (в день)
    PERCENT_DELAY: 0.015, // Процент в случае просрочки (в день)
    FINE_DELAY: 1000.00 };

exports.default = AppConstants;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppHelpers = {
    // @TODO: url
    baseUrl: '',

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
    },

    // Финальная сумма
    printResults: function printResults() {
        var sum = app.loanCalculator.get('sum');
        var days = app.loanCalculator.get('period');

        /*        let sum = $('.js-sum').val();
                let days = $('.js-period').val();*/

        var paymethod = void 0;

        if (sum < _constants2.default.sumBorder) paymethod = 'Разовый платёж на сумму';else {
            days *= 7;
            paymethod = AppHelpers.estimateAnnPeriods(days) + ' ' + AppHelpers.getCase(AppHelpers.estimateAnnPeriods(days), 'платёж', 'платежа', 'платежей');
        }
        sum = AppHelpers.estimateReturnSum(sum, days);

        $('.info-back span').html(paymethod + ' по');

        $('.js-out-sum_back').html(AppHelpers.formatNumber(sum) + ' ₽');
    },

    estimateAnnPeriods: function estimateAnnPeriods(days) {
        return Math.ceil(days / 14);
    },

    getCase: function getCase(_number, _case1, _case2, _case3) {
        var base = _number - Math.floor(_number / 100) * 100;
        var result;

        if (base > 9 && base < 20) {
            result = _case3;
        } else {
            var remainder = _number - Math.floor(_number / 10) * 10;

            if (1 == remainder) result = _case1;else if (0 < remainder && 5 > remainder) result = _case2;else result = _case3;
        }

        return result;
    },

    estimateReturnSum: function estimateReturnSum(sum, days) {
        var feeIssue = _constants2.default.feeIssue;
        var factorMax = _constants2.default.factorMax;
        var factorMin = _constants2.default.factorMin;

        sum = Number(sum);
        var payback = Math.ceil(sum * feeIssue);
        //Разовый платеж
        if (sum < _constants2.default.sumBorder) {

            return Math.ceil((sum + payback) * (_constants2.default.tarrifs[0].percent * days + 1));
        } else {
            var percent = _constants2.default.tarrifs[1].percent * 14;
            var ann_periods = days / 14;
            var annuity = percent * Math.pow(1 + percent, ann_periods) / (Math.pow(1 + percent, ann_periods) - 1);

            return Math.ceil((sum + payback) * annuity);
        }
    },

    formatNumber: function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }
}; /**
    * Created by fred on 08.12.16.
    */
exports.default = AppHelpers;

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjs7QUFPSjtBQUNBLG1DQUF1QixXQVJuQjtBQVNKLGtDQUFzQixXQVRsQjs7QUFXSjtBQUNBLHNDQUEwQixnQkFadEI7QUFhSixzQ0FBMEIsZ0JBYnRCOztBQWVKO0FBQ0EsdUNBQTJCLGNBaEJ2QjtBQWlCSixvQ0FBd0IsZUFqQnBCO0FBa0JKLG1DQUF1QixjQWxCbkI7QUFtQkosNkJBQWlCLGFBbkJiO0FBb0JKLHFDQUF5QjtBQXBCckIsU0FIdUI7O0FBMEIvQixvQkFBWSxzQkFBWTtBQUNwQixjQUFF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UUFBSixHQUFlLE9BQWYsQ0FBdUIsNkJBQXZCLEVBQXNELEtBQXRELENBQVA7QUFDSDtBQWpHWSxDQUFqQixDLENBTEE7OztrQkF5R2UsVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JNb2RlbCBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvclZpZXcgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JWaWV3JztcblxuJChmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LmFwcCA9IHt9O1xuXG4gICAgLy8g0JrQsNC70YzQutGD0LvRj9GC0L7RgFxuICAgIGFwcC5sb2FuQ2FsY3VsYXRvciA9IG5ldyBMb2FuQ2FsY3VsYXRvck1vZGVsKHtcblxuICAgIH0pO1xuICAgIGFwcC5sb2FuQ2FsY3VsYXRvclZpZXcgPSBuZXcgTG9hbkNhbGN1bGF0b3JWaWV3KHtcbiAgICAgICAgbW9kZWw6IGFwcC5sb2FuQ2FsY3VsYXRvcixcbiAgICAgICAgZWw6ICcjbG9hbkNhbGN1bGF0b3InXG4gICAgfSk7XG5cbiAgICBsZXQgQXBwTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgICAgICBkZWZhdWx0czoge31cbiAgICB9KTtcblxuICAgIGFwcC5tb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXG4gICAgdmFyIEFwcFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnYm9keScsXG5cbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAvLyDQodC/0L7RgdC+0LEg0LLRi9C00LDRh9C4XG4gICAgICAgICAgICAnY2xpY2sgLm1ldGhvZCc6ICdjaGFuZ2VNZXRob2QnLFxuXG4gICAgICAgICAgICAvLyDQotCw0LHRiyAn0L/QvtGH0LXQvNGDINC80YsnXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bi1hYm91dCc6ICdjaGFuZ2VBYm91dFRhYicsXG5cbiAgICAgICAgICAgIC8vINCh0LvQsNC50LTQtdGAXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1yaWdodCc6ICduZXh0U2xpZGUnLFxuICAgICAgICAgICAgJ2NsaWNrIC5hcnJvdy0tbGVmdCc6ICdwcmV2U2xpZGUnLFxuXG4gICAgICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWJ0bl9yZWdpc3Rlcic6ICdoYW5kbGVSZWdpc3RlcicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWJ0bl9mZWVkYmFjayc6ICdoYW5kbGVGZWVkYmFjaycsXG5cbiAgICAgICAgICAgIC8vINCU0LvRjyDQv9C+0L/QsNC/0L7QslxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1zaG93X3JlZ2lzdGVyJzogJ3Nob3dSZWdpc3RlcicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXBheV9tZXRob2QnOiAnc2hvd1BheU1ldGhvZCcsXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bl9mZWVkYmFjayc6ICdzaG93RmVlZGJhY2snLFxuICAgICAgICAgICAgJ2NoYW5nZSAucG9wdXAnOiAnY2hhbmdlUG9wdXMnLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1jbG9zZV9wb3B1cCc6ICdjbG9zZVBvcHVwJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJyN1c2VyUGhvbmUnKS5tYXNrKFwiKzcgKDk5OSkgOTk5LTk5OTlcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JLRi9Cx0L7RgCDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y9cbiAgICAgICAgY2hhbmdlTWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcubWV0aG9kJykudG9nZ2xlQ2xhc3MoJ21ldGhvZC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIC8vIC0tINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0YLQtdC60YHRglxuICAgICAgICAgICAgJCgnLmpzLXBheV9tZXRob2QnKS5odG1sKCQoJy5tZXRob2QtLWFjdGl2ZScpLmZpbmQoJy5qcy10ZXh0X21ldGhvZCcpLmh0bWwoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGC0LDQsdC+0LIgKNC00L7Qu9C20L3QviDRgNCw0LHQvtGC0LDRgtGMINC4INC90LAg0LTQtdGB0LrRgtC+0L/QtSlcbiAgICAgICAgY2hhbmdlQWJvdXRUYWI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuYnRuLWFib3V0LS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdidG4tYWJvdXQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICAkKCcuanMtY2hhbmdlLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjYWJvdXRUYWItJyArIHRhYklkKS5hZGRDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KHQu9C10LTRg9GO0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgbmV4dFNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPD0gLTU0MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgLSAyNzAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyDQn9GA0LXQtNGL0LTRg9GJ0LjQuSDRgdC70LDQudC0XG4gICAgICAgIHByZXZTbGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5jb250ZW50LXNsaWRlcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnLjNzIGVhc2Utb3V0JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodmFsdWUpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAtNTQwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSArIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICBoYW5kbGVSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHBob25lID0gJCgnI3VzZXJQaG9uZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3MgPSAkKCcjdXNlclBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICByZXBQYXNzID0gJCgnI3VzZXJSZXBlYXRQYXNzJykudmFsKCk7XG5cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglxuICAgICAgICAgICAgaWYgKHBhc3MgIT09IHJlcFBhc3MpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Ywg0LrQvtGA0L7RgtC60LjQuVxuICAgICAgICAgICAgaWYgKHBhc3MubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINGC0LXQu9C10YTQvtC90LBcbiAgICAgICAgICAgIGlmIChwaG9uZS5sZW5ndGggIT09IDE3KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZXBQYXNzICYmIHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgIHBhc3M6IHBhc3MsXG4gICAgICAgICAgICAgICAgc3VtOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgICAgICBwZXJpb2Q6IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgaGFuZGxlRmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGVtZSA9ICQoJy5qcy1mZWVkLXNlbGVjdF90aGVtZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICQoJy5qcy1mZWVkLWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICQoJy5qcy1mZWVkLW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBlbWFpbCA9PSAwIHx8IG1lc3NhZ2UgPT0gMCA/ICQoJy5qcy1idG5fZmVlZGJhY2snKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKSA6ICQoJy5qcy1idG5fZmVlZGJhY2snKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgLy8g0JfQsNC/0YDQvtGBXG5cbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9mZWVkYmFjaycpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgICAgICAgc2hvd1JlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLXJlZ2lzdGVyJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINCy0YvQsdC+0YDQvtC8INGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBzaG93UGF5TWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLW1ldGhvZCcpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30YzRjlxuICAgICAgICBzaG93RmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tZmVlZGJhY2snKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCX0LDQutGA0YvRgtGMINC/0L7Qv9Cw0L9cbiAgICAgICAgY2xvc2VQb3B1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwJykuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgYXBwLnZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgLy8g0JfQvdCw0YfQtdC90LjRjyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHN1bTogNjAwMCxcbiAgICAgICAgcGVyaW9kOiA2LFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bSc6ICdjaGFuZ2VTdW1SYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXN1bSc6ICdjaGFuZ2VTdW1GaWVsZCcsXG5cbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJzogJ2NoYW5nZVBlcmlvZFJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtcGVyaW9kJzogJ2NoYW5nZVBlcmlvZEZpZWxkJyxcblxuICAgICAgICAvLyDQlNC70Y8g0L/QvtC70LXQuSDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LBcbiAgICAgICAgJ2ZvY3VzIC5yYW5nZV9maWVsZCc6ICdsaWdodEJvcmRlcklucHV0JyxcbiAgICAgICAgJ2ZvY3Vzb3V0IC5yYW5nZV9maWVsZCc6ICdvZmZMaWdodEJvcmRlcklucHV0J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMubW9kZWwuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgIHBlcmlvZCA9IHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C30YPQvdC+0Log0YEg0LLRi9Cx0L7RgNCwINGB0YDQvtC60LBcbiAgICAgICAgICAgIHJhbmdlUGVyaW9kID0gJCgnaW5wdXQjcGVyaW9kJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQtSDRgdGD0LzQvNGLXG4gICAgICAgICAgICBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LUg0YHRgNC+0LrQsFxuICAgICAgICAgICAgZmllbGRQZXJpb2QgPSAkKCdpbnB1dFtuYW1lPXBlcmlvZF0nKTtcblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0YHRg9C80LzRiyDQt9Cw0LnQvNCwXG4gICAgICAgICQoJy5qcy1vdXQtc3VtJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcblxuICAgICAgICAvLyAtLSDQsiDQv9C+0LvQtSBj0YPQvNC80YtcbiAgICAgICAgJChmaWVsZFN1bSkudmFsKHN1bSk7XG4gICAgICAgIC8vIC0tINCyINC/0L7Qu9C1INC/0LXRgNC40L7QtFxuICAgICAgICAkKGZpZWxkUGVyaW9kKS52YWwocGVyaW9kKTtcbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsICQocmFuZ2VQZXJpb2QpLnZhbCgpKTtcblxuICAgICAgICBpZiAoc3VtID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuICAgICAgICAgICAgQXBwSGVscGVycy5wcmludFJlc3VsdHMoKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzQg0L3QtdC00LXQu9C4Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMiknKS5odG1sKCcxMiDQvdC10LTQtdC70YwnKTtcblxuICAgICAgICAgICAgLy8g0JzQtdC90Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZU1vcmVQZXJpb2QoMTIsIDQpO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgncGVyaW9kJykgPT0gNCA/ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5pbmZvLWJhY2sgc3BhbicpLmh0bWwoJ9CS0L7Qt9Cy0YDQsNGJ0LDQtdGC0LUnKTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtX2JhY2snKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHRoaXMubW9kZWwuY2FsY3VsYXRlTG9hblN1bShzdW0sIHBlcmlvZCkpICsgJyDigr0nKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzgg0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgyKScpLmh0bWwoJzMwINC00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0LTQvdC10LknKTtcblxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZU1vcmVQZXJpb2QoMzAsIDgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwLCDQtdGB0LvQuCDRgdGD0LzQvNCwINCx0L7Qu9GM0YjQtVxuICAgIGNoYW5nZVJhbmdlTW9yZVBlcmlvZDogZnVuY3Rpb24gKG1heCwgbWluKSB7XG4gICAgICAgIGxldCByYW5nZVBlcmlvZCA9ICQoJ2lucHV0I3BlcmlvZCcpO1xuXG4gICAgICAgICQocmFuZ2VQZXJpb2QpXG4gICAgICAgICAgICAuYXR0cignbWF4JywgbWF4KVxuICAgICAgICAgICAgLmF0dHIoJ21pbicsIG1pbilcbiAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICgkKHJhbmdlUGVyaW9kKS52YWwoKSAtICQocmFuZ2VQZXJpb2QpLmF0dHIoJ21pbicpKSAqIDEwMCAvICgkKHJhbmdlUGVyaW9kKS5hdHRyKCdtYXgnKSAtICQocmFuZ2VQZXJpb2QpLmF0dHIoJ21pbicpKSArICclIDEwMCUnXG4gICAgICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgdmFsKTtcbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VTdW1GaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDQv9C+0LvQt9GD0L3QvtC6XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJyk7XG5cbiAgICAgICAgdmFyICRpbnB1dCA9ICQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgdmFyIHN1bSA9IHBhcnNlSW50KCRpbnB1dC52YWwoKSkgfHwgNjAwMDtcbiAgICAgICAgbGV0IHBvdyA9IE1hdGguY2VpbChzdW0vMTAwKSAqMTAwO1xuICAgICAgICBpZiggKHBvdyAtIHN1bSkgPiA1MCl7XG4gICAgICAgICAgICBzdW0gPSBwb3cgLSAxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW0gPSBwb3c7XG4gICAgICAgIH1cbiAgICAgICAgJGlucHV0LnZhbChzdW0pO1xuXG4gICAgICAgIGlmIChzdW0gPiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0d29fd2Vla3MnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdvbmNlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdW0nLCAkKCcuanMtc3VtJykudmFsKCkpO1xuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlUGVyaW9kUmFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGxldCBtaW4gPSBlLnRhcmdldC5taW4sXG4gICAgICAgICAgICBtYXggPSBlLnRhcmdldC5tYXgsXG4gICAgICAgICAgICB2YWwgPSBlLnRhcmdldC52YWx1ZTtcblxuICAgICAgICAkKGUudGFyZ2V0KS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHZhbCAtIG1pbikgKiAxMDAgLyAobWF4IC0gbWluKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdwZXJpb2QnLCB2YWwpO1xuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnKTtcblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuanMtcGVyaW9kJykudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgZS50YXJnZXQudmFsdWUpO1xuICAgIH0sXG5cbiAgICBsaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnIzE4YTRkMidcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9mZkxpZ2h0Qm9yZGVySW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICQoZS50YXJnZXQpLm5leHQoJ2xhYmVsJykuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXJDb2xvcic6ICcjYjBiYWM1J1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hbkNhbGN1bGF0b3JWaWV3OyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG52YXIgQXBwQ29uc3RhbnRzID0ge1xuICAgIHRhcnJpZnM6IFt7XG4gICAgICAgIGdyYWRlX2lkOiAxLFxuICAgICAgICBuYW1lOiAn0J7QsdGL0YfQvdGL0LknLFxuICAgICAgICBtaW5fbGltaXQ6IDAsXG4gICAgICAgIG1heF9saW1pdDogMjk5OTksXG4gICAgICAgIG1pbl9zdW06IDE1MDAsXG4gICAgICAgIG1heF9zdW06IDI5OTk5LFxuICAgICAgICBwZXJjZW50OiAwLjAxNSxcbiAgICAgICAgcGVyaW9kX29uY2U6IHtcbiAgICAgICAgICAgIG1pbjogOCxcbiAgICAgICAgICAgIG1heDogMzBcbiAgICAgICAgfSxcbiAgICAgICAgcGVyaW9kX3R3OiB7XG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDBcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQtNC+0YHRgtGD0L/QtdC9INC00LvRjyDQstGB0LXRhSDQt9Cw0LXQvNGJ0LjQutC+0LInXG4gICAgfSwge1xuICAgICAgICBncmFkZV9pZDogMixcbiAgICAgICAgbmFtZTogJ9Cf0YDQtdC80LjRg9C8JyxcbiAgICAgICAgbWluX2xpbWl0OiAzMDAwMCxcbiAgICAgICAgbWF4X2xpbWl0OiA1MDAwMCxcbiAgICAgICAgbWluX3N1bTogMzAwMDAsXG4gICAgICAgIG1heF9zdW06IDUwMDAwLFxuICAgICAgICBwZXJjZW50OiAwLjAwNDksXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDBcbiAgICAgICAgfSxcbiAgICAgICAgcGVyaW9kX3R3OiB7XG4gICAgICAgICAgICBtaW46IDI4LFxuICAgICAgICAgICAgbWF4OiA4NFxuICAgICAgICB9LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ9Cx0YPQtNC10YIg0LTQvtGB0YLRg9C/0LXQvSDQv9C+0YHQu9C1INGB0LLQvtC10LLRgNC10LzQtdC90L3QvtCz0L4g0L/QvtCz0LDRiNC10L3QuNGPINC+0LTQvdC+0LPQviDQt9Cw0LnQvNCwJ1xuICAgIH1dLFxuICAgIGZlZUlzc3VlOiAwLjA1LFxuICAgIGZhY3Rvck1heDogMC4xNSxcbiAgICBmYWN0b3JNaW46IDAuMDEsXG4gICAgc3VtQm9yZGVyOiAzMDAwMCxcbiAgICBGRUVfSVNTVUU6IDAuMDUsIC8vINCa0L7QvNC80LjRgdC40Y8g0LfQsCDQstGL0LTQsNGH0YNcbiAgICBQRVJDRU5UX1NUQU5EQVJUOiAwLjAxNSwgLy8g0KHRgtCw0L3QtNCw0YDRgtC90YvQuSDQv9GA0L7RhtC10L3RgiAo0LIg0LTQtdC90YwpXG4gICAgUEVSQ0VOVF9ERUxBWTogMC4wMTUsIC8vINCf0YDQvtGG0LXQvdGCINCyINGB0LvRg9GH0LDQtSDQv9GA0L7RgdGA0L7Rh9C60LggKNCyINC00LXQvdGMKVxuICAgIEZJTkVfREVMQVk6IDEwMDAuMDAsIC8vINCc0LDQutGB0LjQvNCw0LvRjNC90LDRjyDRgdGD0LzQvNCwINGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0YjRgtGA0LDRhNCwINC30LAg0L/RgNC+0YHRgNC+0YfQutGDXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENvbnN0YW50czsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwOC4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5cbnZhciBBcHBIZWxwZXJzID0ge1xuICAgIC8vIEBUT0RPOiB1cmxcbiAgICBiYXNlVXJsOiAnJyxcblxuICAgIC8vIGFqYXhcbiAgICBhamF4V3JhcHBlcjogKHVybCwgdHlwZSwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHR5cGUgPSB0eXBlIHx8ICdQT1NUJztcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIHN1Y2Nlc3NDYWxsYmFjayA9IHN1Y2Nlc3NDYWxsYmFjayB8fCBmdW5jdGlvbihkYXRhKSB7fTtcbiAgICAgICAgZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJtc2cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVybXNnKTtcbiAgICAgICAgfTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogQXBwSGVscGVycy5iYXNlVXJsICsgdXJsLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmRlY2xpbmVkID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlY2xpbmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JDYWxsYmFja1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g0KTQuNC90LDQu9GM0L3QsNGPINGB0YPQvNC80LBcbiAgICBwcmludFJlc3VsdHM6ICgpID0+IHtcbiAgICAgICAgbGV0IHN1bSA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3N1bScpO1xuICAgICAgICBsZXQgZGF5cyA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpO1xuXG4vKiAgICAgICAgbGV0IHN1bSA9ICQoJy5qcy1zdW0nKS52YWwoKTtcbiAgICAgICAgbGV0IGRheXMgPSAkKCcuanMtcGVyaW9kJykudmFsKCk7Ki9cblxuICAgICAgICBsZXQgcGF5bWV0aG9kO1xuXG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSBwYXltZXRob2QgPSAn0KDQsNC30L7QstGL0Lkg0L/Qu9Cw0YLRkdC2INC90LAg0YHRg9C80LzRgyc7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF5cyAqPSA3O1xuICAgICAgICAgICAgcGF5bWV0aG9kID0gKEFwcEhlbHBlcnMuZXN0aW1hdGVBbm5QZXJpb2RzKGRheXMpICsgJyAnICsgQXBwSGVscGVycy5nZXRDYXNlKEFwcEhlbHBlcnMuZXN0aW1hdGVBbm5QZXJpb2RzKGRheXMpLCAn0L/Qu9Cw0YLRkdC2JywgJ9C/0LvQsNGC0LXQttCwJywgJ9C/0LvQsNGC0LXQttC10LknKSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VtID0gQXBwSGVscGVycy5lc3RpbWF0ZVJldHVyblN1bShzdW0sIGRheXMpO1xuXG4gICAgICAgICQoJy5pbmZvLWJhY2sgc3BhbicpLmh0bWwocGF5bWV0aG9kKycg0L/QvicpO1xuXG4gICAgICAgICQoJy5qcy1vdXQtc3VtX2JhY2snKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHN1bSkgKyAnIOKCvScpO1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZUFublBlcmlvZHM6IChkYXlzKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwoZGF5cyAvIDE0KTtcbiAgICB9LFxuXG4gICAgZ2V0Q2FzZTogKF9udW1iZXIsIF9jYXNlMSwgX2Nhc2UyLCBfY2FzZTMpID0+IHtcbiAgICAgICAgdmFyIGJhc2UgPSBfbnVtYmVyIC0gTWF0aC5mbG9vcihfbnVtYmVyIC8gMTAwKSAqIDEwMDtcbiAgICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgICBpZiAoYmFzZSA+IDkgJiYgYmFzZSA8IDIwKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBfY2FzZTM7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZW1haW5kZXIgPSBfbnVtYmVyIC0gTWF0aC5mbG9vcihfbnVtYmVyIC8gMTApICogMTA7XG5cbiAgICAgICAgICAgIGlmICgxID09IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UxO1xuICAgICAgICAgICAgZWxzZSBpZiAoMCA8IHJlbWFpbmRlciAmJiA1ID4gcmVtYWluZGVyKSByZXN1bHQgPSBfY2FzZTI7XG4gICAgICAgICAgICBlbHNlIHJlc3VsdCA9IF9jYXNlMztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGVzdGltYXRlUmV0dXJuU3VtOiAoc3VtLCBkYXlzKSA9PiB7XG4gICAgICAgIGNvbnN0IGZlZUlzc3VlID0gQXBwQ29uc3RhbnRzLmZlZUlzc3VlO1xuICAgICAgICBjb25zdCBmYWN0b3JNYXggPSBBcHBDb25zdGFudHMuZmFjdG9yTWF4O1xuICAgICAgICBjb25zdCBmYWN0b3JNaW4gPSBBcHBDb25zdGFudHMuZmFjdG9yTWluO1xuXG4gICAgICAgIHN1bSA9IE51bWJlcihzdW0pO1xuICAgICAgICBsZXQgcGF5YmFjayA9IE1hdGguY2VpbChzdW0gKiBmZWVJc3N1ZSk7XG4gICAgICAgIC8v0KDQsNC30L7QstGL0Lkg0L/Qu9Cw0YLQtdC2XG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoKHN1bSArIHBheWJhY2spICogKEFwcENvbnN0YW50cy50YXJyaWZzWzBdLnBlcmNlbnQgKiBkYXlzICsgMSkpO1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLnBlcmNlbnQgKiAxNDtcbiAgICAgICAgICAgIGxldCBhbm5fcGVyaW9kcyA9IGRheXMgLyAxNDtcbiAgICAgICAgICAgIGxldCBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykpIC8gKE1hdGgucG93KCgxICsgcGVyY2VudCksIGFubl9wZXJpb2RzKSAtIDEpO1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIGFubnVpdHkpO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBmb3JtYXROdW1iZXI6IChudW0pID0+IHtcbiAgICAgICAgcmV0dXJuIG51bS50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZFxcZCkrKFteXFxkXXwkKSkvZywgJyQxICcpO1xuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBIZWxwZXJzOyJdfQ==
