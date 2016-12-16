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
        el: 'form.calc'
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

            // Подставляем время
            var date = new Date();
            date.setMinutes(date.getMinutes() + 15);

            var resHour = date.getHours(),
                resMin = date.getMinutes();

            if (date.getHours().toString().length == 1) resHour = '0' + date.getHours();

            if (date.getMinutes().toString().length == 1) resMin = '0' + date.getMinutes();

            var res = resHour + ':' + resMin;

            $('.you-loan .js-loan').html(' ' + res);
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
                $('.js-row-comment').slideDown(500).css({
                    'display': 'flex'
                    // 'justify-content': 'space-between'
                });
                $('.row-comment-hide').slideUp(650);
                $('.update-comment').hide(100);
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

            _helpers2.default.formValidate('jsRegister');

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
            if (phone.length != 17) {
                $('.js-err-val-phone').show();
                $(phone).addClass('err-filed');
            } else {
                $('.js-err-val-phone').hide();
                $(phone).removeClass('err-filed');
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

            _helpers2.default.formValidate('jsFeedback');

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

    sumRanges: $('input.js-slider--sum'),

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

        this.sumRanges.bind('change', function () {
            $(this.sumRanges).val(app.loanCalculator.get('sum'));
        });
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

        if (sum > _constants2.default.sumBorder) {
            _helpers2.default.printResults();
            $('.js-range_info-period span:nth-child(1)').html('4 недели');

            $('.js-range_info-period span:nth-child(2)').html('12 недель');

            // Меняем значение ползунка
            this.changeRangeSlider('period', 12, 4);

            this.changePeriodRange();

            this.model.get('period') == 4 ? $('label[for=focusInpPeriod]').html('недели') : $('label[for=focusInpPeriod]').html('недель');
        } else {
            $('.info-back span').html('Возвращаете');
            $('.js-out-sum_back').html(_helpers2.default.formatNumber(this.model.calculateLoanSum(sum, period)) + ' ₽');
            $('.js-range_info-period span:nth-child(1)').html('8 дней');
            $('.js-range_info-period span:nth-child(2)').html('30 дней');
            $('label[for=focusInpPeriod]').html('дней');
            this.changeRangeSlider('period', 30, 8);
            this.model.set('period', $(rangePeriod).val());
        }
    },

    // Изменение ползунка (type: sum || period)
    changeRangeSlider: function changeRangeSlider(type, max, min) {
        var range = $('input.js-slider--' + type);

        $(range).attr('max', max).attr('min', min).css({
            'backgroundSize': ($(range).val() - $(range).attr('min')) * 100 / ($(range).attr('max') - $(range).attr('min')) + '% 100%'
        });

        this.model.set(type, range.val());
    },

    // Выбор суммы при помощи ползунка
    changeSumRange: function changeSumRange() {
        var min = $(this.sumRanges).attr('min'),
            max = $(this.sumRanges).attr('max');

        this.changeRangeSlider('sum', max, min);
    },

    // -- Выбор суммы при помощи поля
    changeSumField: function changeSumField(e) {
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

        this.model.set('sum', $('.js-sum').val());

        this.changeRangeSlider('sum', $(this.sumRanges).attr('max'), $(this.sumRanges).attr('min'));
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function changePeriodRange() {

        var min = $('input[type=range]#period').attr('min'),
            max = $('input[type=range]#period').attr('max');

        this.changeRangeSlider('period', max, min);
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

        this.model.set('period', e.target.value);

        $('.js-period').val(this.model.get('period'));
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
    },

    // Валидация форм
    formValidate: function formValidate(formId) {
        var form = '#' + formId;
        var field = $(form + ' [data-type=field]');
        var err = $(form + ' .block-err');
        var btn = $(form + ' a.ab_button');

        for (var i = 0; i < field.length; i++) {
            if ($(field[i]).val() == 0) {
                $(field[i]).addClass('err-field');
            } else {
                $(field[i]).removeClass('err-field');
            }
        }

        if ($(form + ' .err-field').length == 0) {
            $(btn).removeClass('is-disabled');
            $(err).hide();
        } else {
            $(btn).addClass('is-disabled');
            $(err).show();
        }
    }
}; /**
    * Created by fred on 08.12.16.
    */
