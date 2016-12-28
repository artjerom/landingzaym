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
            'click .js_tab-quest-repay': 'changeQuestionTabRepayZaym',

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

        // ---- вопросы и ответы (Получение займа)
        changeQuestionTabGetZaym: function changeQuestionTabGetZaym(e) {
            $('.js_tab-quest-get--active').add(e.target).toggleClass('js_tab-quest-get--active');

            var tabId = $(e.target).attr('data-tab');

            $('.js_get-zaym-tab-content').removeClass('js_get-zaym-tab-content--active');

            $('#QuestGetZaymTab-' + tabId).addClass('js_get-zaym-tab-content--active');
        },

        // ---- Вопросы и ответы (Погашение займа)
        changeQuestionTabRepayZaym: function changeQuestionTabRepayZaym(e) {
            $('.js_tab-quest-repay--active').add(e.target).toggleClass('js_tab-quest-repay--active');

            var tabId = $(e.target).attr('data-tab');

            $('.js_repay-zaym-tab-content').removeClass('js_repay-zaym-tab-content--active');

            $('#QuestRepayZaymTab-' + tabId).addClass('js_repay-zaym-tab-content--active');
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

            // Если пароли не совпадают

            if (pass !== rePass) {
                $('.js-err-repeat-pass').show();
            } else {
                $('.js-err-repeat-pass').hide();
            }
            // Если пароль короткий

            if (pass.length < 6) {
                $('.js-err-val-pass').show();
                $('#userPass').addClass('err-field');
                $('.js-btn_register').addClass('is-disabled');
            } else if (pass.length >= 6) {
                $('.js-err-val-pass').hide();
                $('#userPass').removeClass('err-field');
                $('.js-btn_register').removeClass('is-disabled');
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

            if ($('#agreement').is(':checked')) {
                $('.js-btn_register').removeClass('is-disabled');
                $('.js-err-agreement').hide();
            } else {
                $('.js-btn_register').addClass('is-disabled');
                $('.js-err-agreement').show();
            }
            var data = {
                phone: phone,
                password: pass,
                rePassword: rePass,
                sum: app.loanCalculator.get('sum'),
                agreement: $('#agreement').prop('checked'),
                period: app.loanCalculator.get('sum') > _constants2.default.sumBorder ? period * 7 : period
            };

            $('#userRepeatPass').val() !== $('#userPass').val() ? $('#userRepeatPass').addClass('err-field') : $('#userRepeatPass').removeClass('err-field');
            $('#userPass').val().length < 6 ? $('#userPass').addClass('err-field') : $('#userPass').removeClass('err-field');
            _helpers2.default.formValidate('jsRegister');

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
        type: 'once', // "once" or "two_weeks"
        config: {
            show: true,
            showPeriod: true
        },
        maxPeriod: 30,
        minPeriod: 8
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

    sumRanges: 'input.js-slider--sum',
    periodRanges: 'input.js-slider--period',

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

        // this.changePeriodRange();
        this.changeCalc('you-get', 2);
        this.change();

        return this;
    },

    // Изменение шаблона
    changeCalc: function changeCalc(section, n) {
        var allBlock = '#' + section;

        // Для суммы
        // -- поля
        $(allBlock + ' input[name=sum]').attr('id', 'focusInpSum' + n);
        $(allBlock + ' .af-input--sum label.js-symb_inp').attr('for', 'focusInpSum' + n);
        // -- полузонок
        $(allBlock + ' input[type=range].js-slider--sum').attr('id', 'sum' + n);

        // Для периода
        // -- поля
        $(allBlock + ' input[name=period]').attr('id', 'focusInpPeriod' + n);
        $(allBlock + ' .af-input--period label.js-symb_inp').attr('for', 'focusInpPeriod' + n);
        // -- полузонок
        $(allBlock + ' input[type=range].js-slider--period').attr('id', 'period' + n);
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
            this.model.set('maxPeriod', 12);
            this.model.set('minPeriod', 4);

            this.model.get('period') == 4 ? $('label[for=focusInpPeriod]').html('недели') : $('label[for=focusInpPeriod]').html('недель');

            this.model.get('period') == 4 ? $('label[for=focusInpPeriod2]').html('недели') : $('label[for=focusInpPeriod2]').html('недель');
        } else {
            $('.info-back span').html('Возвращаете');
            $('.js-out-sum_back').html(_helpers2.default.formatNumber(this.model.calculateLoanSum(sum, period)) + ' ₽');
            $('.js-range_info-period span:nth-child(1)').html('8 дней');
            $('.js-range_info-period span:nth-child(2)').html('30 дней');
            $('label[for=focusInpPeriod]').html('дней');
            $('label[for=focusInpPeriod2]').html('дней');
            this.model.set('maxPeriod', 30);
            this.model.set('minPeriod', 8);
        }

        // $($(this.sumRanges)[0]).val($($(this.sumRanges)[1]).val());
        $(this.sumRanges).val(sum);
        $(this.periodRanges).val(period);
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

        if (this.model.get('sum') > _constants2.default.sumBorder) {
            this.model.set('period', 5);
        }

        this.changePeriodRange();
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

        if (this.model.get('sum') > _constants2.default.sumBorder) {
            this.model.set('period', 5);
        }

        this.changePeriodRange();
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function changePeriodRange() {

        this.changeRangeSlider('period', this.model.get('maxPeriod'), this.model.get('minPeriod'));

        $('input[type=range]#period').css('backgroundSize', $('input[type=range]#period2').css('backgroundSize'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjtBQVFKLHVDQUEyQiwwQkFSdkI7QUFTSix5Q0FBNkIsNEJBVHpCOztBQVdKO0FBQ0EscUNBQXlCLGNBWnJCOztBQWNKO0FBQ0EsbUNBQXVCLFdBZm5CO0FBZ0JKLGtDQUFzQixXQWhCbEI7O0FBa0JKO0FBQ0Esc0NBQTBCLGdCQW5CdEI7QUFvQko7QUFDQSxzQ0FBMEIsZ0JBckJ0Qjs7QUF1Qko7QUFDQSx1Q0FBMkIsY0F4QnZCO0FBeUJKLG9DQUF3QixlQXpC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UUFBSixHQUFlLE9BQWYsQ0FBdUIsNkJBQXZCLEVBQXNELEtBQXRELENBQVA7QUFDSCxLQXpGWTs7QUEyRmI7QUFDQSxrQkFBYyxzQkFBVSxNQUFWLEVBQWtCO0FBQzVCLFlBQUksT0FBTyxNQUFNLE1BQWpCO0FBQ0EsWUFBSSxRQUFRLEVBQUUsT0FBTyxvQkFBVCxDQUFaO0FBQ0EsWUFBSSxNQUFNLEVBQUUsT0FBTyxhQUFULENBQVY7QUFDQSxZQUFJLE1BQU0sRUFBRSxPQUFPLGNBQVQsQ0FBVjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNuQyxnQkFBSSxFQUFFLE1BQU0sQ0FBTixDQUFGLEVBQVksR0FBWixNQUFxQixDQUF6QixFQUE0QjtBQUN4QixrQkFBRSxNQUFNLENBQU4sQ0FBRixFQUFZLFFBQVosQ0FBcUIsV0FBckI7QUFDSCxhQUZELE1BRU87QUFDSCxrQkFBRSxNQUFNLENBQU4sQ0FBRixFQUFZLFdBQVosQ0FBd0IsV0FBeEI7QUFDSDtBQUNKOztBQUVELFlBQUksRUFBRSxPQUFPLGFBQVQsRUFBd0IsTUFBeEIsSUFBa0MsQ0FBdEMsRUFBeUM7QUFDckMsY0FBRSxHQUFGLEVBQU8sV0FBUCxDQUFtQixhQUFuQjtBQUNBLGNBQUUsR0FBRixFQUFPLElBQVA7QUFDSCxTQUhELE1BR087QUFDSCxjQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGFBQWhCO0FBQ0EsY0FBRSxHQUFGLEVBQU8sSUFBUDtBQUNIO0FBRUo7QUFsSFksQ0FBakIsQyxDQUxBOzs7a0JBMEhlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JWaWV3IGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yVmlldyc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAubG9hbkNhbGN1bGF0b3IgPSBuZXcgTG9hbkNhbGN1bGF0b3JNb2RlbCh7XG5cbiAgICB9KTtcbiAgICBhcHAubG9hbkNhbGN1bGF0b3JWaWV3ID0gbmV3IExvYW5DYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAubG9hbkNhbGN1bGF0b3IsXG4gICAgICAgIGVsOiAnZm9ybS5jYWxjJ1xuICAgIH0pO1xuXG4gICAgbGV0IEFwcE1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgZGVmYXVsdHM6IHt9XG4gICAgfSk7XG5cbiAgICBhcHAubW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblxuICAgIHZhciBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2JvZHknLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgLy8g0KHQv9C+0YHQvtCxINCy0YvQtNCw0YfQuFxuICAgICAgICAgICAgJ2NsaWNrIC5tZXRob2QnOiAnY2hhbmdlTWV0aG9kJyxcblxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9C/0L7Rh9C10LzRgyDQvNGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tYWJvdXQnOiAnY2hhbmdlQWJvdXRUYWInLFxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9CS0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLXF1ZXN0aW9ucyc6ICdjaGFuZ2VRdWVzdGlvblRhYicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzX3RhYi1xdWVzdC1nZXQnOiAnY2hhbmdlUXVlc3Rpb25UYWJHZXRaYXltJyxcbiAgICAgICAgICAgICdjbGljayAuanNfdGFiLXF1ZXN0LXJlcGF5JzogJ2NoYW5nZVF1ZXN0aW9uVGFiUmVwYXlaYXltJyxcblxuICAgICAgICAgICAgLy8g0KDQsNGB0LrRgNGL0YLRjCDQutC+0LzQtdC90YLRi1xuICAgICAgICAgICAgJ2NsaWNrIC51cGRhdGUtY29tbWVudCc6ICdzaG93Q29tbWVudHMnLFxuXG4gICAgICAgICAgICAvLyDQodC70LDQudC00LXRgFxuICAgICAgICAgICAgJ2NsaWNrIC5hcnJvdy0tcmlnaHQnOiAnbmV4dFNsaWRlJyxcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLWxlZnQnOiAncHJldlNsaWRlJyxcblxuICAgICAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fcmVnaXN0ZXInOiAnaGFuZGxlUmVnaXN0ZXInLFxuICAgICAgICAgICAgLy8g0J7QsdGA0LDRgtC90LDRjyDRgdCy0Y/Qt9GMXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWJ0bl9mZWVkYmFjayc6ICdoYW5kbGVGZWVkYmFjaycsXG5cbiAgICAgICAgICAgIC8vINCU0LvRjyDQv9C+0L/QsNC/0L7QslxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1zaG93X3JlZ2lzdGVyJzogJ3Nob3dSZWdpc3RlcicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXBheV9tZXRob2QnOiAnc2hvd1BheU1ldGhvZCcsXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bl9mZWVkYmFjayc6ICdzaG93RmVlZGJhY2snLFxuICAgICAgICAgICAgJ2NoYW5nZSAucG9wdXAnOiAnY2hhbmdlUG9wdXMnLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1jbG9zZV9wb3B1cCc6ICdjbG9zZVBvcHVwJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJyN1c2VyUGhvbmUnKS5tYXNrKFwiKzcgKDk5OSkgOTk5LTk5OTlcIik7XG5cbiAgICAgICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LLRgNC10LzRj1xuICAgICAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpICsgMTUpO1xuXG4gICAgICAgICAgICBsZXQgcmVzSG91ciA9IGRhdGUuZ2V0SG91cnMoKSxcbiAgICAgICAgICAgICAgICByZXNNaW4gPSBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICAgICAgaWYgKGRhdGUuZ2V0SG91cnMoKS50b1N0cmluZygpLmxlbmd0aCA9PSAxKSByZXNIb3VyID0gJzAnICsgZGF0ZS5nZXRIb3VycygpO1xuXG4gICAgICAgICAgICBpZiAoZGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5sZW5ndGggPT0gMSkgcmVzTWluID0gJzAnICsgZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGxldCByZXMgPSByZXNIb3VyICsgJzonICsgcmVzTWluO1xuXG4gICAgICAgICAgICAkKCcueW91LWxvYW4gLmpzLWxvYW4nKS5odG1sKCcgJyArIHJlcyk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQktGL0LHQvtGAINGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBjaGFuZ2VNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5tZXRob2QnKS50b2dnbGVDbGFzcygnbWV0aG9kLS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gLS0g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDRgtC10LrRgdGCXG4gICAgICAgICAgICAkKCcuanMtcGF5X21ldGhvZCcpLmh0bWwoJCgnLm1ldGhvZC0tYWN0aXZlJykuZmluZCgnLmpzLXRleHRfbWV0aG9kJykuaHRtbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YLQsNCx0L7QsiAo0LTQvtC70LbQvdC+INGA0LDQsdC+0YLQsNGC0Ywg0Lgg0L3QsCDQtNC10YHQutGC0L7Qv9C1KVxuICAgICAgICBjaGFuZ2VBYm91dFRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5idG4tYWJvdXQtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1hYm91dC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNhYm91dFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gLS0g0LLQvtC/0YDQvtGB0Ysg0Lgg0L7RgtCy0LXRgtGLXG4gICAgICAgIGNoYW5nZVF1ZXN0aW9uVGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1xdWVzdGlvbnMtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1xdWVzdGlvbnMtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICAkKCcuanMtY2hhbmdlLWNvbnRlbnQtcXVlc3QnKS5yZW1vdmVDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtcXVlc3QtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjUXVlc3RUYWItJyArIHRhYklkKS5hZGRDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtcXVlc3QtLWFjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIC0tLS0g0LLQvtC/0YDQvtGB0Ysg0Lgg0L7RgtCy0LXRgtGLICjQn9C+0LvRg9GH0LXQvdC40LUg0LfQsNC50LzQsClcbiAgICAgICAgY2hhbmdlUXVlc3Rpb25UYWJHZXRaYXltOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmpzX3RhYi1xdWVzdC1nZXQtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2pzX3RhYi1xdWVzdC1nZXQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICAkKCcuanNfZ2V0LXpheW0tdGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnanNfZ2V0LXpheW0tdGFiLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjUXVlc3RHZXRaYXltVGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzX2dldC16YXltLXRhYi1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLS0tINCS0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiyAo0J/QvtCz0LDRiNC10L3QuNC1INC30LDQudC80LApXG4gICAgICAgIGNoYW5nZVF1ZXN0aW9uVGFiUmVwYXlaYXltOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmpzX3RhYi1xdWVzdC1yZXBheS0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnanNfdGFiLXF1ZXN0LXJlcGF5LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzX3JlcGF5LXpheW0tdGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnanNfcmVwYXktemF5bS10YWItY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNRdWVzdFJlcGF5WmF5bVRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqc19yZXBheS16YXltLXRhYi1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93Q29tbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5pY29fdXBkYXRlLWNvbW1lbnRzJykuYWRkQ2xhc3MoJ2ljb191cGRhdGUtY29tbWVudHMtLWFjdGl2ZScpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLXJvdy1jb21tZW50Jykuc2xpZGVEb3duKDUwMCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnZmxleCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKCcucm93LWNvbW1lbnQtaGlkZScpLnNsaWRlVXAoNjUwKTtcbiAgICAgICAgICAgICAgICAkKCcudXBkYXRlLWNvbW1lbnQnKS5oaWRlKDEwMCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQodC70LXQtNGD0Y7RidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBuZXh0U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA8PSAtNTQwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSAtIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vINCf0YDQtdC00YvQtNGD0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgcHJldlNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IC01NDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpICsgMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgIGhhbmRsZVJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgcGhvbmUgPSAkKCcjdXNlclBob25lJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzcyA9ICQoJyN1c2VyUGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHJlUGFzcyA9ICQoJyN1c2VyUmVwZWF0UGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBlcmlvZCA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpO1xuXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcblxuICAgICAgICAgICAgaWYgKHBhc3MgIT09IHJlUGFzcykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Ywg0LrQvtGA0L7RgtC60LjQuVxuXG4gICAgICAgICAgICBpZiAocGFzcy5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLnNob3coKTtcbiAgICAgICAgICAgICAgICAkKCcjdXNlclBhc3MnKS5hZGRDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXNzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkKCcjdXNlclBhc3MnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCDRgtC10LvQtdGE0L7QvdCwXG5cbiAgICAgICAgICAgIGlmIChwaG9uZS5sZW5ndGggIT0gMTcpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1waG9uZScpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwaG9uZS5sZW5ndGggPT09IDE3ICYmIHBhc3MgPT09IHJlUGFzcyAmJiBwYXNzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKCcjYWdyZWVtZW50JykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1hZ3JlZW1lbnQnKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLWFncmVlbWVudCcpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHBob25lOiBwaG9uZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzcyxcbiAgICAgICAgICAgICAgICByZVBhc3N3b3JkOiByZVBhc3MsXG4gICAgICAgICAgICAgICAgc3VtOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgICAgICBhZ3JlZW1lbnQ6ICQoJyNhZ3JlZW1lbnQnKS5wcm9wKCdjaGVja2VkJyksXG4gICAgICAgICAgICAgICAgcGVyaW9kOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSA+IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIgPyBwZXJpb2QgKiA3IDogcGVyaW9kXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKSAhPT0gJCgnI3VzZXJQYXNzJykudmFsKCkgPyAkKCcjdXNlclJlcGVhdFBhc3MnKS5hZGRDbGFzcygnZXJyLWZpZWxkJykgOiAkKCcjdXNlclJlcGVhdFBhc3MnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAkKCcjdXNlclBhc3MnKS52YWwoKS5sZW5ndGggPCA2ID8gJCgnI3VzZXJQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpIDogJCgnI3VzZXJQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2pzUmVnaXN0ZXInKTtcblxuICAgICAgICAgICAgLy8g0JfQsNC/0YDQvtGBXG4gICAgICAgICAgICBpZiAoISQoJy5qcy1idG5fcmVnaXN0ZXInKS5oYXNDbGFzcygnaXMtZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgIEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvcmVnaXN0ZXInLFxuICAgICAgICAgICAgICAgICAgICAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDRhNC+0YDQvNGLINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfQuFxuICAgICAgICBoYW5kbGVGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHRoZW1lID0gJCgnLmpzLWZlZWQtc2VsZWN0X3RoZW1lIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgIGVtYWlsID0gJCgnLmpzLWZlZWQtZW1haWwnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJCgnLmpzLWZlZWQtbWVzc2FnZScpLnZhbCgpO1xuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0aGVtZTogdGhlbWUsXG4gICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFwcEhlbHBlcnMuZm9ybVZhbGlkYXRlKCdqc0ZlZWRiYWNrJyk7XG5cbiAgICAgICAgICAgIC8vINCX0LDQv9GA0L7RgVxuICAgICAgICAgICAgaWYgKCEkKCcuanMtYnRuX2ZlZWRiYWNrJykuaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL2ZlZWRiYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2NlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tcmVnaXN0ZXInKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0LLRi9Cx0L7RgNC+0Lwg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIHNob3dQYXlNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tbWV0aG9kJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfRjNGOXG4gICAgICAgIHNob3dGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JfQsNC60YDRi9GC0Ywg0L/QvtC/0LDQv1xuICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScsIC8vIFwib25jZVwiIG9yIFwidHdvX3dlZWtzXCJcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgc2hvd1BlcmlvZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBtYXhQZXJpb2Q6IDMwLFxuICAgICAgICBtaW5QZXJpb2Q6IDgsXG4gICAgfSxcblxuICAgIC8vINCf0L7QtNGB0YfQtdGCINC+0LHRidC10Lkg0YHRg9C80LzRiyDQt9Cw0LnQvNCwICjQntCUICsg0J/RgNC+0YbQtdC90YLRiyArINCa0L7QvNC40YHRgdC40LgpXG4gICAgY2FsY3VsYXRlTG9hblN1bTogZnVuY3Rpb24gKHN1bSwgcGVyaW9kKSB7XG4gICAgICAgIHZhciB0b3RhbDtcblxuICAgICAgICBzdW0gPSBwYXJzZUludChzdW0pO1xuICAgICAgICBwZXJpb2QgPSBwYXJzZUludChwZXJpb2QpO1xuXG4gICAgICAgIGlmIChzdW0gPD0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWF4X3N1bSkge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQv9C10YDQstC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogKEFwcENvbnN0YW50cy50YXJyaWZzWzBdLnBlcmNlbnQgKiBwZXJpb2QgKyAxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDQodGH0LjRgtCw0LXQvCDQv9C+INCy0YLQvtGA0L7QvNGDINGC0LDRgNC40YTRg1xuICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogNztcbiAgICAgICAgICAgIHZhciBuX3dlZWtzID0gcGVyaW9kO1xuICAgICAgICAgICAgdmFyIGFubnVpdHkgPSAocGVyY2VudCAqIE1hdGgucG93KCgxICsgcGVyY2VudCksIG5fd2Vla3MpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSAtIDEpO1xuICAgICAgICAgICAgdG90YWwgPSBNYXRoLmNlaWwoKHN1bSArIHN1bSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSkgKiBhbm51aXR5ICogbl93ZWVrcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yTW9kZWw7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cblxuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IEFwcEhlbHBlcnMgZnJvbSAnLi4vaGVscGVycyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblxuICAgIHN1bVJhbmdlczogJ2lucHV0LmpzLXNsaWRlci0tc3VtJyxcbiAgICBwZXJpb2RSYW5nZXM6ICdpbnB1dC5qcy1zbGlkZXItLXBlcmlvZCcsXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJzogJ2NoYW5nZVN1bVJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtc3VtJzogJ2NoYW5nZVN1bUZpZWxkJyxcblxuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnOiAnY2hhbmdlUGVyaW9kUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1wZXJpb2QnOiAnY2hhbmdlUGVyaW9kRmllbGQnLFxuXG4gICAgICAgIC8vINCU0LvRjyDQv9C+0LvQtdC5INC60LDQu9GM0LrRg9C70Y/RgtC+0YDQsFxuICAgICAgICAnZm9jdXMgLnJhbmdlX2ZpZWxkJzogJ2xpZ2h0Qm9yZGVySW5wdXQnLFxuICAgICAgICAnZm9jdXNvdXQgLnJhbmdlX2ZpZWxkJzogJ29mZkxpZ2h0Qm9yZGVySW5wdXQnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy50ZW1wbGF0ZSA9ICQoJyN0ZW1wbGF0ZUNhbGMnKS5odG1sKCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfLnRlbXBsYXRlKCQoJyN0ZW1wbGF0ZUNhbGMnKS5odG1sKCkpO1xuXG4gICAgICAgIHRoaXMubW9kZWwub24oJ2NoYW5nZScsIHRoaXMuY2hhbmdlLCB0aGlzKTtcblxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlbmRlcmVkID0gdGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuICAgICAgICB0aGlzLiRlbC5odG1sKHJlbmRlcmVkKTtcblxuICAgICAgICAvLyB0aGlzLmNoYW5nZVBlcmlvZFJhbmdlKCk7XG4gICAgICAgIHRoaXMuY2hhbmdlQ2FsYygneW91LWdldCcsIDIpO1xuICAgICAgICB0aGlzLmNoYW5nZSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0YjQsNCx0LvQvtC90LBcbiAgICBjaGFuZ2VDYWxjOiBmdW5jdGlvbiAoc2VjdGlvbiwgbikge1xuICAgICAgIGxldCBhbGxCbG9jayA9ICcjJyArIHNlY3Rpb247XG5cbiAgICAgICAgLy8g0JTQu9GPINGB0YPQvNC80YtcbiAgICAgICAgLy8gLS0g0L/QvtC70Y9cbiAgICAgICAgJChhbGxCbG9jayArICcgaW5wdXRbbmFtZT1zdW1dJykuYXR0cignaWQnLCAnZm9jdXNJbnBTdW0nICsgbik7XG4gICAgICAgICQoYWxsQmxvY2sgKyAnIC5hZi1pbnB1dC0tc3VtIGxhYmVsLmpzLXN5bWJfaW5wJykuYXR0cignZm9yJywgJ2ZvY3VzSW5wU3VtJyArIG4pO1xuICAgICAgICAvLyAtLSDQv9C+0LvRg9C30L7QvdC+0LpcbiAgICAgICAgJChhbGxCbG9jayArICcgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKS5hdHRyKCdpZCcsICdzdW0nICsgbik7XG5cbiAgICAgICAgLy8g0JTQu9GPINC/0LXRgNC40L7QtNCwXG4gICAgICAgIC8vIC0tINC/0L7Qu9GPXG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W25hbWU9cGVyaW9kXScpLmF0dHIoJ2lkJywgJ2ZvY3VzSW5wUGVyaW9kJyArIG4pO1xuICAgICAgICAkKGFsbEJsb2NrICsgJyAuYWYtaW5wdXQtLXBlcmlvZCBsYWJlbC5qcy1zeW1iX2lucCcpLmF0dHIoJ2ZvcicsICdmb2N1c0lucFBlcmlvZCcgKyBuKTtcbiAgICAgICAgLy8gLS0g0L/QvtC70YPQt9C+0L3QvtC6XG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJykuYXR0cignaWQnLCAncGVyaW9kJyArIG4pO1xuXG4gICAgfSxcblxuICAgIGNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5tb2RlbC5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgcGVyaW9kID0gdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LUg0YHRg9C80LzRi1xuICAgICAgICAgICAgZmllbGRTdW0gPSAkKCdpbnB1dFtuYW1lPXN1bV0nKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C1INGB0YDQvtC60LBcbiAgICAgICAgICAgIGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICAgICAgLy8g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDQt9C90LDRh9C10L3QuNC1INGB0YPQvNC80Ysg0LfQsNC50LzQsFxuICAgICAgICAkKCcuanMtb3V0LXN1bScpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIoc3VtKSArICcg4oK9Jyk7XG5cbiAgICAgICAgLy8gLS0g0LIg0L/QvtC70LUgY9GD0LzQvNGLXG4gICAgICAgICQoZmllbGRTdW0pLnZhbChzdW0pO1xuICAgICAgICAvLyAtLSDQsiDQv9C+0LvQtSDQv9C10YDQuNC+0LRcbiAgICAgICAgJChmaWVsZFBlcmlvZCkudmFsKHBlcmlvZCk7XG5cbiAgICAgICAgaWYgKHN1bSA+IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5wcmludFJlc3VsdHMoKTtcblxuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDEpJykuaHRtbCgnNCDQvdC10LTQtdC70LgnKTtcblxuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDIpJykuaHRtbCgnMTIg0L3QtdC00LXQu9GMJyk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnbWF4UGVyaW9kJywgMTIpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ21pblBlcmlvZCcsIDQpO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgncGVyaW9kJykgPT0gNCA/ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpID09IDQgPyAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2QyXScpLmh0bWwoJ9C90LXQtNC10LvQuCcpIDogJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5pbmZvLWJhY2sgc3BhbicpLmh0bWwoJ9CS0L7Qt9Cy0YDQsNGJ0LDQtdGC0LUnKTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtX2JhY2snKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHRoaXMubW9kZWwuY2FsY3VsYXRlTG9hblN1bShzdW0sIHBlcmlvZCkpICsgJyDigr0nKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzgg0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgyKScpLmh0bWwoJzMwINC00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZDJdJykuaHRtbCgn0LTQvdC10LknKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdtYXhQZXJpb2QnLCAzMCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnbWluUGVyaW9kJywgOCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAkKCQodGhpcy5zdW1SYW5nZXMpWzBdKS52YWwoJCgkKHRoaXMuc3VtUmFuZ2VzKVsxXSkudmFsKCkpO1xuICAgICAgICAkKHRoaXMuc3VtUmFuZ2VzKS52YWwoc3VtKTtcbiAgICAgICAgJCh0aGlzLnBlcmlvZFJhbmdlcykudmFsKHBlcmlvZCk7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwICh0eXBlOiBzdW0gfHwgcGVyaW9kKVxuICAgIGNoYW5nZVJhbmdlU2xpZGVyOiBmdW5jdGlvbiAodHlwZSwgbWF4LCBtaW4pIHtcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXQuanMtc2xpZGVyLS0nICsgdHlwZSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJChyYW5nZVtpXSlcbiAgICAgICAgICAgICAgICAuYXR0cignbWF4JywgbWF4KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdtaW4nLCBtaW4pXG4gICAgICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICgkKHJhbmdlW2ldKS52YWwoKSAtICQocmFuZ2VbaV0pLmF0dHIoJ21pbicpKSAqIDEwMCAvICgkKHJhbmdlW2ldKS5hdHRyKCdtYXgnKSAtICQocmFuZ2VbaV0pLmF0dHIoJ21pbicpKSArICclIDEwMCUnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHR5cGUsICQocmFuZ2VbaV0pLnZhbCgpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlU3VtUmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1pbiA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgbWF4ID0gJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWF4Jyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgbWF4LCBtaW4pO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgnc3VtJykgPiBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgNSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYW5nZVBlcmlvZFJhbmdlKCk7XG4gICAgfSxcblxuICAgIC8vIC0tINCS0YvQsdC+0YAg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9GPXG4gICAgY2hhbmdlU3VtRmllbGQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJyk7XG5cbiAgICAgICAgdmFyICRpbnB1dCA9ICQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgdmFyIHN1bSA9IHBhcnNlSW50KCRpbnB1dC52YWwoKSkgfHwgNjAwMDtcbiAgICAgICAgbGV0IHBvdyA9IE1hdGguY2VpbChzdW0vMTAwKSAqMTAwO1xuICAgICAgICBpZiggKHBvdyAtIHN1bSkgPiA1MCl7XG4gICAgICAgICAgICBzdW0gPSBwb3cgLSAxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW0gPSBwb3c7XG4gICAgICAgIH1cbiAgICAgICAgJGlucHV0LnZhbChzdW0pO1xuXG4gICAgICAgIGlmIChzdW0gPiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0d29fd2Vla3MnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgICAgc3VtOiBBcHBDb25zdGFudHMudGFycmlmc1swXS5taW5fc3VtLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdvbmNlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21heCcpLCAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtaW4nKSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdzdW0nKSA+IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdwZXJpb2QnLCA1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hhbmdlUGVyaW9kUmFuZ2UoKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgdGhpcy5tb2RlbC5nZXQoJ21heFBlcmlvZCcpLCB0aGlzLm1vZGVsLmdldCgnbWluUGVyaW9kJykpO1xuXG4gICAgICAgICQoJ2lucHV0W3R5cGU9cmFuZ2VdI3BlcmlvZCcpLmNzcygnYmFja2dyb3VuZFNpemUnLCAkKCdpbnB1dFt0eXBlPXJhbmdlXSNwZXJpb2QyJykuY3NzKCdiYWNrZ3JvdW5kU2l6ZScpKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0L/QvtC70LfRg9C90L7QulxuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCcpO1xuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgLy8g0KHRgtC40LvQuCDQtNC70Y8g0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHJhbmdlLnZhbCgpIC0gcmFuZ2UuYXR0cignbWluJykpICogMTAwIC8gKHJhbmdlLmF0dHIoJ21heCcpIC0gcmFuZ2UuYXR0cignbWluJykpICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgICQoJy5qcy1wZXJpb2QnKS52YWwodGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpKTtcbiAgICB9LFxuXG4gICAgbGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyMxOGE0ZDInXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmZMaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnI2IwYmFjNSdcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XSxcbiAgICBmZWVJc3N1ZTogMC4wNSxcbiAgICBmYWN0b3JNYXg6IDAuMTUsXG4gICAgZmFjdG9yTWluOiAwLjAxLFxuICAgIHN1bUJvcmRlcjogMzAwMDAsXG4gICAgRkVFX0lTU1VFOiAwLjA1LCAvLyDQmtC+0LzQvNC40YHQuNGPINC30LAg0LLRi9C00LDRh9GDXG4gICAgUEVSQ0VOVF9TVEFOREFSVDogMC4wMTUsIC8vINCh0YLQsNC90LTQsNGA0YLQvdGL0Lkg0L/RgNC+0YbQtdC90YIgKNCyINC00LXQvdGMKVxuICAgIFBFUkNFTlRfREVMQVk6IDAuMDE1LCAvLyDQn9GA0L7RhtC10L3RgiDQsiDRgdC70YPRh9Cw0LUg0L/RgNC+0YHRgNC+0YfQutC4ICjQsiDQtNC10L3RjClcbiAgICBGSU5FX0RFTEFZOiAxMDAwLjAwLCAvLyDQnNCw0LrRgdC40LzQsNC70YzQvdCw0Y8g0YHRg9C80LzQsCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7Qs9C+INGI0YLRgNCw0YTQsCDQt9CwINC/0YDQvtGB0YDQvtGH0LrRg1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBDb25zdGFudHM7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDguMTIuMTYuXG4gKi9cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICAvLyBAVE9ETzogdXJsXG4gICAgYmFzZVVybDogJycsXG5cbiAgICAvLyBhamF4XG4gICAgYWpheFdyYXBwZXI6ICh1cmwsIHR5cGUsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgPT4ge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCAnUE9TVCc7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBzdWNjZXNzQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkge307XG4gICAgICAgIGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVybXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEFwcEhlbHBlcnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvckNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDQpNC40L3QsNC70YzQvdCw0Y8g0YHRg9C80LzQsFxuICAgIHByaW50UmVzdWx0czogKCkgPT4ge1xuICAgICAgICBsZXQgc3VtID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyk7XG4gICAgICAgIGxldCBkYXlzID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgbGV0IHBheW1ldGhvZDtcblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikgcGF5bWV0aG9kID0gJ9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0ZHQtiDQvdCwINGB0YPQvNC80YMnO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheXMgKj0gNztcbiAgICAgICAgICAgIHBheW1ldGhvZCA9IChBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSArICcgJyArIEFwcEhlbHBlcnMuZ2V0Q2FzZShBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSwgJ9C/0LvQsNGC0ZHQticsICfQv9C70LDRgtC10LbQsCcsICfQv9C70LDRgtC10LbQtdC5JykpO1xuICAgICAgICB9XG4gICAgICAgIHN1bSA9IEFwcEhlbHBlcnMuZXN0aW1hdGVSZXR1cm5TdW0oc3VtLCBkYXlzKTtcblxuICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKHBheW1ldGhvZCsnINC/0L4nKTtcblxuICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVBbm5QZXJpb2RzOiAoZGF5cykgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGRheXMgLyAxNCk7XG4gICAgfSxcblxuICAgIGdldENhc2U6IChfbnVtYmVyLCBfY2FzZTEsIF9jYXNlMiwgX2Nhc2UzKSA9PiB7XG4gICAgICAgIHZhciBiYXNlID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwMCkgKiAxMDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGJhc2UgPiA5ICYmIGJhc2UgPCAyMCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gX2Nhc2UzO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVtYWluZGVyID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwKSAqIDEwO1xuXG4gICAgICAgICAgICBpZiAoMSA9PSByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKDAgPCByZW1haW5kZXIgJiYgNSA+IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UyO1xuICAgICAgICAgICAgZWxzZSByZXN1bHQgPSBfY2FzZTM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZVJldHVyblN1bTogKHN1bSwgZGF5cykgPT4ge1xuICAgICAgICBjb25zdCBmZWVJc3N1ZSA9IEFwcENvbnN0YW50cy5mZWVJc3N1ZTtcbiAgICAgICAgY29uc3QgZmFjdG9yTWF4ID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1heDtcbiAgICAgICAgY29uc3QgZmFjdG9yTWluID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1pbjtcblxuICAgICAgICBzdW0gPSBOdW1iZXIoc3VtKTtcbiAgICAgICAgbGV0IHBheWJhY2sgPSBNYXRoLmNlaWwoc3VtICogZmVlSXNzdWUpO1xuICAgICAgICAvL9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0LXQtlxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogZGF5cyArIDEpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogMTQ7XG4gICAgICAgICAgICBsZXQgYW5uX3BlcmlvZHMgPSBkYXlzIC8gMTQ7XG4gICAgICAgICAgICBsZXQgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykgLSAxKTtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiBhbm51aXR5KTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGE0L7RgNC8XG4gICAgZm9ybVZhbGlkYXRlOiBmdW5jdGlvbiAoZm9ybUlkKSB7XG4gICAgICAgIGxldCBmb3JtID0gJyMnICsgZm9ybUlkO1xuICAgICAgICBsZXQgZmllbGQgPSAkKGZvcm0gKyAnIFtkYXRhLXR5cGU9ZmllbGRdJyk7XG4gICAgICAgIGxldCBlcnIgPSAkKGZvcm0gKyAnIC5ibG9jay1lcnInKTtcbiAgICAgICAgbGV0IGJ0biA9ICQoZm9ybSArICcgYS5hYl9idXR0b24nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChmaWVsZFtpXSkudmFsKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoZmllbGRbaV0pLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChmaWVsZFtpXSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoZm9ybSArICcgLmVyci1maWVsZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAkKGJ0bikucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAkKGVycikuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChidG4pLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcEhlbHBlcnM7Il19
