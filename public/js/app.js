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
            'click .js_tab-quest-get': 'changeQuestionTabGetZaym',

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

            console.log(tabId);
            console.log(e.target);

            $('.js-change-content-quest').removeClass('js-change-content-quest--active');

            $('#QuestTab-' + tabId).addClass('js-change-content-quest--active');
        },

        // ---- вопросы и ответы (Получение займа)
        changeQuestionTabGetZaym: function changeQuestionTabGetZaym(e) {
            $('.js_tab-quest-get--active').add(e.target).toggleClass('js_tab-quest-get--active');

            var tabId = $(e.target).attr('data-tab');

            console.log(tabId);
            console.log(e.target);

            $('.js_get-zaym-tab-content').removeClass('js_get-zaym-tab-content--active');

            $('#QuestGetZaymTab-' + tabId).addClass('js_get-zaym-tab-content--active');
        },

        showComments: function showComments() {
            $('.ico_update-comments').addClass('ico_update-comments--active');
            setTimeout(function () {
                $('.js-row-comment').slideDown(500).css({
                    'display': 'flex'
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
                rePass = $('#userRepeatPass').val(),
                period = app.loanCalculator.get('period');

            _helpers2.default.formValidate('jsRegister');

            // Если пароли не совпадают
            if (pass !== rePass) {
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
            } else {
                $('.js-err-val-phone').hide();
            }

            if (phone.length === 17 && pass === rePass && pass.length >= 6) {
                $('.js-btn_register').removeClass('is-disabled');
            } else {
                $('.js-btn_register').addClass('is-disabled');
            }

            var data = {
                phone: phone,
                password: pass,
                rePassword: rePass,
                sum: app.loanCalculator.get('sum'),
                period: app.loanCalculator.get('sum') > _constants2.default.sumBorder ? period * 7 : period
            };

            // Запрос
            if (!$('.js-btn_register').hasClass('is-disabled')) {
                _helpers2.default.ajaxWrapper('/register', 'POST', JSON.stringify(data), function (data) {
                    if (data.status === 'success') {
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
    periodRanges: $('input.js-slider--period'),

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
        // this.template = $('#templateCalc').html();
        this.template = _.template($('#templateCalc').html());

        this.model.on('change', this.change, this);

        this.render();
    },

    render: function render() {
        var rendered = this.template(this.model.attributes);
        this.$el.html(rendered);

        this.change();

        return this;
    },

    change: function change() {
        var sum = this.model.get('sum'),
            period = this.model.get('period'),

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

            this.model.get('period') == 4 ? $('label[for=focusInpPeriod]').html('недели') : $('label[for=focusInpPeriod]').html('недель');
            this.model.get('period') == 4 ? $('label[for=focusInpPeriod2]').html('недели') : $('label[for=focusInpPeriod2]').html('недель');
        } else {
            $('.info-back span').html('Возвращаете');
            $('.js-out-sum_back').html(_helpers2.default.formatNumber(this.model.calculateLoanSum(sum, period)) + ' ₽');
            $('.js-range_info-period span:nth-child(1)').html('8 дней');
            $('.js-range_info-period span:nth-child(2)').html('30 дней');
            $('label[for=focusInpPeriod]').html('дней');
            $('label[for=focusInpPeriod2]').html('дней');
            this.changeRangeSlider('period', 30, 8);
        }

        // $(this.sumRanges).val(sum);
        // $(this.periodRanges).val(period);
    },

    // Изменение ползунка (type: sum || period)
    changeRangeSlider: function changeRangeSlider(type, max, min) {
        var range = $('input.js-slider--' + type);

        for (var i = 0; i < range.length; i++) {
            $(range[i]).attr('max', max).attr('min', min).css({
                'backgroundSize': ($(range[i]).val() - $(range[i]).attr('min')) * 100 / ($(range[i]).attr('max') - $(range[i]).attr('min')) + '% 100%'
            });

            this.model.set(type, $(range[i]).val());
        }
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

        this.changeRangeSlider('sum', $(this.sumRanges).attr('max'), $(this.sumRanges).attr('min'));
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function changePeriodRange() {
        var min = $(this.periodRanges).attr('min'),
            max = $(this.periodRanges).attr('max');

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
                return successCallback(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjtBQVFKLHVDQUEyQiwwQkFSdkI7O0FBVUo7QUFDQSxxQ0FBeUIsY0FYckI7O0FBYUo7QUFDQSxtQ0FBdUIsV0FkbkI7QUFlSixrQ0FBc0IsV0FmbEI7O0FBaUJKO0FBQ0Esc0NBQTBCLGdCQWxCdEI7QUFtQko7QUFDQSxzQ0FBMEIsZ0JBcEJ0Qjs7QUFzQko7QUFDQSx1Q0FBMkIsY0F2QnZCO0FBd0JKLG9DQUF3QixlQXhCcEI7QUF5QkosbUNBQXVCLGNBekJu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QSxZQUFJLE1BQU0sRUFBRSxPQUFPLGFBQVQsQ0FBVjtBQUNBLFlBQUksTUFBTSxFQUFFLE9BQU8sY0FBVCxDQUFWOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ25DLGdCQUFJLEVBQUUsTUFBTSxDQUFOLENBQUYsRUFBWSxHQUFaLE1BQXFCLENBQXpCLEVBQTRCO0FBQ3hCLGtCQUFFLE1BQU0sQ0FBTixDQUFGLEVBQVksUUFBWixDQUFxQixXQUFyQjtBQUNILGFBRkQsTUFFTztBQUNILGtCQUFFLE1BQU0sQ0FBTixDQUFGLEVBQVksV0FBWixDQUF3QixXQUF4QjtBQUNIO0FBQ0o7O0FBRUQsWUFBSSxFQUFFLE9BQU8sYUFBVCxFQUF3QixNQUF4QixJQUFrQyxDQUF0QyxFQUF5QztBQUNyQyxjQUFFLEdBQUYsRUFBTyxXQUFQLENBQW1CLGFBQW5CO0FBQ0EsY0FBRSxHQUFGLEVBQU8sSUFBUDtBQUNILFNBSEQsTUFHTztBQUNILGNBQUUsR0FBRixFQUFPLFFBQVAsQ0FBZ0IsYUFBaEI7QUFDQSxjQUFFLEdBQUYsRUFBTyxJQUFQO0FBQ0g7QUFFSjtBQWxIWSxDQUFqQixDLENBTEE7OztrQkEwSGUsVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JNb2RlbCBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvclZpZXcgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JWaWV3JztcblxuJChmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LmFwcCA9IHt9O1xuXG4gICAgLy8g0JrQsNC70YzQutGD0LvRj9GC0L7RgFxuICAgIGFwcC5sb2FuQ2FsY3VsYXRvciA9IG5ldyBMb2FuQ2FsY3VsYXRvck1vZGVsKHtcblxuICAgIH0pO1xuICAgIGFwcC5sb2FuQ2FsY3VsYXRvclZpZXcgPSBuZXcgTG9hbkNhbGN1bGF0b3JWaWV3KHtcbiAgICAgICAgbW9kZWw6IGFwcC5sb2FuQ2FsY3VsYXRvcixcbiAgICAgICAgZWw6ICdmb3JtLmNhbGMnXG4gICAgfSk7XG5cbiAgICBsZXQgQXBwTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgICAgICBkZWZhdWx0czoge31cbiAgICB9KTtcblxuICAgIGFwcC5tb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXG4gICAgdmFyIEFwcFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnYm9keScsXG5cbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAvLyDQodC/0L7RgdC+0LEg0LLRi9C00LDRh9C4XG4gICAgICAgICAgICAnY2xpY2sgLm1ldGhvZCc6ICdjaGFuZ2VNZXRob2QnLFxuXG4gICAgICAgICAgICAvLyDQotCw0LHRiyAn0L/QvtGH0LXQvNGDINC80YsnXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bi1hYm91dCc6ICdjaGFuZ2VBYm91dFRhYicsXG4gICAgICAgICAgICAvLyDQotCw0LHRiyAn0JLQvtC/0YDQvtGB0Ysg0Lgg0L7RgtCy0LXRgtGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tcXVlc3Rpb25zJzogJ2NoYW5nZVF1ZXN0aW9uVGFiJyxcbiAgICAgICAgICAgICdjbGljayAuanNfdGFiLXF1ZXN0LWdldCc6ICdjaGFuZ2VRdWVzdGlvblRhYkdldFpheW0nLFxuXG4gICAgICAgICAgICAvLyDQoNCw0YHQutGA0YvRgtGMINC60L7QvNC10L3RgtGLXG4gICAgICAgICAgICAnY2xpY2sgLnVwZGF0ZS1jb21tZW50JzogJ3Nob3dDb21tZW50cycsXG5cbiAgICAgICAgICAgIC8vINCh0LvQsNC50LTQtdGAXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1yaWdodCc6ICduZXh0U2xpZGUnLFxuICAgICAgICAgICAgJ2NsaWNrIC5hcnJvdy0tbGVmdCc6ICdwcmV2U2xpZGUnLFxuXG4gICAgICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWJ0bl9yZWdpc3Rlcic6ICdoYW5kbGVSZWdpc3RlcicsXG4gICAgICAgICAgICAvLyDQntCx0YDQsNGC0L3QsNGPINGB0LLRj9C30YxcbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX2ZlZWRiYWNrJzogJ2hhbmRsZUZlZWRiYWNrJyxcblxuICAgICAgICAgICAgLy8g0JTQu9GPINC/0L7Qv9Cw0L/QvtCyXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXNob3dfcmVnaXN0ZXInOiAnc2hvd1JlZ2lzdGVyJyxcbiAgICAgICAgICAgICdjbGljayAuanMtcGF5X21ldGhvZCc6ICdzaG93UGF5TWV0aG9kJyxcbiAgICAgICAgICAgICdjbGljayAuYnRuX2ZlZWRiYWNrJzogJ3Nob3dGZWVkYmFjaycsXG4gICAgICAgICAgICAnY2hhbmdlIC5wb3B1cCc6ICdjaGFuZ2VQb3B1cycsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWNsb3NlX3BvcHVwJzogJ2Nsb3NlUG9wdXAnXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnI3VzZXJQaG9uZScpLm1hc2soXCIrNyAoOTk5KSA5OTktOTk5OVwiKTtcblxuICAgICAgICAgICAgLy8g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDQstGA0LXQvNGPXG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBkYXRlLnNldE1pbnV0ZXMoZGF0ZS5nZXRNaW51dGVzKCkgKyAxNSk7XG5cbiAgICAgICAgICAgIGxldCByZXNIb3VyID0gZGF0ZS5nZXRIb3VycygpLFxuICAgICAgICAgICAgICAgIHJlc01pbiA9IGRhdGUuZ2V0TWludXRlcygpO1xuXG4gICAgICAgICAgICBpZiAoZGF0ZS5nZXRIb3VycygpLnRvU3RyaW5nKCkubGVuZ3RoID09IDEpIHJlc0hvdXIgPSAnMCcgKyBkYXRlLmdldEhvdXJzKCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRlLmdldE1pbnV0ZXMoKS50b1N0cmluZygpLmxlbmd0aCA9PSAxKSByZXNNaW4gPSAnMCcgKyBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICAgICAgbGV0IHJlcyA9IHJlc0hvdXIgKyAnOicgKyByZXNNaW47XG5cbiAgICAgICAgICAgICQoJy55b3UtbG9hbiAuanMtbG9hbicpLmh0bWwoJyAnICsgcmVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQktGL0LHQvtGAINGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBjaGFuZ2VNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5tZXRob2QnKS50b2dnbGVDbGFzcygnbWV0aG9kLS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gLS0g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDRgtC10LrRgdGCXG4gICAgICAgICAgICAkKCcuanMtcGF5X21ldGhvZCcpLmh0bWwoJCgnLm1ldGhvZC0tYWN0aXZlJykuZmluZCgnLmpzLXRleHRfbWV0aG9kJykuaHRtbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YLQsNCx0L7QsiAo0LTQvtC70LbQvdC+INGA0LDQsdC+0YLQsNGC0Ywg0Lgg0L3QsCDQtNC10YHQutGC0L7Qv9C1KVxuICAgICAgICBjaGFuZ2VBYm91dFRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5idG4tYWJvdXQtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1hYm91dC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNhYm91dFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gLS0g0LLQvtC/0YDQvtGB0Ysg0Lgg0L7RgtCy0LXRgtGLXG4gICAgICAgIGNoYW5nZVF1ZXN0aW9uVGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1xdWVzdGlvbnMtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1xdWVzdGlvbnMtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YWJJZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldCk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudC1xdWVzdCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNRdWVzdFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gLS0tLSDQstC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YsgKNCf0L7Qu9GD0YfQtdC90LjQtSDQt9Cw0LnQvNCwKVxuICAgICAgICBjaGFuZ2VRdWVzdGlvblRhYkdldFpheW06IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuanNfdGFiLXF1ZXN0LWdldC0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnanNfdGFiLXF1ZXN0LWdldC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhYklkKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcblxuICAgICAgICAgICAgJCgnLmpzX2dldC16YXltLXRhYi1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzX2dldC16YXltLXRhYi1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI1F1ZXN0R2V0WmF5bVRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqc19nZXQtemF5bS10YWItY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd0NvbW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuaWNvX3VwZGF0ZS1jb21tZW50cycpLmFkZENsYXNzKCdpY29fdXBkYXRlLWNvbW1lbnRzLS1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5qcy1yb3ctY29tbWVudCcpLnNsaWRlRG93big1MDApLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2ZsZXgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnLnJvdy1jb21tZW50LWhpZGUnKS5zbGlkZVVwKDY1MCk7XG4gICAgICAgICAgICAgICAgJCgnLnVwZGF0ZS1jb21tZW50JykuaGlkZSgxMDApO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KHQu9C10LTRg9GO0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgbmV4dFNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPD0gLTU0MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgLSAyNzAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyDQn9GA0LXQtNGL0LTRg9GJ0LjQuSDRgdC70LDQudC0XG4gICAgICAgIHByZXZTbGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5jb250ZW50LXNsaWRlcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnLjNzIGVhc2Utb3V0JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodmFsdWUpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAtNTQwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSArIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICBoYW5kbGVSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHBob25lID0gJCgnI3VzZXJQaG9uZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3MgPSAkKCcjdXNlclBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICByZVBhc3MgPSAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBwZXJpb2QgPSBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKTtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2pzUmVnaXN0ZXInKTtcblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCXG4gICAgICAgICAgICBpZiAocGFzcyAhPT0gcmVQYXNzKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZXBlYXQtcGFzcycpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZXBlYXQtcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9GMINC60L7RgNC+0YLQutC40LlcbiAgICAgICAgICAgIGlmIChwYXNzLmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXNzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCDRgtC10LvQtdGE0L7QvdCwXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoICE9IDE3KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZVBhc3MgJiYgcGFzcy5sZW5ndGggPj0gNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogcGhvbmUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3MsXG4gICAgICAgICAgICAgICAgcmVQYXNzd29yZDogcmVQYXNzLFxuICAgICAgICAgICAgICAgIHN1bTogYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyksXG4gICAgICAgICAgICAgICAgcGVyaW9kOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSA+IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIgPyBwZXJpb2QgKiA3IDogcGVyaW9kXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWdpc3RlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINGE0L7RgNC80Ysg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9C4XG4gICAgICAgIGhhbmRsZUZlZWRiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgdGhlbWUgPSAkKCcuanMtZmVlZC1zZWxlY3RfdGhlbWUgb3B0aW9uOnNlbGVjdGVkJykudmFsKCksXG4gICAgICAgICAgICAgICAgZW1haWwgPSAkKCcuanMtZmVlZC1lbWFpbCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkKCcuanMtZmVlZC1tZXNzYWdlJykudmFsKCk7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHRoZW1lOiB0aGVtZSxcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2pzRmVlZGJhY2snKTtcblxuICAgICAgICAgICAgLy8g0JfQsNC/0YDQvtGBXG5cbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9mZWVkYmFjaycpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgICAgICAgc2hvd1JlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLXJlZ2lzdGVyJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINCy0YvQsdC+0YDQvtC8INGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBzaG93UGF5TWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLW1ldGhvZCcpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30YzRjlxuICAgICAgICBzaG93RmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tZmVlZGJhY2snKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCX0LDQutGA0YvRgtGMINC/0L7Qv9Cw0L9cbiAgICAgICAgY2xvc2VQb3B1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwJykuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgYXBwLnZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgLy8g0JfQvdCw0YfQtdC90LjRjyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHN1bTogNjAwMCxcbiAgICAgICAgcGVyaW9kOiAxMixcbiAgICAgICAgdHlwZTogJ29uY2UnIC8vIFwib25jZVwiIG9yIFwidHdvX3dlZWtzXCJcbiAgICB9LFxuXG4gICAgLy8g0J/QvtC00YHRh9C10YIg0L7QsdGJ0LXQuSDRgdGD0LzQvNGLINC30LDQudC80LAgKNCe0JQgKyDQn9GA0L7RhtC10L3RgtGLICsg0JrQvtC80LjRgdGB0LjQuClcbiAgICBjYWxjdWxhdGVMb2FuU3VtOiBmdW5jdGlvbiAoc3VtLCBwZXJpb2QpIHtcbiAgICAgICAgdmFyIHRvdGFsO1xuXG4gICAgICAgIHN1bSA9IHBhcnNlSW50KHN1bSk7XG4gICAgICAgIHBlcmlvZCA9IHBhcnNlSW50KHBlcmlvZCk7XG5cbiAgICAgICAgaWYgKHN1bSA8PSBBcHBDb25zdGFudHMudGFycmlmc1swXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICAvLyDQodGH0LjRgtCw0LXQvCDQv9C+INC/0LXRgNCy0L7QvNGDINGC0LDRgNC40YTRg1xuICAgICAgICAgICAgdG90YWwgPSBNYXRoLmNlaWwoKHN1bSArIHN1bSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSkgKiAoQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ucGVyY2VudCAqIHBlcmlvZCArIDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0LLRgtC+0YDQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLnBlcmNlbnQgKiA3O1xuICAgICAgICAgICAgdmFyIG5fd2Vla3MgPSBwZXJpb2Q7XG4gICAgICAgICAgICB2YXIgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykpIC8gKE1hdGgucG93KCgxICsgcGVyY2VudCksIG5fd2Vla3MpIC0gMSk7XG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIGFubnVpdHkgKiBuX3dlZWtzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0b3RhbDtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hbkNhbGN1bGF0b3JNb2RlbDsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuLi9oZWxwZXJzJztcblxudmFyIExvYW5DYWxjdWxhdG9yVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXG4gICAgc3VtUmFuZ2VzOiAkKCdpbnB1dC5qcy1zbGlkZXItLXN1bScpLFxuICAgIHBlcmlvZFJhbmdlczogJCgnaW5wdXQuanMtc2xpZGVyLS1wZXJpb2QnKSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1zdW0nOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG5cbiAgICAgICAgLy8g0JTQu9GPINC/0L7Qu9C10Lkg0LrQsNC70YzQutGD0LvRj9GC0L7RgNCwXG4gICAgICAgICdmb2N1cyAucmFuZ2VfZmllbGQnOiAnbGlnaHRCb3JkZXJJbnB1dCcsXG4gICAgICAgICdmb2N1c291dCAucmFuZ2VfZmllbGQnOiAnb2ZmTGlnaHRCb3JkZXJJbnB1dCdcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLnRlbXBsYXRlID0gJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZW5kZXJlZCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy4kZWwuaHRtbChyZW5kZXJlZCk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2UoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgY2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLm1vZGVsLmdldCgnc3VtJyksXG4gICAgICAgICAgICBwZXJpb2QgPSB0aGlzLm1vZGVsLmdldCgncGVyaW9kJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQtSDRgdGD0LzQvNGLXG4gICAgICAgICAgICBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LUg0YHRgNC+0LrQsFxuICAgICAgICAgICAgZmllbGRQZXJpb2QgPSAkKCdpbnB1dFtuYW1lPXBlcmlvZF0nKTtcblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0YHRg9C80LzRiyDQt9Cw0LnQvNCwXG4gICAgICAgICQoJy5qcy1vdXQtc3VtJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcblxuICAgICAgICAvLyAtLSDQsiDQv9C+0LvQtSBj0YPQvNC80YtcbiAgICAgICAgJChmaWVsZFN1bSkudmFsKHN1bSk7XG4gICAgICAgIC8vIC0tINCyINC/0L7Qu9C1INC/0LXRgNC40L7QtFxuICAgICAgICAkKGZpZWxkUGVyaW9kKS52YWwocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuICAgICAgICAgICAgQXBwSGVscGVycy5wcmludFJlc3VsdHMoKTtcblxuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDEpJykuaHRtbCgnNCDQvdC10LTQtdC70LgnKTtcblxuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDIpJykuaHRtbCgnMTIg0L3QtdC00LXQu9GMJyk7XG5cbiAgICAgICAgICAgIC8vINCc0LXQvdGP0LXQvCDQt9C90LDRh9C10L3QuNC1INC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIDEyLCA0KTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpID09IDQgPyAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0L3QtdC00LXQu9C4JykgOiAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0L3QtdC00LXQu9GMJyk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgncGVyaW9kJykgPT0gNCA/ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZDJdJykuaHRtbCgn0L3QtdC00LXQu9C4JykgOiAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2QyXScpLmh0bWwoJ9C90LXQtNC10LvRjCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLmluZm8tYmFjayBzcGFuJykuaHRtbCgn0JLQvtC30LLRgNCw0YnQsNC10YLQtScpO1xuICAgICAgICAgICAgJCgnLmpzLW91dC1zdW1fYmFjaycpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIodGhpcy5tb2RlbC5jYWxjdWxhdGVMb2FuU3VtKHN1bSwgcGVyaW9kKSkgKyAnIOKCvScpO1xuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDEpJykuaHRtbCgnOCDQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDIpJykuaHRtbCgnMzAg0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQtNC90LXQuScpO1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgMzAsIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gJCh0aGlzLnN1bVJhbmdlcykudmFsKHN1bSk7XG4gICAgICAgIC8vICQodGhpcy5wZXJpb2RSYW5nZXMpLnZhbChwZXJpb2QpO1xuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0L/QvtC70LfRg9C90LrQsCAodHlwZTogc3VtIHx8IHBlcmlvZClcbiAgICBjaGFuZ2VSYW5nZVNsaWRlcjogZnVuY3Rpb24gKHR5cGUsIG1heCwgbWluKSB7XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0LmpzLXNsaWRlci0tJyArIHR5cGUpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQocmFuZ2VbaV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ21heCcsIG1heClcbiAgICAgICAgICAgICAgICAuYXR0cignbWluJywgbWluKVxuICAgICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAoJChyYW5nZVtpXSkudmFsKCkgLSAkKHJhbmdlW2ldKS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAoJChyYW5nZVtpXSkuYXR0cignbWF4JykgLSAkKHJhbmdlW2ldKS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh0eXBlLCAkKHJhbmdlW2ldKS52YWwoKSk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlU3VtUmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1pbiA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgbWF4ID0gJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWF4Jyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgbWF4LCBtaW4pO1xuXG4gICAgfSxcblxuICAgIC8vIC0tINCS0YvQsdC+0YAg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9GPXG4gICAgY2hhbmdlU3VtRmllbGQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJyk7XG5cbiAgICAgICAgdmFyICRpbnB1dCA9ICQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgdmFyIHN1bSA9IHBhcnNlSW50KCRpbnB1dC52YWwoKSkgfHwgNjAwMDtcbiAgICAgICAgbGV0IHBvdyA9IE1hdGguY2VpbChzdW0vMTAwKSAqMTAwO1xuICAgICAgICBpZiggKHBvdyAtIHN1bSkgPiA1MCl7XG4gICAgICAgICAgICBzdW0gPSBwb3cgLSAxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW0gPSBwb3c7XG4gICAgICAgIH1cbiAgICAgICAgJGlucHV0LnZhbChzdW0pO1xuXG4gICAgICAgIGlmIChzdW0gPiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0d29fd2Vla3MnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdvbmNlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21heCcpLCAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtaW4nKSk7XG5cbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMucGVyaW9kUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5wZXJpb2RSYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIG1heCwgbWluKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0L/QvtC70LfRg9C90L7QulxuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCcpO1xuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgLy8g0KHRgtC40LvQuCDQtNC70Y8g0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHJhbmdlLnZhbCgpIC0gcmFuZ2UuYXR0cignbWluJykpICogMTAwIC8gKHJhbmdlLmF0dHIoJ21heCcpIC0gcmFuZ2UuYXR0cignbWluJykpICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgICQoJy5qcy1wZXJpb2QnKS52YWwodGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpKTtcbiAgICB9LFxuXG4gICAgbGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyMxOGE0ZDInXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmZMaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnI2IwYmFjNSdcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XSxcbiAgICBmZWVJc3N1ZTogMC4wNSxcbiAgICBmYWN0b3JNYXg6IDAuMTUsXG4gICAgZmFjdG9yTWluOiAwLjAxLFxuICAgIHN1bUJvcmRlcjogMzAwMDAsXG4gICAgRkVFX0lTU1VFOiAwLjA1LCAvLyDQmtC+0LzQvNC40YHQuNGPINC30LAg0LLRi9C00LDRh9GDXG4gICAgUEVSQ0VOVF9TVEFOREFSVDogMC4wMTUsIC8vINCh0YLQsNC90LTQsNGA0YLQvdGL0Lkg0L/RgNC+0YbQtdC90YIgKNCyINC00LXQvdGMKVxuICAgIFBFUkNFTlRfREVMQVk6IDAuMDE1LCAvLyDQn9GA0L7RhtC10L3RgiDQsiDRgdC70YPRh9Cw0LUg0L/RgNC+0YHRgNC+0YfQutC4ICjQsiDQtNC10L3RjClcbiAgICBGSU5FX0RFTEFZOiAxMDAwLjAwLCAvLyDQnNCw0LrRgdC40LzQsNC70YzQvdCw0Y8g0YHRg9C80LzQsCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7Qs9C+INGI0YLRgNCw0YTQsCDQt9CwINC/0YDQvtGB0YDQvtGH0LrRg1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBDb25zdGFudHM7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDguMTIuMTYuXG4gKi9cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICAvLyBAVE9ETzogdXJsXG4gICAgYmFzZVVybDogJycsXG5cbiAgICAvLyBhamF4XG4gICAgYWpheFdyYXBwZXI6ICh1cmwsIHR5cGUsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgPT4ge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCAnUE9TVCc7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBzdWNjZXNzQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkge307XG4gICAgICAgIGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVybXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEFwcEhlbHBlcnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvckNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDQpNC40L3QsNC70YzQvdCw0Y8g0YHRg9C80LzQsFxuICAgIHByaW50UmVzdWx0czogKCkgPT4ge1xuICAgICAgICBsZXQgc3VtID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyk7XG4gICAgICAgIGxldCBkYXlzID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgbGV0IHBheW1ldGhvZDtcblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikgcGF5bWV0aG9kID0gJ9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0ZHQtiDQvdCwINGB0YPQvNC80YMnO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheXMgKj0gNztcbiAgICAgICAgICAgIHBheW1ldGhvZCA9IChBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSArICcgJyArIEFwcEhlbHBlcnMuZ2V0Q2FzZShBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSwgJ9C/0LvQsNGC0ZHQticsICfQv9C70LDRgtC10LbQsCcsICfQv9C70LDRgtC10LbQtdC5JykpO1xuICAgICAgICB9XG4gICAgICAgIHN1bSA9IEFwcEhlbHBlcnMuZXN0aW1hdGVSZXR1cm5TdW0oc3VtLCBkYXlzKTtcblxuICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKHBheW1ldGhvZCsnINC/0L4nKTtcblxuICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVBbm5QZXJpb2RzOiAoZGF5cykgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGRheXMgLyAxNCk7XG4gICAgfSxcblxuICAgIGdldENhc2U6IChfbnVtYmVyLCBfY2FzZTEsIF9jYXNlMiwgX2Nhc2UzKSA9PiB7XG4gICAgICAgIHZhciBiYXNlID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwMCkgKiAxMDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGJhc2UgPiA5ICYmIGJhc2UgPCAyMCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gX2Nhc2UzO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVtYWluZGVyID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwKSAqIDEwO1xuXG4gICAgICAgICAgICBpZiAoMSA9PSByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKDAgPCByZW1haW5kZXIgJiYgNSA+IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UyO1xuICAgICAgICAgICAgZWxzZSByZXN1bHQgPSBfY2FzZTM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZVJldHVyblN1bTogKHN1bSwgZGF5cykgPT4ge1xuICAgICAgICBjb25zdCBmZWVJc3N1ZSA9IEFwcENvbnN0YW50cy5mZWVJc3N1ZTtcbiAgICAgICAgY29uc3QgZmFjdG9yTWF4ID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1heDtcbiAgICAgICAgY29uc3QgZmFjdG9yTWluID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1pbjtcblxuICAgICAgICBzdW0gPSBOdW1iZXIoc3VtKTtcbiAgICAgICAgbGV0IHBheWJhY2sgPSBNYXRoLmNlaWwoc3VtICogZmVlSXNzdWUpO1xuICAgICAgICAvL9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0LXQtlxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogZGF5cyArIDEpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogMTQ7XG4gICAgICAgICAgICBsZXQgYW5uX3BlcmlvZHMgPSBkYXlzIC8gMTQ7XG4gICAgICAgICAgICBsZXQgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykgLSAxKTtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiBhbm51aXR5KTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGE0L7RgNC8XG4gICAgZm9ybVZhbGlkYXRlOiBmdW5jdGlvbiAoZm9ybUlkKSB7XG4gICAgICAgIGxldCBmb3JtID0gJyMnICsgZm9ybUlkO1xuICAgICAgICBsZXQgZmllbGQgPSAkKGZvcm0gKyAnIFtkYXRhLXR5cGU9ZmllbGRdJyk7XG4gICAgICAgIGxldCBlcnIgPSAkKGZvcm0gKyAnIC5ibG9jay1lcnInKTtcbiAgICAgICAgbGV0IGJ0biA9ICQoZm9ybSArICcgYS5hYl9idXR0b24nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChmaWVsZFtpXSkudmFsKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoZmllbGRbaV0pLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChmaWVsZFtpXSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoZm9ybSArICcgLmVyci1maWVsZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAkKGJ0bikucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAkKGVycikuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChidG4pLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcEhlbHBlcnM7Il19
