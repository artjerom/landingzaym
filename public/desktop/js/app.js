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
            // Табы 'Вопросы и ответы'
            'click .btn-questions': 'changeQuestionTab',

            // Раскрыть коменты
            'click .update-comment': 'showComments',

            // Слайдер
            'click .arrow--right': 'nextSlide',
            'click .arrow--left': 'prevSlide',

            // Регистрация
            'click .js-btn_register': 'handleRegister',
            // Обратная связь
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

        // -- вопросы и ответы
        changeQuestionTab: function changeQuestionTab(e) {
            $('.btn-questions--active').add(e.target).toggleClass('btn-questions--active');

            var tabId = $(e.target).attr('data-tab');

            $('.js-change-content-quest').removeClass('js-change-content-quest--active');

            $('#QuestTab-' + tabId).addClass('js-change-content-quest--active');
        },

        showComments: function showComments() {
            $('.ico_update-comments').addClass('ico_update-comments--active');
            setTimeout(function () {
                $('.js-row-comment').css('display', 'flex').slideDown(500);
                $('.update-comment').hide();
            }, 1000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjs7QUFTSjtBQUNBLHFDQUF5QixjQVZyQjs7QUFZSjtBQUNBLG1DQUF1QixXQWJuQjtBQWNKLGtDQUFzQixXQWRsQjs7QUFnQko7QUFDQSxzQ0FBMEIsZ0JBakJ0QjtBQWtCSjtBQUNBLHNDQUEwQixnQkFuQnRCOztBQXFCSjtBQUNBLHVDQUEyQixjQXRCdkI7QUF1Qkosb0NBQXdCLGVBdkJwQjtBQXdCSixtQ0FBdUIsY0F4Qm5CO0FBeUJKLDZCQUFpQixhQXpC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S0FBSyxJQUFMLENBQVUsTUFBTSxRQUFoQixDQUFkO0FBQ0E7QUFDQSxZQUFJLE1BQU0sb0JBQWEsU0FBdkIsRUFBa0M7O0FBRTlCLG1CQUFPLEtBQUssSUFBTCxDQUFVLENBQUMsTUFBTSxPQUFQLEtBQW1CLG9CQUFhLE9BQWIsQ0FBcUIsQ0FBckIsRUFBd0IsT0FBeEIsR0FBa0MsSUFBbEMsR0FBeUMsQ0FBNUQsQ0FBVixDQUFQO0FBRUgsU0FKRCxNQUtLO0FBQ0QsZ0JBQUksVUFBVSxvQkFBYSxPQUFiLENBQXFCLENBQXJCLEVBQXdCLE9BQXhCLEdBQWtDLEVBQWhEO0FBQ0EsZ0JBQUksY0FBYyxPQUFPLEVBQXpCO0FBQ0EsZ0JBQUksVUFBVyxVQUFVLEtBQUssR0FBTCxDQUFVLElBQUksT0FBZCxFQUF3QixXQUF4QixDQUFYLElBQW9ELEtBQUssR0FBTCxDQUFVLElBQUksT0FBZCxFQUF3QixXQUF4QixJQUF1QyxDQUEzRixDQUFkOztBQUVBLG1CQUFPLEtBQUssSUFBTCxDQUFVLENBQUMsTUFBTSxPQUFQLElBQWtCLE9BQTVCLENBQVA7QUFFSDtBQUVKLEtBMUZZOztBQTRGYixrQkFBYyxzQkFBQyxHQUFELEVBQVM7QUFDbkIsZUFBTyxJQUFJLFFBQUosR0FBZSxPQUFmLENBQXVCLDZCQUF2QixFQUFzRCxLQUF0RCxDQUFQO0FBQ0g7QUE5RlksQ0FBakIsQyxDQUxBOzs7a0JBc0dlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JWaWV3IGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yVmlldyc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAubG9hbkNhbGN1bGF0b3IgPSBuZXcgTG9hbkNhbGN1bGF0b3JNb2RlbCh7XG5cbiAgICB9KTtcbiAgICBhcHAubG9hbkNhbGN1bGF0b3JWaWV3ID0gbmV3IExvYW5DYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAubG9hbkNhbGN1bGF0b3IsXG4gICAgICAgIGVsOiAnI2xvYW5DYWxjdWxhdG9yJ1xuICAgIH0pO1xuXG4gICAgbGV0IEFwcE1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgZGVmYXVsdHM6IHt9XG4gICAgfSk7XG5cbiAgICBhcHAubW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblxuICAgIHZhciBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2JvZHknLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgLy8g0KHQv9C+0YHQvtCxINCy0YvQtNCw0YfQuFxuICAgICAgICAgICAgJ2NsaWNrIC5tZXRob2QnOiAnY2hhbmdlTWV0aG9kJyxcblxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9C/0L7Rh9C10LzRgyDQvNGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tYWJvdXQnOiAnY2hhbmdlQWJvdXRUYWInLFxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9CS0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLXF1ZXN0aW9ucyc6ICdjaGFuZ2VRdWVzdGlvblRhYicsXG5cbiAgICAgICAgICAgIC8vINCg0LDRgdC60YDRi9GC0Ywg0LrQvtC80LXQvdGC0YtcbiAgICAgICAgICAgICdjbGljayAudXBkYXRlLWNvbW1lbnQnOiAnc2hvd0NvbW1lbnRzJyxcblxuICAgICAgICAgICAgLy8g0KHQu9Cw0LnQtNC10YBcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLXJpZ2h0JzogJ25leHRTbGlkZScsXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1sZWZ0JzogJ3ByZXZTbGlkZScsXG5cbiAgICAgICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y9cbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX3JlZ2lzdGVyJzogJ2hhbmRsZVJlZ2lzdGVyJyxcbiAgICAgICAgICAgIC8vINCe0LHRgNCw0YLQvdCw0Y8g0YHQstGP0LfRjFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fZmVlZGJhY2snOiAnaGFuZGxlRmVlZGJhY2snLFxuXG4gICAgICAgICAgICAvLyDQlNC70Y8g0L/QvtC/0LDQv9C+0LJcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvd19yZWdpc3Rlcic6ICdzaG93UmVnaXN0ZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1wYXlfbWV0aG9kJzogJ3Nob3dQYXlNZXRob2QnLFxuICAgICAgICAgICAgJ2NsaWNrIC5idG5fZmVlZGJhY2snOiAnc2hvd0ZlZWRiYWNrJyxcbiAgICAgICAgICAgICdjaGFuZ2UgLnBvcHVwJzogJ2NoYW5nZVBvcHVzJyxcbiAgICAgICAgICAgICdjbGljayAuanMtY2xvc2VfcG9wdXAnOiAnY2xvc2VQb3B1cCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjdXNlclBob25lJykubWFzayhcIis3ICg5OTkpIDk5OS05OTk5XCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIGNoYW5nZU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLm1ldGhvZCcpLnRvZ2dsZUNsYXNzKCdtZXRob2QtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyAtLSDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INGC0LXQutGB0YJcbiAgICAgICAgICAgICQoJy5qcy1wYXlfbWV0aG9kJykuaHRtbCgkKCcubWV0aG9kLS1hY3RpdmUnKS5maW5kKCcuanMtdGV4dF9tZXRob2QnKS5odG1sKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyICjQtNC+0LvQttC90L4g0YDQsNCx0L7RgtCw0YLRjCDQuCDQvdCwINC00LXRgdC60YLQvtC/0LUpXG4gICAgICAgIGNoYW5nZUFib3V0VGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1hYm91dC0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLWFib3V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI2Fib3V0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLSDQstC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YtcbiAgICAgICAgY2hhbmdlUXVlc3Rpb25UYWI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudC1xdWVzdCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNRdWVzdFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd0NvbW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuaWNvX3VwZGF0ZS1jb21tZW50cycpLmFkZENsYXNzKCdpY29fdXBkYXRlLWNvbW1lbnRzLS1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5qcy1yb3ctY29tbWVudCcpLmNzcygnZGlzcGxheScsICdmbGV4Jykuc2xpZGVEb3duKDUwMCk7XG4gICAgICAgICAgICAgICAgJCgnLnVwZGF0ZS1jb21tZW50JykuaGlkZSgpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KHQu9C10LTRg9GO0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgbmV4dFNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPD0gLTU0MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgLSAyNzAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyDQn9GA0LXQtNGL0LTRg9GJ0LjQuSDRgdC70LDQudC0XG4gICAgICAgIHByZXZTbGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5jb250ZW50LXNsaWRlcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnLjNzIGVhc2Utb3V0JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodmFsdWUpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAtNTQwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSArIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICBoYW5kbGVSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHBob25lID0gJCgnI3VzZXJQaG9uZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3MgPSAkKCcjdXNlclBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICByZXBQYXNzID0gJCgnI3VzZXJSZXBlYXRQYXNzJykudmFsKCk7XG5cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglxuICAgICAgICAgICAgaWYgKHBhc3MgIT09IHJlcFBhc3MpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Ywg0LrQvtGA0L7RgtC60LjQuVxuICAgICAgICAgICAgaWYgKHBhc3MubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINGC0LXQu9C10YTQvtC90LBcbiAgICAgICAgICAgIGlmIChwaG9uZS5sZW5ndGggIT09IDE3KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZXBQYXNzICYmIHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgIHBhc3M6IHBhc3MsXG4gICAgICAgICAgICAgICAgc3VtOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgICAgICBwZXJpb2Q6IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgaGFuZGxlRmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGVtZSA9ICQoJy5qcy1mZWVkLXNlbGVjdF90aGVtZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICQoJy5qcy1mZWVkLWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICQoJy5qcy1mZWVkLW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBlbWFpbCA9PSAwIHx8IG1lc3NhZ2UgPT0gMCA/ICQoJy5qcy1idG5fZmVlZGJhY2snKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKSA6ICQoJy5qcy1idG5fZmVlZGJhY2snKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgLy8g0JfQsNC/0YDQvtGBXG5cbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9mZWVkYmFjaycpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgICAgICAgc2hvd1JlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLXJlZ2lzdGVyJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINCy0YvQsdC+0YDQvtC8INGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBzaG93UGF5TWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLW1ldGhvZCcpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30YzRjlxuICAgICAgICBzaG93RmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tZmVlZGJhY2snKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCX0LDQutGA0YvRgtGMINC/0L7Qv9Cw0L9cbiAgICAgICAgY2xvc2VQb3B1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwJykuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgYXBwLnZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgLy8g0JfQvdCw0YfQtdC90LjRjyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHN1bTogNjAwMCxcbiAgICAgICAgcGVyaW9kOiA2LFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bSc6ICdjaGFuZ2VTdW1SYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXN1bSc6ICdjaGFuZ2VTdW1GaWVsZCcsXG5cbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJzogJ2NoYW5nZVBlcmlvZFJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtcGVyaW9kJzogJ2NoYW5nZVBlcmlvZEZpZWxkJyxcblxuICAgICAgICAvLyDQlNC70Y8g0L/QvtC70LXQuSDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LBcbiAgICAgICAgJ2ZvY3VzIC5yYW5nZV9maWVsZCc6ICdsaWdodEJvcmRlcklucHV0JyxcbiAgICAgICAgJ2ZvY3Vzb3V0IC5yYW5nZV9maWVsZCc6ICdvZmZMaWdodEJvcmRlcklucHV0J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMubW9kZWwuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgIHBlcmlvZCA9IHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C30YPQvdC+0Log0YEg0LLRi9Cx0L7RgNCwINGB0YDQvtC60LBcbiAgICAgICAgICAgIHJhbmdlUGVyaW9kID0gJCgnaW5wdXQjcGVyaW9kJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQtSDRgdGD0LzQvNGLXG4gICAgICAgICAgICBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LUg0YHRgNC+0LrQsFxuICAgICAgICAgICAgZmllbGRQZXJpb2QgPSAkKCdpbnB1dFtuYW1lPXBlcmlvZF0nKTtcblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0YHRg9C80LzRiyDQt9Cw0LnQvNCwXG4gICAgICAgICQoJy5qcy1vdXQtc3VtJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcblxuICAgICAgICAvLyAtLSDQsiDQv9C+0LvQtSBj0YPQvNC80YtcbiAgICAgICAgJChmaWVsZFN1bSkudmFsKHN1bSk7XG4gICAgICAgIC8vIC0tINCyINC/0L7Qu9C1INC/0LXRgNC40L7QtFxuICAgICAgICAkKGZpZWxkUGVyaW9kKS52YWwocGVyaW9kKTtcbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsICQocmFuZ2VQZXJpb2QpLnZhbCgpKTtcblxuICAgICAgICBpZiAoc3VtID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuICAgICAgICAgICAgQXBwSGVscGVycy5wcmludFJlc3VsdHMoKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzQg0L3QtdC00LXQu9C4Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMiknKS5odG1sKCcxMiDQvdC10LTQtdC70YwnKTtcblxuICAgICAgICAgICAgLy8g0JzQtdC90Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZU1vcmVQZXJpb2QoMTIsIDQpO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgncGVyaW9kJykgPT0gNCA/ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5pbmZvLWJhY2sgc3BhbicpLmh0bWwoJ9CS0L7Qt9Cy0YDQsNGJ0LDQtdGC0LUnKTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtX2JhY2snKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHRoaXMubW9kZWwuY2FsY3VsYXRlTG9hblN1bShzdW0sIHBlcmlvZCkpICsgJyDigr0nKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzgg0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgyKScpLmh0bWwoJzMwINC00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0LTQvdC10LknKTtcblxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZU1vcmVQZXJpb2QoMzAsIDgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwLCDQtdGB0LvQuCDRgdGD0LzQvNCwINCx0L7Qu9GM0YjQtVxuICAgIGNoYW5nZVJhbmdlTW9yZVBlcmlvZDogZnVuY3Rpb24gKG1heCwgbWluKSB7XG4gICAgICAgIGxldCByYW5nZVBlcmlvZCA9ICQoJ2lucHV0I3BlcmlvZCcpO1xuXG4gICAgICAgICQocmFuZ2VQZXJpb2QpXG4gICAgICAgICAgICAuYXR0cignbWF4JywgbWF4KVxuICAgICAgICAgICAgLmF0dHIoJ21pbicsIG1pbilcbiAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICgkKHJhbmdlUGVyaW9kKS52YWwoKSAtICQocmFuZ2VQZXJpb2QpLmF0dHIoJ21pbicpKSAqIDEwMCAvICgkKHJhbmdlUGVyaW9kKS5hdHRyKCdtYXgnKSAtICQocmFuZ2VQZXJpb2QpLmF0dHIoJ21pbicpKSArICclIDEwMCUnXG4gICAgICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgdmFsKTtcbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VTdW1GaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDQv9C+0LvQt9GD0L3QvtC6XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJyk7XG5cbiAgICAgICAgdmFyICRpbnB1dCA9ICQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgdmFyIHN1bSA9IHBhcnNlSW50KCRpbnB1dC52YWwoKSkgfHwgNjAwMDtcbiAgICAgICAgbGV0IHBvdyA9IE1hdGguY2VpbChzdW0vMTAwKSAqMTAwO1xuICAgICAgICBpZiggKHBvdyAtIHN1bSkgPiA1MCl7XG4gICAgICAgICAgICBzdW0gPSBwb3cgLSAxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW0gPSBwb3c7XG4gICAgICAgIH1cbiAgICAgICAgJGlucHV0LnZhbChzdW0pO1xuXG4gICAgICAgIGlmIChzdW0gPiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0d29fd2Vla3MnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdvbmNlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdW0nLCAkKCcuanMtc3VtJykudmFsKCkpO1xuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlUGVyaW9kUmFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGxldCBtaW4gPSBlLnRhcmdldC5taW4sXG4gICAgICAgICAgICBtYXggPSBlLnRhcmdldC5tYXgsXG4gICAgICAgICAgICB2YWwgPSBlLnRhcmdldC52YWx1ZTtcblxuICAgICAgICAkKGUudGFyZ2V0KS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHZhbCAtIG1pbikgKiAxMDAgLyAobWF4IC0gbWluKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdwZXJpb2QnLCB2YWwpO1xuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnKTtcblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuanMtcGVyaW9kJykudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgZS50YXJnZXQudmFsdWUpO1xuICAgIH0sXG5cbiAgICBsaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnIzE4YTRkMidcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9mZkxpZ2h0Qm9yZGVySW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICQoZS50YXJnZXQpLm5leHQoJ2xhYmVsJykuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXJDb2xvcic6ICcjYjBiYWM1J1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hbkNhbGN1bGF0b3JWaWV3OyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG52YXIgQXBwQ29uc3RhbnRzID0ge1xuICAgIHRhcnJpZnM6IFt7XG4gICAgICAgIGdyYWRlX2lkOiAxLFxuICAgICAgICBuYW1lOiAn0J7QsdGL0YfQvdGL0LknLFxuICAgICAgICBtaW5fbGltaXQ6IDAsXG4gICAgICAgIG1heF9saW1pdDogMjk5OTksXG4gICAgICAgIG1pbl9zdW06IDE1MDAsXG4gICAgICAgIG1heF9zdW06IDI5OTk5LFxuICAgICAgICBwZXJjZW50OiAwLjAxNSxcbiAgICAgICAgcGVyaW9kX29uY2U6IHtcbiAgICAgICAgICAgIG1pbjogOCxcbiAgICAgICAgICAgIG1heDogMzBcbiAgICAgICAgfSxcbiAgICAgICAgcGVyaW9kX3R3OiB7XG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDBcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQtNC+0YHRgtGD0L/QtdC9INC00LvRjyDQstGB0LXRhSDQt9Cw0LXQvNGJ0LjQutC+0LInXG4gICAgfSwge1xuICAgICAgICBncmFkZV9pZDogMixcbiAgICAgICAgbmFtZTogJ9Cf0YDQtdC80LjRg9C8JyxcbiAgICAgICAgbWluX2xpbWl0OiAzMDAwMCxcbiAgICAgICAgbWF4X2xpbWl0OiA1MDAwMCxcbiAgICAgICAgbWluX3N1bTogMzAwMDAsXG4gICAgICAgIG1heF9zdW06IDUwMDAwLFxuICAgICAgICBwZXJjZW50OiAwLjAwNDksXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDBcbiAgICAgICAgfSxcbiAgICAgICAgcGVyaW9kX3R3OiB7XG4gICAgICAgICAgICBtaW46IDI4LFxuICAgICAgICAgICAgbWF4OiA4NFxuICAgICAgICB9LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ9Cx0YPQtNC10YIg0LTQvtGB0YLRg9C/0LXQvSDQv9C+0YHQu9C1INGB0LLQvtC10LLRgNC10LzQtdC90L3QvtCz0L4g0L/QvtCz0LDRiNC10L3QuNGPINC+0LTQvdC+0LPQviDQt9Cw0LnQvNCwJ1xuICAgIH1dLFxuICAgIGZlZUlzc3VlOiAwLjA1LFxuICAgIGZhY3Rvck1heDogMC4xNSxcbiAgICBmYWN0b3JNaW46IDAuMDEsXG4gICAgc3VtQm9yZGVyOiAzMDAwMCxcbiAgICBGRUVfSVNTVUU6IDAuMDUsIC8vINCa0L7QvNC80LjRgdC40Y8g0LfQsCDQstGL0LTQsNGH0YNcbiAgICBQRVJDRU5UX1NUQU5EQVJUOiAwLjAxNSwgLy8g0KHRgtCw0L3QtNCw0YDRgtC90YvQuSDQv9GA0L7RhtC10L3RgiAo0LIg0LTQtdC90YwpXG4gICAgUEVSQ0VOVF9ERUxBWTogMC4wMTUsIC8vINCf0YDQvtGG0LXQvdGCINCyINGB0LvRg9GH0LDQtSDQv9GA0L7RgdGA0L7Rh9C60LggKNCyINC00LXQvdGMKVxuICAgIEZJTkVfREVMQVk6IDEwMDAuMDAsIC8vINCc0LDQutGB0LjQvNCw0LvRjNC90LDRjyDRgdGD0LzQvNCwINGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0YjRgtGA0LDRhNCwINC30LAg0L/RgNC+0YHRgNC+0YfQutGDXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENvbnN0YW50czsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwOC4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5cbnZhciBBcHBIZWxwZXJzID0ge1xuICAgIC8vIEBUT0RPOiB1cmxcbiAgICBiYXNlVXJsOiAnJyxcblxuICAgIC8vIGFqYXhcbiAgICBhamF4V3JhcHBlcjogKHVybCwgdHlwZSwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHR5cGUgPSB0eXBlIHx8ICdQT1NUJztcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIHN1Y2Nlc3NDYWxsYmFjayA9IHN1Y2Nlc3NDYWxsYmFjayB8fCBmdW5jdGlvbihkYXRhKSB7fTtcbiAgICAgICAgZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJtc2cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVybXNnKTtcbiAgICAgICAgfTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogQXBwSGVscGVycy5iYXNlVXJsICsgdXJsLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmRlY2xpbmVkID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlY2xpbmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JDYWxsYmFja1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g0KTQuNC90LDQu9GM0L3QsNGPINGB0YPQvNC80LBcbiAgICBwcmludFJlc3VsdHM6ICgpID0+IHtcbiAgICAgICAgbGV0IHN1bSA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3N1bScpO1xuICAgICAgICBsZXQgZGF5cyA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpO1xuXG4gICAgICAgIGxldCBwYXltZXRob2Q7XG5cbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHBheW1ldGhvZCA9ICfQoNCw0LfQvtCy0YvQuSDQv9C70LDRgtGR0LYg0L3QsCDRgdGD0LzQvNGDJztcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkYXlzICo9IDc7XG4gICAgICAgICAgICBwYXltZXRob2QgPSAoQXBwSGVscGVycy5lc3RpbWF0ZUFublBlcmlvZHMoZGF5cykgKyAnICcgKyBBcHBIZWxwZXJzLmdldENhc2UoQXBwSGVscGVycy5lc3RpbWF0ZUFublBlcmlvZHMoZGF5cyksICfQv9C70LDRgtGR0LYnLCAn0L/Qu9Cw0YLQtdC20LAnLCAn0L/Qu9Cw0YLQtdC20LXQuScpKTtcbiAgICAgICAgfVxuICAgICAgICBzdW0gPSBBcHBIZWxwZXJzLmVzdGltYXRlUmV0dXJuU3VtKHN1bSwgZGF5cyk7XG5cbiAgICAgICAgJCgnLmluZm8tYmFjayBzcGFuJykuaHRtbChwYXltZXRob2QrJyDQv9C+Jyk7XG5cbiAgICAgICAgJCgnLmpzLW91dC1zdW1fYmFjaycpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIoc3VtKSArICcg4oK9Jyk7XG4gICAgfSxcblxuICAgIGVzdGltYXRlQW5uUGVyaW9kczogKGRheXMpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbChkYXlzIC8gMTQpO1xuICAgIH0sXG5cbiAgICBnZXRDYXNlOiAoX251bWJlciwgX2Nhc2UxLCBfY2FzZTIsIF9jYXNlMykgPT4ge1xuICAgICAgICB2YXIgYmFzZSA9IF9udW1iZXIgLSBNYXRoLmZsb29yKF9udW1iZXIgLyAxMDApICogMTAwO1xuICAgICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICAgIGlmIChiYXNlID4gOSAmJiBiYXNlIDwgMjApIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IF9jYXNlMztcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlbWFpbmRlciA9IF9udW1iZXIgLSBNYXRoLmZsb29yKF9udW1iZXIgLyAxMCkgKiAxMDtcblxuICAgICAgICAgICAgaWYgKDEgPT0gcmVtYWluZGVyKSByZXN1bHQgPSBfY2FzZTE7XG4gICAgICAgICAgICBlbHNlIGlmICgwIDwgcmVtYWluZGVyICYmIDUgPiByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMjtcbiAgICAgICAgICAgIGVsc2UgcmVzdWx0ID0gX2Nhc2UzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVSZXR1cm5TdW06IChzdW0sIGRheXMpID0+IHtcbiAgICAgICAgY29uc3QgZmVlSXNzdWUgPSBBcHBDb25zdGFudHMuZmVlSXNzdWU7XG4gICAgICAgIGNvbnN0IGZhY3Rvck1heCA9IEFwcENvbnN0YW50cy5mYWN0b3JNYXg7XG4gICAgICAgIGNvbnN0IGZhY3Rvck1pbiA9IEFwcENvbnN0YW50cy5mYWN0b3JNaW47XG5cbiAgICAgICAgc3VtID0gTnVtYmVyKHN1bSk7XG4gICAgICAgIGxldCBwYXliYWNrID0gTWF0aC5jZWlsKHN1bSAqIGZlZUlzc3VlKTtcbiAgICAgICAgLy/QoNCw0LfQvtCy0YvQuSDQv9C70LDRgtC10LZcbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiAoQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ucGVyY2VudCAqIGRheXMgKyAxKSk7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDE0O1xuICAgICAgICAgICAgbGV0IGFubl9wZXJpb2RzID0gZGF5cyAvIDE0O1xuICAgICAgICAgICAgbGV0IGFubnVpdHkgPSAocGVyY2VudCAqIE1hdGgucG93KCgxICsgcGVyY2VudCksIGFubl9wZXJpb2RzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpIC0gMSk7XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoKHN1bSArIHBheWJhY2spICogYW5udWl0eSk7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGZvcm1hdE51bWJlcjogKG51bSkgPT4ge1xuICAgICAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJyk7XG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcEhlbHBlcnM7Il19