exports.default = AppHelpers;

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjs7QUFTSjtBQUNBLHFDQUF5QixjQVZyQjs7QUFZSjtBQUNBLG1DQUF1QixXQWJuQjtBQWNKLGtDQUFzQixXQWRsQjs7QUFnQko7QUFDQSxzQ0FBMEIsZ0JBakJ0QjtBQWtCSjtBQUNBLHNDQUEwQixnQkFuQnRCOztBQXFCSjtBQUNBLHVDQUEyQixjQXRCdkI7QUF1Qkosb0NBQXdCLGVBdkJwQjtBQXdCSixtQ0FBdUIsY0F4Qm5CO0FBeUJKLDZCQUFpQixhQXpC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QVUsQ0FBQyxNQUFNLE9BQVAsSUFBa0IsT0FBNUIsQ0FBUDtBQUVIO0FBRUosS0F6Rlk7O0FBMkZiLGtCQUFjLHNCQUFDLEdBQUQsRUFBUztBQUNuQixlQUFPLElBQUksUUFBSixHQUFlLE9BQWYsQ0FBdUIsNkJBQXZCLEVBQXNELEtBQXRELENBQVA7QUFDSCxLQTdGWTs7QUErRmI7QUFDQSxrQkFBYyxzQkFBVSxNQUFWLEVBQWtCO0FBQzVCLFlBQUksT0FBTyxNQUFNLE1BQWpCO0FBQ0EsWUFBSSxRQUFRLEVBQUUsT0FBTyxvQkFBVCxDQUFaO0FBQ0EsWUFBSSxNQUFNLEVBQUUsT0FBTyxhQUFULENBQVY7QUFDQSxZQUFJLE1BQU0sRUFBRSxPQUFPLGNBQVQsQ0FBVjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNuQyxnQkFBSSxFQUFFLE1BQU0sQ0FBTixDQUFGLEVBQVksR0FBWixNQUFxQixDQUF6QixFQUE0QjtBQUN4QixrQkFBRSxNQUFNLENBQU4sQ0FBRixFQUFZLFFBQVosQ0FBcUIsV0FBckI7QUFDSCxhQUZELE1BRU87QUFDSCxrQkFBRSxNQUFNLENBQU4sQ0FBRixFQUFZLFdBQVosQ0FBd0IsV0FBeEI7QUFDSDtBQUNKOztBQUVELFlBQUksRUFBRSxPQUFPLGFBQVQsRUFBd0IsTUFBeEIsSUFBa0MsQ0FBdEMsRUFBeUM7QUFDckMsY0FBRSxHQUFGLEVBQU8sV0FBUCxDQUFtQixhQUFuQjtBQUNBLGNBQUUsR0FBRixFQUFPLElBQVA7QUFDSCxTQUhELE1BR087QUFDSCxjQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGFBQWhCO0FBQ0EsY0FBRSxHQUFGLEVBQU8sSUFBUDtBQUNIO0FBRUo7QUF0SFksQ0FBakIsQyxDQUxBOzs7a0JBOEhlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JWaWV3IGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yVmlldyc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAubG9hbkNhbGN1bGF0b3IgPSBuZXcgTG9hbkNhbGN1bGF0b3JNb2RlbCh7XG5cbiAgICB9KTtcbiAgICBhcHAubG9hbkNhbGN1bGF0b3JWaWV3ID0gbmV3IExvYW5DYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAubG9hbkNhbGN1bGF0b3IsXG4gICAgICAgIGVsOiAnZm9ybS5jYWxjJ1xuICAgIH0pO1xuXG4gICAgbGV0IEFwcE1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgZGVmYXVsdHM6IHt9XG4gICAgfSk7XG5cbiAgICBhcHAubW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblxuICAgIHZhciBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2JvZHknLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgLy8g0KHQv9C+0YHQvtCxINCy0YvQtNCw0YfQuFxuICAgICAgICAgICAgJ2NsaWNrIC5tZXRob2QnOiAnY2hhbmdlTWV0aG9kJyxcblxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9C/0L7Rh9C10LzRgyDQvNGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tYWJvdXQnOiAnY2hhbmdlQWJvdXRUYWInLFxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9CS0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLXF1ZXN0aW9ucyc6ICdjaGFuZ2VRdWVzdGlvblRhYicsXG5cbiAgICAgICAgICAgIC8vINCg0LDRgdC60YDRi9GC0Ywg0LrQvtC80LXQvdGC0YtcbiAgICAgICAgICAgICdjbGljayAudXBkYXRlLWNvbW1lbnQnOiAnc2hvd0NvbW1lbnRzJyxcblxuICAgICAgICAgICAgLy8g0KHQu9Cw0LnQtNC10YBcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLXJpZ2h0JzogJ25leHRTbGlkZScsXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1sZWZ0JzogJ3ByZXZTbGlkZScsXG5cbiAgICAgICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y9cbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX3JlZ2lzdGVyJzogJ2hhbmRsZVJlZ2lzdGVyJyxcbiAgICAgICAgICAgIC8vINCe0LHRgNCw0YLQvdCw0Y8g0YHQstGP0LfRjFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fZmVlZGJhY2snOiAnaGFuZGxlRmVlZGJhY2snLFxuXG4gICAgICAgICAgICAvLyDQlNC70Y8g0L/QvtC/0LDQv9C+0LJcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvd19yZWdpc3Rlcic6ICdzaG93UmVnaXN0ZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1wYXlfbWV0aG9kJzogJ3Nob3dQYXlNZXRob2QnLFxuICAgICAgICAgICAgJ2NsaWNrIC5idG5fZmVlZGJhY2snOiAnc2hvd0ZlZWRiYWNrJyxcbiAgICAgICAgICAgICdjaGFuZ2UgLnBvcHVwJzogJ2NoYW5nZVBvcHVzJyxcbiAgICAgICAgICAgICdjbGljayAuanMtY2xvc2VfcG9wdXAnOiAnY2xvc2VQb3B1cCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjdXNlclBob25lJykubWFzayhcIis3ICg5OTkpIDk5OS05OTk5XCIpO1xuXG4gICAgICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INCy0YDQtdC80Y9cbiAgICAgICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSArIDE1KTtcblxuICAgICAgICAgICAgbGV0IHJlc0hvdXIgPSBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgICAgICAgcmVzTWluID0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKS5sZW5ndGggPT0gMSkgcmVzSG91ciA9ICcwJyArIGRhdGUuZ2V0SG91cnMoKTtcblxuICAgICAgICAgICAgaWYgKGRhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkubGVuZ3RoID09IDEpIHJlc01pbiA9ICcwJyArIGRhdGUuZ2V0TWludXRlcygpO1xuXG4gICAgICAgICAgICBsZXQgcmVzID0gcmVzSG91ciArICc6JyArIHJlc01pbjtcblxuICAgICAgICAgICAgJCgnLnlvdS1sb2FuIC5qcy1sb2FuJykuaHRtbCgnICcgKyByZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIGNoYW5nZU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLm1ldGhvZCcpLnRvZ2dsZUNsYXNzKCdtZXRob2QtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyAtLSDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INGC0LXQutGB0YJcbiAgICAgICAgICAgICQoJy5qcy1wYXlfbWV0aG9kJykuaHRtbCgkKCcubWV0aG9kLS1hY3RpdmUnKS5maW5kKCcuanMtdGV4dF9tZXRob2QnKS5odG1sKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyICjQtNC+0LvQttC90L4g0YDQsNCx0L7RgtCw0YLRjCDQuCDQvdCwINC00LXRgdC60YLQvtC/0LUpXG4gICAgICAgIGNoYW5nZUFib3V0VGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1hYm91dC0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLWFib3V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI2Fib3V0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLSDQstC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YtcbiAgICAgICAgY2hhbmdlUXVlc3Rpb25UYWI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudC1xdWVzdCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNRdWVzdFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd0NvbW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuaWNvX3VwZGF0ZS1jb21tZW50cycpLmFkZENsYXNzKCdpY29fdXBkYXRlLWNvbW1lbnRzLS1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5qcy1yb3ctY29tbWVudCcpLnNsaWRlRG93big1MDApLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2ZsZXgnXG4gICAgICAgICAgICAgICAgICAgIC8vICdqdXN0aWZ5LWNvbnRlbnQnOiAnc3BhY2UtYmV0d2VlbidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKCcucm93LWNvbW1lbnQtaGlkZScpLnNsaWRlVXAoNjUwKTtcbiAgICAgICAgICAgICAgICAkKCcudXBkYXRlLWNvbW1lbnQnKS5oaWRlKDEwMCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQodC70LXQtNGD0Y7RidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBuZXh0U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA8PSAtNTQwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSAtIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vINCf0YDQtdC00YvQtNGD0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgcHJldlNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IC01NDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpICsgMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgIGhhbmRsZVJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgcGhvbmUgPSAkKCcjdXNlclBob25lJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzcyA9ICQoJyN1c2VyUGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHJlcFBhc3MgPSAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKTtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2pzUmVnaXN0ZXInKTtcblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCXG4gICAgICAgICAgICBpZiAocGFzcyAhPT0gcmVwUGFzcykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0LDRgNC+0LvRjCDQutC+0YDQvtGC0LrQuNC5XG4gICAgICAgICAgICBpZiAocGFzcy5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFzcy5sZW5ndGggPj0gNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0YLQtdC70LXRhNC+0L3QsFxuICAgICAgICAgICAgaWYgKHBob25lLmxlbmd0aCAhPSAxNykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICQocGhvbmUpLmFkZENsYXNzKCdlcnItZmlsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJChwaG9uZSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZXBQYXNzICYmIHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgIHBhc3M6IHBhc3MsXG4gICAgICAgICAgICAgICAgc3VtOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgICAgICBwZXJpb2Q6IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgaGFuZGxlRmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGVtZSA9ICQoJy5qcy1mZWVkLXNlbGVjdF90aGVtZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICQoJy5qcy1mZWVkLWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICQoJy5qcy1mZWVkLW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgnanNGZWVkYmFjaycpO1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcblxuICAgICAgICAgICAgaWYgKCEkKCcuanMtYnRuX2ZlZWRiYWNrJykuaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL2ZlZWRiYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2NlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tcmVnaXN0ZXInKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0LLRi9Cx0L7RgNC+0Lwg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIHNob3dQYXlNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tbWV0aG9kJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfRjNGOXG4gICAgICAgIHNob3dGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JfQsNC60YDRi9GC0Ywg0L/QvtC/0LDQv1xuICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgc3VtUmFuZ2VzOiAkKCdpbnB1dC5qcy1zbGlkZXItLXN1bScpLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bSc6ICdjaGFuZ2VTdW1SYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXN1bSc6ICdjaGFuZ2VTdW1GaWVsZCcsXG5cbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJzogJ2NoYW5nZVBlcmlvZFJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtcGVyaW9kJzogJ2NoYW5nZVBlcmlvZEZpZWxkJyxcblxuICAgICAgICAvLyDQlNC70Y8g0L/QvtC70LXQuSDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LBcbiAgICAgICAgJ2ZvY3VzIC5yYW5nZV9maWVsZCc6ICdsaWdodEJvcmRlcklucHV0JyxcbiAgICAgICAgJ2ZvY3Vzb3V0IC5yYW5nZV9maWVsZCc6ICdvZmZMaWdodEJvcmRlcklucHV0J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3VtUmFuZ2VzLmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgJCh0aGlzLnN1bVJhbmdlcykudmFsKGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3N1bScpKTtcbiAgICAgICAgfSk7XG5cbiAgICB9LFxuXG4gICAgY2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLm1vZGVsLmdldCgnc3VtJyksXG4gICAgICAgICAgICBwZXJpb2QgPSB0aGlzLm1vZGVsLmdldCgncGVyaW9kJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQt9GD0L3QvtC6INGBINCy0YvQsdC+0YDQsCDRgdGA0L7QutCwXG4gICAgICAgICAgICByYW5nZVBlcmlvZCA9ICQoJ2lucHV0I3BlcmlvZCcpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LUg0YHRg9C80LzRi1xuICAgICAgICAgICAgZmllbGRTdW0gPSAkKCdpbnB1dFtuYW1lPXN1bV0nKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C1INGB0YDQvtC60LBcbiAgICAgICAgICAgIGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICAgICAgLy8g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDQt9C90LDRh9C10L3QuNC1INGB0YPQvNC80Ysg0LfQsNC50LzQsFxuICAgICAgICAkKCcuanMtb3V0LXN1bScpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIoc3VtKSArICcg4oK9Jyk7XG5cbiAgICAgICAgLy8gLS0g0LIg0L/QvtC70LUgY9GD0LzQvNGLXG4gICAgICAgICQoZmllbGRTdW0pLnZhbChzdW0pO1xuICAgICAgICAvLyAtLSDQsiDQv9C+0LvQtSDQv9C10YDQuNC+0LRcbiAgICAgICAgJChmaWVsZFBlcmlvZCkudmFsKHBlcmlvZCk7XG5cbiAgICAgICAgaWYgKHN1bSA+IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHtcbiAgICAgICAgICAgIEFwcEhlbHBlcnMucHJpbnRSZXN1bHRzKCk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMSknKS5odG1sKCc0INC90LXQtNC10LvQuCcpO1xuXG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMiknKS5odG1sKCcxMiDQvdC10LTQtdC70YwnKTtcblxuICAgICAgICAgICAgLy8g0JzQtdC90Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgMTIsIDQpO1xuXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBlcmlvZFJhbmdlKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSA9PSA0ID8gJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kXScpLmh0bWwoJ9C90LXQtNC10LvQuCcpIDogJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kXScpLmh0bWwoJ9C90LXQtNC10LvRjCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLmluZm8tYmFjayBzcGFuJykuaHRtbCgn0JLQvtC30LLRgNCw0YnQsNC10YLQtScpO1xuICAgICAgICAgICAgJCgnLmpzLW91dC1zdW1fYmFjaycpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIodGhpcy5tb2RlbC5jYWxjdWxhdGVMb2FuU3VtKHN1bSwgcGVyaW9kKSkgKyAnIOKCvScpO1xuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDEpJykuaHRtbCgnOCDQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDIpJykuaHRtbCgnMzAg0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQtNC90LXQuScpO1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgMzAsIDgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsICQocmFuZ2VQZXJpb2QpLnZhbCgpKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwICh0eXBlOiBzdW0gfHwgcGVyaW9kKVxuICAgIGNoYW5nZVJhbmdlU2xpZGVyOiBmdW5jdGlvbiAodHlwZSwgbWF4LCBtaW4pIHtcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXQuanMtc2xpZGVyLS0nICsgdHlwZSk7XG5cbiAgICAgICAgJChyYW5nZSlcbiAgICAgICAgICAgIC5hdHRyKCdtYXgnLCBtYXgpXG4gICAgICAgICAgICAuYXR0cignbWluJywgbWluKVxuICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKCQocmFuZ2UpLnZhbCgpIC0gJChyYW5nZSkuYXR0cignbWluJykpICogMTAwIC8gKCQocmFuZ2UpLmF0dHIoJ21heCcpIC0gJChyYW5nZSkuYXR0cignbWluJykpICsgJyUgMTAwJSdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KHR5cGUsIHJhbmdlLnZhbCgpKTtcblxuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlU3VtUmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1pbiA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgbWF4ID0gJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWF4Jyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgbWF4LCBtaW4pO1xuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVN1bUZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bScpO1xuXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIHZhciBzdW0gPSBwYXJzZUludCgkaW5wdXQudmFsKCkpIHx8IDYwMDA7XG4gICAgICAgIGxldCBwb3cgPSBNYXRoLmNlaWwoc3VtLzEwMCkgKjEwMDtcbiAgICAgICAgaWYoIChwb3cgLSBzdW0pID4gNTApe1xuICAgICAgICAgICAgc3VtID0gcG93IC0gMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VtID0gcG93O1xuICAgICAgICB9XG4gICAgICAgICRpbnB1dC52YWwoc3VtKTtcblxuICAgICAgICBpZiAoc3VtID4gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3N1bScsIEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0pO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIHN1bTogQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSxcbiAgICAgICAgICAgICAgICB0eXBlOiAndHdvX3dlZWtzJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWluX3N1bSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIHN1bTogQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWluX3N1bSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnb25jZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgJCgnLmpzLXN1bScpLnZhbCgpKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdzdW0nLCAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWluJykpO1xuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlUGVyaW9kUmFuZ2U6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBsZXQgbWluID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0jcGVyaW9kJykuYXR0cignbWluJyksXG4gICAgICAgICAgICBtYXggPSAkKCdpbnB1dFt0eXBlPXJhbmdlXSNwZXJpb2QnKS5hdHRyKCdtYXgnKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdwZXJpb2QnLCBtYXgsIG1pbik7XG5cbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VQZXJpb2RGaWVsZDogZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnKTtcblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmFuZ2UudmFsKCkgPiAxMDAwMCkge1xuICAgICAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQocmdiKDI1NCwgMTUwLCAzOSksIHJnYigyNTQsIDE1MCwgMzkpKSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsIGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAkKCcuanMtcGVyaW9kJykudmFsKHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSk7XG4gICAgfSxcblxuICAgIGxpZ2h0Qm9yZGVySW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICQoZS50YXJnZXQpLm5leHQoJ2xhYmVsJykuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXJDb2xvcic6ICcjMThhNGQyJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgb2ZmTGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyNiMGJhYzUnXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvclZpZXc7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cbnZhciBBcHBDb25zdGFudHMgPSB7XG4gICAgdGFycmlmczogW3tcbiAgICAgICAgZ3JhZGVfaWQ6IDEsXG4gICAgICAgIG5hbWU6ICfQntCx0YvRh9C90YvQuScsXG4gICAgICAgIG1pbl9saW1pdDogMCxcbiAgICAgICAgbWF4X2xpbWl0OiAyOTk5OSxcbiAgICAgICAgbWluX3N1bTogMTUwMCxcbiAgICAgICAgbWF4X3N1bTogMjk5OTksXG4gICAgICAgIHBlcmNlbnQ6IDAuMDE1LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiA4LFxuICAgICAgICAgICAgbWF4OiAzMFxuICAgICAgICB9LFxuICAgICAgICBwZXJpb2RfdHc6IHtcbiAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgIG1heDogMFxuICAgICAgICB9LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ9C00L7RgdGC0YPQv9C10L0g0LTQu9GPINCy0YHQtdGFINC30LDQtdC80YnQuNC60L7QsidcbiAgICB9LCB7XG4gICAgICAgIGdyYWRlX2lkOiAyLFxuICAgICAgICBuYW1lOiAn0J/RgNC10LzQuNGD0LwnLFxuICAgICAgICBtaW5fbGltaXQ6IDMwMDAwLFxuICAgICAgICBtYXhfbGltaXQ6IDUwMDAwLFxuICAgICAgICBtaW5fc3VtOiAzMDAwMCxcbiAgICAgICAgbWF4X3N1bTogNTAwMDAsXG4gICAgICAgIHBlcmNlbnQ6IDAuMDA0OSxcbiAgICAgICAgcGVyaW9kX29uY2U6IHtcbiAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgIG1heDogMFxuICAgICAgICB9LFxuICAgICAgICBwZXJpb2RfdHc6IHtcbiAgICAgICAgICAgIG1pbjogMjgsXG4gICAgICAgICAgICBtYXg6IDg0XG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LHRg9C00LXRgiDQtNC+0YHRgtGD0L/QtdC9INC/0L7RgdC70LUg0YHQstC+0LXQstGA0LXQvNC10L3QvdC+0LPQviDQv9C+0LPQsNGI0LXQvdC40Y8g0L7QtNC90L7Qs9C+INC30LDQudC80LAnXG4gICAgfV0sXG4gICAgZmVlSXNzdWU6IDAuMDUsXG4gICAgZmFjdG9yTWF4OiAwLjE1LFxuICAgIGZhY3Rvck1pbjogMC4wMSxcbiAgICBzdW1Cb3JkZXI6IDMwMDAwLFxuICAgIEZFRV9JU1NVRTogMC4wNSwgLy8g0JrQvtC80LzQuNGB0LjRjyDQt9CwINCy0YvQtNCw0YfRg1xuICAgIFBFUkNFTlRfU1RBTkRBUlQ6IDAuMDE1LCAvLyDQodGC0LDQvdC00LDRgNGC0L3Ri9C5INC/0YDQvtGG0LXQvdGCICjQsiDQtNC10L3RjClcbiAgICBQRVJDRU5UX0RFTEFZOiAwLjAxNSwgLy8g0J/RgNC+0YbQtdC90YIg0LIg0YHQu9GD0YfQsNC1INC/0YDQvtGB0YDQvtGH0LrQuCAo0LIg0LTQtdC90YwpXG4gICAgRklORV9ERUxBWTogMTAwMC4wMCwgLy8g0JzQsNC60YHQuNC80LDQu9GM0L3QsNGPINGB0YPQvNC80LAg0YTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LPQviDRiNGC0YDQsNGE0LAg0LfQsCDQv9GA0L7RgdGA0L7Rh9C60YNcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA4LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzJztcblxudmFyIEFwcEhlbHBlcnMgPSB7XG4gICAgLy8gQFRPRE86IHVybFxuICAgIGJhc2VVcmw6ICcnLFxuXG4gICAgLy8gYWpheFxuICAgIGFqYXhXcmFwcGVyOiAodXJsLCB0eXBlLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spID0+IHtcbiAgICAgICAgdHlwZSA9IHR5cGUgfHwgJ1BPU1QnO1xuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgc3VjY2Vzc0NhbGxiYWNrID0gc3VjY2Vzc0NhbGxiYWNrIHx8IGZ1bmN0aW9uKGRhdGEpIHt9O1xuICAgICAgICBlcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjayB8fCBmdW5jdGlvbihlcm1zZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJtc2cpO1xuICAgICAgICB9O1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBBcHBIZWxwZXJzLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZGVjbGluZWQgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVjbGluZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvckNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDQpNC40L3QsNC70YzQvdCw0Y8g0YHRg9C80LzQsFxuICAgIHByaW50UmVzdWx0czogKCkgPT4ge1xuICAgICAgICBsZXQgc3VtID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyk7XG4gICAgICAgIGxldCBkYXlzID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgbGV0IHBheW1ldGhvZDtcblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikgcGF5bWV0aG9kID0gJ9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0ZHQtiDQvdCwINGB0YPQvNC80YMnO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheXMgKj0gNztcbiAgICAgICAgICAgIHBheW1ldGhvZCA9IChBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSArICcgJyArIEFwcEhlbHBlcnMuZ2V0Q2FzZShBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSwgJ9C/0LvQsNGC0ZHQticsICfQv9C70LDRgtC10LbQsCcsICfQv9C70LDRgtC10LbQtdC5JykpO1xuICAgICAgICB9XG4gICAgICAgIHN1bSA9IEFwcEhlbHBlcnMuZXN0aW1hdGVSZXR1cm5TdW0oc3VtLCBkYXlzKTtcblxuICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKHBheW1ldGhvZCsnINC/0L4nKTtcblxuICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVBbm5QZXJpb2RzOiAoZGF5cykgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGRheXMgLyAxNCk7XG4gICAgfSxcblxuICAgIGdldENhc2U6IChfbnVtYmVyLCBfY2FzZTEsIF9jYXNlMiwgX2Nhc2UzKSA9PiB7XG4gICAgICAgIHZhciBiYXNlID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwMCkgKiAxMDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGJhc2UgPiA5ICYmIGJhc2UgPCAyMCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gX2Nhc2UzO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVtYWluZGVyID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwKSAqIDEwO1xuXG4gICAgICAgICAgICBpZiAoMSA9PSByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKDAgPCByZW1haW5kZXIgJiYgNSA+IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UyO1xuICAgICAgICAgICAgZWxzZSByZXN1bHQgPSBfY2FzZTM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZVJldHVyblN1bTogKHN1bSwgZGF5cykgPT4ge1xuICAgICAgICBjb25zdCBmZWVJc3N1ZSA9IEFwcENvbnN0YW50cy5mZWVJc3N1ZTtcbiAgICAgICAgY29uc3QgZmFjdG9yTWF4ID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1heDtcbiAgICAgICAgY29uc3QgZmFjdG9yTWluID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1pbjtcblxuICAgICAgICBzdW0gPSBOdW1iZXIoc3VtKTtcbiAgICAgICAgbGV0IHBheWJhY2sgPSBNYXRoLmNlaWwoc3VtICogZmVlSXNzdWUpO1xuICAgICAgICAvL9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0LXQtlxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogZGF5cyArIDEpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogMTQ7XG4gICAgICAgICAgICBsZXQgYW5uX3BlcmlvZHMgPSBkYXlzIC8gMTQ7XG4gICAgICAgICAgICBsZXQgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykgLSAxKTtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiBhbm51aXR5KTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGE0L7RgNC8XG4gICAgZm9ybVZhbGlkYXRlOiBmdW5jdGlvbiAoZm9ybUlkKSB7XG4gICAgICAgIGxldCBmb3JtID0gJyMnICsgZm9ybUlkO1xuICAgICAgICBsZXQgZmllbGQgPSAkKGZvcm0gKyAnIFtkYXRhLXR5cGU9ZmllbGRdJyk7XG4gICAgICAgIGxldCBlcnIgPSAkKGZvcm0gKyAnIC5ibG9jay1lcnInKTtcbiAgICAgICAgbGV0IGJ0biA9ICQoZm9ybSArICcgYS5hYl9idXR0b24nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChmaWVsZFtpXSkudmFsKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoZmllbGRbaV0pLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChmaWVsZFtpXSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoZm9ybSArICcgLmVyci1maWVsZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAkKGJ0bikucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAkKGVycikuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChidG4pLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcEhlbHBlcnM7Il19
