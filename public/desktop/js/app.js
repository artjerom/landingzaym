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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjtBQVFKLHVDQUEyQiwwQkFSdkI7QUFTSix5Q0FBNkIsNEJBVHpCOztBQVdKO0FBQ0EscUNBQXlCLGNBWnJCOztBQWNKO0FBQ0EsbUNBQXVCLFdBZm5CO0FBZ0JKLGtDQUFzQixXQWhCbEI7O0FBa0JKO0FBQ0Esc0NBQTBCLGdCQW5CdEI7QUFvQko7QUFDQSxzQ0FBMEIsZ0JBckJ0Qjs7QUF1Qko7QUFDQSx1Q0FBMkIsY0F4QnZCO0FBeUJKLG9DQUF3QixlQXpC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UUFBSixHQUFlLE9BQWYsQ0FBdUIsNkJBQXZCLEVBQXNELEtBQXRELENBQVA7QUFDSCxLQXpGWTs7QUEyRmI7QUFDQSxrQkFBYyxzQkFBVSxNQUFWLEVBQWtCO0FBQzVCLFlBQUksT0FBTyxNQUFNLE1BQWpCO0FBQ0EsWUFBSSxRQUFRLEVBQUUsT0FBTyxvQkFBVCxDQUFaO0FBQ0EsWUFBSSxNQUFNLEVBQUUsT0FBTyxhQUFULENBQVY7QUFDQSxZQUFJLE1BQU0sRUFBRSxPQUFPLGNBQVQsQ0FBVjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNuQyxnQkFBSSxFQUFFLE1BQU0sQ0FBTixDQUFGLEVBQVksR0FBWixNQUFxQixDQUF6QixFQUE0QjtBQUN4QixrQkFBRSxNQUFNLENBQU4sQ0FBRixFQUFZLFFBQVosQ0FBcUIsV0FBckI7QUFDSCxhQUZELE1BRU87QUFDSCxrQkFBRSxNQUFNLENBQU4sQ0FBRixFQUFZLFdBQVosQ0FBd0IsV0FBeEI7QUFDSDtBQUNKOztBQUVELFlBQUksRUFBRSxPQUFPLGFBQVQsRUFBd0IsTUFBeEIsSUFBa0MsQ0FBdEMsRUFBeUM7QUFDckMsY0FBRSxHQUFGLEVBQU8sV0FBUCxDQUFtQixhQUFuQjtBQUNBLGNBQUUsR0FBRixFQUFPLElBQVA7QUFDSCxTQUhELE1BR087QUFDSCxjQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGFBQWhCO0FBQ0EsY0FBRSxHQUFGLEVBQU8sSUFBUDtBQUNIO0FBRUo7QUFsSFksQ0FBakIsQyxDQUxBOzs7a0JBMEhlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JWaWV3IGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yVmlldyc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAubG9hbkNhbGN1bGF0b3IgPSBuZXcgTG9hbkNhbGN1bGF0b3JNb2RlbCh7XG5cbiAgICB9KTtcbiAgICBhcHAubG9hbkNhbGN1bGF0b3JWaWV3ID0gbmV3IExvYW5DYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAubG9hbkNhbGN1bGF0b3IsXG4gICAgICAgIGVsOiAnZm9ybS5jYWxjJ1xuICAgIH0pO1xuXG4gICAgbGV0IEFwcE1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgZGVmYXVsdHM6IHt9XG4gICAgfSk7XG5cbiAgICBhcHAubW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblxuICAgIHZhciBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2JvZHknLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgLy8g0KHQv9C+0YHQvtCxINCy0YvQtNCw0YfQuFxuICAgICAgICAgICAgJ2NsaWNrIC5tZXRob2QnOiAnY2hhbmdlTWV0aG9kJyxcblxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9C/0L7Rh9C10LzRgyDQvNGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tYWJvdXQnOiAnY2hhbmdlQWJvdXRUYWInLFxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9CS0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLXF1ZXN0aW9ucyc6ICdjaGFuZ2VRdWVzdGlvblRhYicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzX3RhYi1xdWVzdC1nZXQnOiAnY2hhbmdlUXVlc3Rpb25UYWJHZXRaYXltJyxcbiAgICAgICAgICAgICdjbGljayAuanNfdGFiLXF1ZXN0LXJlcGF5JzogJ2NoYW5nZVF1ZXN0aW9uVGFiUmVwYXlaYXltJyxcblxuICAgICAgICAgICAgLy8g0KDQsNGB0LrRgNGL0YLRjCDQutC+0LzQtdC90YLRi1xuICAgICAgICAgICAgJ2NsaWNrIC51cGRhdGUtY29tbWVudCc6ICdzaG93Q29tbWVudHMnLFxuXG4gICAgICAgICAgICAvLyDQodC70LDQudC00LXRgFxuICAgICAgICAgICAgJ2NsaWNrIC5hcnJvdy0tcmlnaHQnOiAnbmV4dFNsaWRlJyxcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLWxlZnQnOiAncHJldlNsaWRlJyxcblxuICAgICAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fcmVnaXN0ZXInOiAnaGFuZGxlUmVnaXN0ZXInLFxuICAgICAgICAgICAgLy8g0J7QsdGA0LDRgtC90LDRjyDRgdCy0Y/Qt9GMXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWJ0bl9mZWVkYmFjayc6ICdoYW5kbGVGZWVkYmFjaycsXG5cbiAgICAgICAgICAgIC8vINCU0LvRjyDQv9C+0L/QsNC/0L7QslxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1zaG93X3JlZ2lzdGVyJzogJ3Nob3dSZWdpc3RlcicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXBheV9tZXRob2QnOiAnc2hvd1BheU1ldGhvZCcsXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bl9mZWVkYmFjayc6ICdzaG93RmVlZGJhY2snLFxuICAgICAgICAgICAgJ2NoYW5nZSAucG9wdXAnOiAnY2hhbmdlUG9wdXMnLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1jbG9zZV9wb3B1cCc6ICdjbG9zZVBvcHVwJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJyN1c2VyUGhvbmUnKS5tYXNrKFwiKzcgKDk5OSkgOTk5LTk5OTlcIik7XG5cbiAgICAgICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LLRgNC10LzRj1xuICAgICAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpICsgMTUpO1xuXG4gICAgICAgICAgICBsZXQgcmVzSG91ciA9IGRhdGUuZ2V0SG91cnMoKSxcbiAgICAgICAgICAgICAgICByZXNNaW4gPSBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICAgICAgaWYgKGRhdGUuZ2V0SG91cnMoKS50b1N0cmluZygpLmxlbmd0aCA9PSAxKSByZXNIb3VyID0gJzAnICsgZGF0ZS5nZXRIb3VycygpO1xuXG4gICAgICAgICAgICBpZiAoZGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5sZW5ndGggPT0gMSkgcmVzTWluID0gJzAnICsgZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGxldCByZXMgPSByZXNIb3VyICsgJzonICsgcmVzTWluO1xuXG4gICAgICAgICAgICAkKCcueW91LWxvYW4gLmpzLWxvYW4nKS5odG1sKCcgJyArIHJlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JLRi9Cx0L7RgCDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y9cbiAgICAgICAgY2hhbmdlTWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcubWV0aG9kJykudG9nZ2xlQ2xhc3MoJ21ldGhvZC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIC8vIC0tINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0YLQtdC60YHRglxuICAgICAgICAgICAgJCgnLmpzLXBheV9tZXRob2QnKS5odG1sKCQoJy5tZXRob2QtLWFjdGl2ZScpLmZpbmQoJy5qcy10ZXh0X21ldGhvZCcpLmh0bWwoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGC0LDQsdC+0LIgKNC00L7Qu9C20L3QviDRgNCw0LHQvtGC0LDRgtGMINC4INC90LAg0LTQtdGB0LrRgtC+0L/QtSlcbiAgICAgICAgY2hhbmdlQWJvdXRUYWI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuYnRuLWFib3V0LS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdidG4tYWJvdXQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICAkKCcuanMtY2hhbmdlLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjYWJvdXRUYWItJyArIHRhYklkKS5hZGRDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtLWFjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIC0tINCy0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRi1xuICAgICAgICBjaGFuZ2VRdWVzdGlvblRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5idG4tcXVlc3Rpb25zLS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdidG4tcXVlc3Rpb25zLS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50LXF1ZXN0JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI1F1ZXN0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLS0tINCy0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiyAo0J/QvtC70YPRh9C10L3QuNC1INC30LDQudC80LApXG4gICAgICAgIGNoYW5nZVF1ZXN0aW9uVGFiR2V0WmF5bTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5qc190YWItcXVlc3QtZ2V0LS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdqc190YWItcXVlc3QtZ2V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzX2dldC16YXltLXRhYi1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzX2dldC16YXltLXRhYi1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI1F1ZXN0R2V0WmF5bVRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqc19nZXQtemF5bS10YWItY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gLS0tLSDQktC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YsgKNCf0L7Qs9Cw0YjQtdC90LjQtSDQt9Cw0LnQvNCwKVxuICAgICAgICBjaGFuZ2VRdWVzdGlvblRhYlJlcGF5WmF5bTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5qc190YWItcXVlc3QtcmVwYXktLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2pzX3RhYi1xdWVzdC1yZXBheS0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qc19yZXBheS16YXltLXRhYi1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzX3JlcGF5LXpheW0tdGFiLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjUXVlc3RSZXBheVpheW1UYWItJyArIHRhYklkKS5hZGRDbGFzcygnanNfcmVwYXktemF5bS10YWItY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd0NvbW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuaWNvX3VwZGF0ZS1jb21tZW50cycpLmFkZENsYXNzKCdpY29fdXBkYXRlLWNvbW1lbnRzLS1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5qcy1yb3ctY29tbWVudCcpLnNsaWRlRG93big1MDApLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2ZsZXgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnLnJvdy1jb21tZW50LWhpZGUnKS5zbGlkZVVwKDY1MCk7XG4gICAgICAgICAgICAgICAgJCgnLnVwZGF0ZS1jb21tZW50JykuaGlkZSgxMDApO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KHQu9C10LTRg9GO0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgbmV4dFNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPD0gLTU0MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgLSAyNzAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyDQn9GA0LXQtNGL0LTRg9GJ0LjQuSDRgdC70LDQudC0XG4gICAgICAgIHByZXZTbGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5jb250ZW50LXNsaWRlcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnLjNzIGVhc2Utb3V0JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodmFsdWUpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAtNTQwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSArIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICBoYW5kbGVSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHBob25lID0gJCgnI3VzZXJQaG9uZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3MgPSAkKCcjdXNlclBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICByZVBhc3MgPSAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBwZXJpb2QgPSBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKTtcblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCXG5cbiAgICAgICAgICAgIGlmIChwYXNzICE9PSByZVBhc3MpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9GMINC60L7RgNC+0YLQutC40LlcblxuICAgICAgICAgICAgaWYgKHBhc3MubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgJCgnI3VzZXJQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFzcy5sZW5ndGggPj0gNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJCgnI3VzZXJQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0YLQtdC70LXRhNC+0L3QsFxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoICE9IDE3KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZVBhc3MgJiYgcGFzcy5sZW5ndGggPj0gNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCgnI2FncmVlbWVudCcpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItYWdyZWVtZW50JykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1hZ3JlZW1lbnQnKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogcGhvbmUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3MsXG4gICAgICAgICAgICAgICAgcmVQYXNzd29yZDogcmVQYXNzLFxuICAgICAgICAgICAgICAgIHN1bTogYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyksXG4gICAgICAgICAgICAgICAgYWdyZWVtZW50OiAkKCcjYWdyZWVtZW50JykucHJvcCgnY2hlY2tlZCcpLFxuICAgICAgICAgICAgICAgIHBlcmlvZDogYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJykgPiBBcHBDb25zdGFudHMuc3VtQm9yZGVyID8gcGVyaW9kICogNyA6IHBlcmlvZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJCgnI3VzZXJSZXBlYXRQYXNzJykudmFsKCkgIT09ICQoJyN1c2VyUGFzcycpLnZhbCgpID8gJCgnI3VzZXJSZXBlYXRQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpIDogJCgnI3VzZXJSZXBlYXRQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgJCgnI3VzZXJQYXNzJykudmFsKCkubGVuZ3RoIDwgNiA/ICQoJyN1c2VyUGFzcycpLmFkZENsYXNzKCdlcnItZmllbGQnKSA6ICQoJyN1c2VyUGFzcycpLnJlbW92ZUNsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIEFwcEhlbHBlcnMuZm9ybVZhbGlkYXRlKCdqc1JlZ2lzdGVyJyk7XG5cbiAgICAgICAgICAgIC8vINCX0LDQv9GA0L7RgVxuICAgICAgICAgICAgaWYgKCEkKCcuanMtYnRuX3JlZ2lzdGVyJykuaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgaGFuZGxlRmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGVtZSA9ICQoJy5qcy1mZWVkLXNlbGVjdF90aGVtZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICQoJy5qcy1mZWVkLWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICQoJy5qcy1mZWVkLW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgnanNGZWVkYmFjaycpO1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9mZWVkYmFjaycpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgICAgICAgc2hvd1JlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLXJlZ2lzdGVyJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINCy0YvQsdC+0YDQvtC8INGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBzaG93UGF5TWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLW1ldGhvZCcpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30YzRjlxuICAgICAgICBzaG93RmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tZmVlZGJhY2snKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCX0LDQutGA0YvRgtGMINC/0L7Qv9Cw0L9cbiAgICAgICAgY2xvc2VQb3B1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwJykuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgYXBwLnZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgLy8g0JfQvdCw0YfQtdC90LjRjyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHN1bTogNjAwMCxcbiAgICAgICAgcGVyaW9kOiAxMixcbiAgICAgICAgdHlwZTogJ29uY2UnLCAvLyBcIm9uY2VcIiBvciBcInR3b193ZWVrc1wiXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dQZXJpb2Q6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgbWF4UGVyaW9kOiAzMCxcbiAgICAgICAgbWluUGVyaW9kOiA4LFxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG5cbiAgICBzdW1SYW5nZXM6ICdpbnB1dC5qcy1zbGlkZXItLXN1bScsXG4gICAgcGVyaW9kUmFuZ2VzOiAnaW5wdXQuanMtc2xpZGVyLS1wZXJpb2QnLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bSc6ICdjaGFuZ2VTdW1SYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXN1bSc6ICdjaGFuZ2VTdW1GaWVsZCcsXG5cbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJzogJ2NoYW5nZVBlcmlvZFJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtcGVyaW9kJzogJ2NoYW5nZVBlcmlvZEZpZWxkJyxcblxuICAgICAgICAvLyDQlNC70Y8g0L/QvtC70LXQuSDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LBcbiAgICAgICAgJ2ZvY3VzIC5yYW5nZV9maWVsZCc6ICdsaWdodEJvcmRlcklucHV0JyxcbiAgICAgICAgJ2ZvY3Vzb3V0IC5yYW5nZV9maWVsZCc6ICdvZmZMaWdodEJvcmRlcklucHV0J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRoaXMudGVtcGxhdGUgPSAkKCcjdGVtcGxhdGVDYWxjJykuaHRtbCgpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdGVtcGxhdGVDYWxjJykuaHRtbCgpKTtcblxuICAgICAgICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZW5kZXJlZCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy4kZWwuaHRtbChyZW5kZXJlZCk7XG5cbiAgICAgICAgLy8gdGhpcy5jaGFuZ2VQZXJpb2RSYW5nZSgpO1xuICAgICAgICB0aGlzLmNoYW5nZUNhbGMoJ3lvdS1nZXQnLCAyKTtcbiAgICAgICAgdGhpcy5jaGFuZ2UoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INGI0LDQsdC70L7QvdCwXG4gICAgY2hhbmdlQ2FsYzogZnVuY3Rpb24gKHNlY3Rpb24sIG4pIHtcbiAgICAgICBsZXQgYWxsQmxvY2sgPSAnIycgKyBzZWN0aW9uO1xuXG4gICAgICAgIC8vINCU0LvRjyDRgdGD0LzQvNGLXG4gICAgICAgIC8vIC0tINC/0L7Qu9GPXG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W25hbWU9c3VtXScpLmF0dHIoJ2lkJywgJ2ZvY3VzSW5wU3VtJyArIG4pO1xuICAgICAgICAkKGFsbEJsb2NrICsgJyAuYWYtaW5wdXQtLXN1bSBsYWJlbC5qcy1zeW1iX2lucCcpLmF0dHIoJ2ZvcicsICdmb2N1c0lucFN1bScgKyBuKTtcbiAgICAgICAgLy8gLS0g0L/QvtC70YPQt9C+0L3QvtC6XG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJykuYXR0cignaWQnLCAnc3VtJyArIG4pO1xuXG4gICAgICAgIC8vINCU0LvRjyDQv9C10YDQuNC+0LTQsFxuICAgICAgICAvLyAtLSDQv9C+0LvRj1xuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFtuYW1lPXBlcmlvZF0nKS5hdHRyKCdpZCcsICdmb2N1c0lucFBlcmlvZCcgKyBuKTtcbiAgICAgICAgJChhbGxCbG9jayArICcgLmFmLWlucHV0LS1wZXJpb2QgbGFiZWwuanMtc3ltYl9pbnAnKS5hdHRyKCdmb3InLCAnZm9jdXNJbnBQZXJpb2QnICsgbik7XG4gICAgICAgIC8vIC0tINC/0L7Qu9GD0LfQvtC90L7QulxuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCcpLmF0dHIoJ2lkJywgJ3BlcmlvZCcgKyBuKTtcblxuICAgIH0sXG5cbiAgICBjaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMubW9kZWwuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgIHBlcmlvZCA9IHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C1INGB0YPQvNC80YtcbiAgICAgICAgICAgIGZpZWxkU3VtID0gJCgnaW5wdXRbbmFtZT1zdW1dJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQtSDRgdGA0L7QutCwXG4gICAgICAgICAgICBmaWVsZFBlcmlvZCA9ICQoJ2lucHV0W25hbWU9cGVyaW9kXScpO1xuXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtSDRgdGD0LzQvNGLINC30LDQudC80LBcbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHN1bSkgKyAnIOKCvScpO1xuXG4gICAgICAgIC8vIC0tINCyINC/0L7Qu9C1IGPRg9C80LzRi1xuICAgICAgICAkKGZpZWxkU3VtKS52YWwoc3VtKTtcbiAgICAgICAgLy8gLS0g0LIg0L/QvtC70LUg0L/QtdGA0LjQvtC0XG4gICAgICAgICQoZmllbGRQZXJpb2QpLnZhbChwZXJpb2QpO1xuXG4gICAgICAgIGlmIChzdW0gPiBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSB7XG5cbiAgICAgICAgICAgIEFwcEhlbHBlcnMucHJpbnRSZXN1bHRzKCk7XG5cbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzQg0L3QtdC00LXQu9C4Jyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgyKScpLmh0bWwoJzEyINC90LXQtNC10LvRjCcpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ21heFBlcmlvZCcsIDEyKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdtaW5QZXJpb2QnLCA0KTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpID09IDQgPyAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0L3QtdC00LXQu9C4JykgOiAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0L3QtdC00LXQu9GMJyk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSA9PSA0ID8gJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZDJdJykuaHRtbCgn0L3QtdC00LXQu9GMJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKCfQktC+0LfQstGA0LDRidCw0LXRgtC1Jyk7XG4gICAgICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcih0aGlzLm1vZGVsLmNhbGN1bGF0ZUxvYW5TdW0oc3VtLCBwZXJpb2QpKSArICcg4oK9Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMSknKS5odG1sKCc4INC00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMiknKS5odG1sKCczMCDQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kXScpLmh0bWwoJ9C00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2QyXScpLmh0bWwoJ9C00L3QtdC5Jyk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnbWF4UGVyaW9kJywgMzApO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ21pblBlcmlvZCcsIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gJCgkKHRoaXMuc3VtUmFuZ2VzKVswXSkudmFsKCQoJCh0aGlzLnN1bVJhbmdlcylbMV0pLnZhbCgpKTtcbiAgICAgICAgJCh0aGlzLnN1bVJhbmdlcykudmFsKHN1bSk7XG4gICAgICAgICQodGhpcy5wZXJpb2RSYW5nZXMpLnZhbChwZXJpb2QpO1xuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0L/QvtC70LfRg9C90LrQsCAodHlwZTogc3VtIHx8IHBlcmlvZClcbiAgICBjaGFuZ2VSYW5nZVNsaWRlcjogZnVuY3Rpb24gKHR5cGUsIG1heCwgbWluKSB7XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0LmpzLXNsaWRlci0tJyArIHR5cGUpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQocmFuZ2VbaV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ21heCcsIG1heClcbiAgICAgICAgICAgICAgICAuYXR0cignbWluJywgbWluKVxuICAgICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAoJChyYW5nZVtpXSkudmFsKCkgLSAkKHJhbmdlW2ldKS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAoJChyYW5nZVtpXSkuYXR0cignbWF4JykgLSAkKHJhbmdlW2ldKS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh0eXBlLCAkKHJhbmdlW2ldKS52YWwoKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsIG1heCwgbWluKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlbC5nZXQoJ3N1bScpID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsIDUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VQZXJpb2RSYW5nZSgpO1xuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVN1bUZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bScpO1xuXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIHZhciBzdW0gPSBwYXJzZUludCgkaW5wdXQudmFsKCkpIHx8IDYwMDA7XG4gICAgICAgIGxldCBwb3cgPSBNYXRoLmNlaWwoc3VtLzEwMCkgKjEwMDtcbiAgICAgICAgaWYoIChwb3cgLSBzdW0pID4gNTApe1xuICAgICAgICAgICAgc3VtID0gcG93IC0gMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VtID0gcG93O1xuICAgICAgICB9XG4gICAgICAgICRpbnB1dC52YWwoc3VtKTtcblxuICAgICAgICBpZiAoc3VtID4gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3N1bScsIEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0pO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIHN1bTogQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSxcbiAgICAgICAgICAgICAgICB0eXBlOiAndHdvX3dlZWtzJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWluX3N1bSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIHN1bTogQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWluX3N1bSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnb25jZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdzdW0nLCAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWluJykpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgnc3VtJykgPiBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgNSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYW5nZVBlcmlvZFJhbmdlKCk7XG4gICAgfSxcblxuICAgIC8vINCS0YvQsdC+0YAg0YHRgNC+0LrQsCDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9C30YPQvdC60LBcbiAgICBjaGFuZ2VQZXJpb2RSYW5nZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIHRoaXMubW9kZWwuZ2V0KCdtYXhQZXJpb2QnKSwgdGhpcy5tb2RlbC5nZXQoJ21pblBlcmlvZCcpKTtcblxuICAgICAgICAkKCdpbnB1dFt0eXBlPXJhbmdlXSNwZXJpb2QnKS5jc3MoJ2JhY2tncm91bmRTaXplJywgJCgnaW5wdXRbdHlwZT1yYW5nZV0jcGVyaW9kMicpLmNzcygnYmFja2dyb3VuZFNpemUnKSk7XG5cbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VQZXJpb2RGaWVsZDogZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnKTtcblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmFuZ2UudmFsKCkgPiAxMDAwMCkge1xuICAgICAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQocmdiKDI1NCwgMTUwLCAzOSksIHJnYigyNTQsIDE1MCwgMzkpKSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsIGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAkKCcuanMtcGVyaW9kJykudmFsKHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSk7XG4gICAgfSxcblxuICAgIGxpZ2h0Qm9yZGVySW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICQoZS50YXJnZXQpLm5leHQoJ2xhYmVsJykuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXJDb2xvcic6ICcjMThhNGQyJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgb2ZmTGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyNiMGJhYzUnXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvclZpZXc7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cbnZhciBBcHBDb25zdGFudHMgPSB7XG4gICAgdGFycmlmczogW3tcbiAgICAgICAgZ3JhZGVfaWQ6IDEsXG4gICAgICAgIG5hbWU6ICfQntCx0YvRh9C90YvQuScsXG4gICAgICAgIG1pbl9saW1pdDogMCxcbiAgICAgICAgbWF4X2xpbWl0OiAyOTk5OSxcbiAgICAgICAgbWluX3N1bTogMTUwMCxcbiAgICAgICAgbWF4X3N1bTogMjk5OTksXG4gICAgICAgIHBlcmNlbnQ6IDAuMDE1LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiA4LFxuICAgICAgICAgICAgbWF4OiAzMFxuICAgICAgICB9LFxuICAgICAgICBwZXJpb2RfdHc6IHtcbiAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgIG1heDogMFxuICAgICAgICB9LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ9C00L7RgdGC0YPQv9C10L0g0LTQu9GPINCy0YHQtdGFINC30LDQtdC80YnQuNC60L7QsidcbiAgICB9LCB7XG4gICAgICAgIGdyYWRlX2lkOiAyLFxuICAgICAgICBuYW1lOiAn0J/RgNC10LzQuNGD0LwnLFxuICAgICAgICBtaW5fbGltaXQ6IDMwMDAwLFxuICAgICAgICBtYXhfbGltaXQ6IDUwMDAwLFxuICAgICAgICBtaW5fc3VtOiAzMDAwMCxcbiAgICAgICAgbWF4X3N1bTogNTAwMDAsXG4gICAgICAgIHBlcmNlbnQ6IDAuMDA0OSxcbiAgICAgICAgcGVyaW9kX29uY2U6IHtcbiAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgIG1heDogMFxuICAgICAgICB9LFxuICAgICAgICBwZXJpb2RfdHc6IHtcbiAgICAgICAgICAgIG1pbjogMjgsXG4gICAgICAgICAgICBtYXg6IDg0XG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LHRg9C00LXRgiDQtNC+0YHRgtGD0L/QtdC9INC/0L7RgdC70LUg0YHQstC+0LXQstGA0LXQvNC10L3QvdC+0LPQviDQv9C+0LPQsNGI0LXQvdC40Y8g0L7QtNC90L7Qs9C+INC30LDQudC80LAnXG4gICAgfV0sXG4gICAgZmVlSXNzdWU6IDAuMDUsXG4gICAgZmFjdG9yTWF4OiAwLjE1LFxuICAgIGZhY3Rvck1pbjogMC4wMSxcbiAgICBzdW1Cb3JkZXI6IDMwMDAwLFxuICAgIEZFRV9JU1NVRTogMC4wNSwgLy8g0JrQvtC80LzQuNGB0LjRjyDQt9CwINCy0YvQtNCw0YfRg1xuICAgIFBFUkNFTlRfU1RBTkRBUlQ6IDAuMDE1LCAvLyDQodGC0LDQvdC00LDRgNGC0L3Ri9C5INC/0YDQvtGG0LXQvdGCICjQsiDQtNC10L3RjClcbiAgICBQRVJDRU5UX0RFTEFZOiAwLjAxNSwgLy8g0J/RgNC+0YbQtdC90YIg0LIg0YHQu9GD0YfQsNC1INC/0YDQvtGB0YDQvtGH0LrQuCAo0LIg0LTQtdC90YwpXG4gICAgRklORV9ERUxBWTogMTAwMC4wMCwgLy8g0JzQsNC60YHQuNC80LDQu9GM0L3QsNGPINGB0YPQvNC80LAg0YTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LPQviDRiNGC0YDQsNGE0LAg0LfQsCDQv9GA0L7RgdGA0L7Rh9C60YNcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA4LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzJztcblxudmFyIEFwcEhlbHBlcnMgPSB7XG4gICAgLy8gQFRPRE86IHVybFxuICAgIGJhc2VVcmw6ICcnLFxuXG4gICAgLy8gYWpheFxuICAgIGFqYXhXcmFwcGVyOiAodXJsLCB0eXBlLCBkYXRhLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spID0+IHtcbiAgICAgICAgdHlwZSA9IHR5cGUgfHwgJ1BPU1QnO1xuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgc3VjY2Vzc0NhbGxiYWNrID0gc3VjY2Vzc0NhbGxiYWNrIHx8IGZ1bmN0aW9uKGRhdGEpIHt9O1xuICAgICAgICBlcnJvckNhbGxiYWNrID0gZXJyb3JDYWxsYmFjayB8fCBmdW5jdGlvbihlcm1zZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJtc2cpO1xuICAgICAgICB9O1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBBcHBIZWxwZXJzLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JDYWxsYmFja1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g0KTQuNC90LDQu9GM0L3QsNGPINGB0YPQvNC80LBcbiAgICBwcmludFJlc3VsdHM6ICgpID0+IHtcbiAgICAgICAgbGV0IHN1bSA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3N1bScpO1xuICAgICAgICBsZXQgZGF5cyA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpO1xuXG4gICAgICAgIGxldCBwYXltZXRob2Q7XG5cbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHBheW1ldGhvZCA9ICfQoNCw0LfQvtCy0YvQuSDQv9C70LDRgtGR0LYg0L3QsCDRgdGD0LzQvNGDJztcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkYXlzICo9IDc7XG4gICAgICAgICAgICBwYXltZXRob2QgPSAoQXBwSGVscGVycy5lc3RpbWF0ZUFublBlcmlvZHMoZGF5cykgKyAnICcgKyBBcHBIZWxwZXJzLmdldENhc2UoQXBwSGVscGVycy5lc3RpbWF0ZUFublBlcmlvZHMoZGF5cyksICfQv9C70LDRgtGR0LYnLCAn0L/Qu9Cw0YLQtdC20LAnLCAn0L/Qu9Cw0YLQtdC20LXQuScpKTtcbiAgICAgICAgfVxuICAgICAgICBzdW0gPSBBcHBIZWxwZXJzLmVzdGltYXRlUmV0dXJuU3VtKHN1bSwgZGF5cyk7XG5cbiAgICAgICAgJCgnLmluZm8tYmFjayBzcGFuJykuaHRtbChwYXltZXRob2QrJyDQv9C+Jyk7XG5cbiAgICAgICAgJCgnLmpzLW91dC1zdW1fYmFjaycpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIoc3VtKSArICcg4oK9Jyk7XG4gICAgfSxcblxuICAgIGVzdGltYXRlQW5uUGVyaW9kczogKGRheXMpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbChkYXlzIC8gMTQpO1xuICAgIH0sXG5cbiAgICBnZXRDYXNlOiAoX251bWJlciwgX2Nhc2UxLCBfY2FzZTIsIF9jYXNlMykgPT4ge1xuICAgICAgICB2YXIgYmFzZSA9IF9udW1iZXIgLSBNYXRoLmZsb29yKF9udW1iZXIgLyAxMDApICogMTAwO1xuICAgICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICAgIGlmIChiYXNlID4gOSAmJiBiYXNlIDwgMjApIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IF9jYXNlMztcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlbWFpbmRlciA9IF9udW1iZXIgLSBNYXRoLmZsb29yKF9udW1iZXIgLyAxMCkgKiAxMDtcblxuICAgICAgICAgICAgaWYgKDEgPT0gcmVtYWluZGVyKSByZXN1bHQgPSBfY2FzZTE7XG4gICAgICAgICAgICBlbHNlIGlmICgwIDwgcmVtYWluZGVyICYmIDUgPiByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMjtcbiAgICAgICAgICAgIGVsc2UgcmVzdWx0ID0gX2Nhc2UzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVSZXR1cm5TdW06IChzdW0sIGRheXMpID0+IHtcbiAgICAgICAgY29uc3QgZmVlSXNzdWUgPSBBcHBDb25zdGFudHMuZmVlSXNzdWU7XG4gICAgICAgIGNvbnN0IGZhY3Rvck1heCA9IEFwcENvbnN0YW50cy5mYWN0b3JNYXg7XG4gICAgICAgIGNvbnN0IGZhY3Rvck1pbiA9IEFwcENvbnN0YW50cy5mYWN0b3JNaW47XG5cbiAgICAgICAgc3VtID0gTnVtYmVyKHN1bSk7XG4gICAgICAgIGxldCBwYXliYWNrID0gTWF0aC5jZWlsKHN1bSAqIGZlZUlzc3VlKTtcbiAgICAgICAgLy/QoNCw0LfQvtCy0YvQuSDQv9C70LDRgtC10LZcbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiAoQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ucGVyY2VudCAqIGRheXMgKyAxKSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDE0O1xuICAgICAgICAgICAgbGV0IGFubl9wZXJpb2RzID0gZGF5cyAvIDE0O1xuICAgICAgICAgICAgbGV0IGFubnVpdHkgPSAocGVyY2VudCAqIE1hdGgucG93KCgxICsgcGVyY2VudCksIGFubl9wZXJpb2RzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpIC0gMSk7XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoKHN1bSArIHBheWJhY2spICogYW5udWl0eSk7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGZvcm1hdE51bWJlcjogKG51bSkgPT4ge1xuICAgICAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJyk7XG4gICAgfSxcblxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRhNC+0YDQvFxuICAgIGZvcm1WYWxpZGF0ZTogZnVuY3Rpb24gKGZvcm1JZCkge1xuICAgICAgICBsZXQgZm9ybSA9ICcjJyArIGZvcm1JZDtcbiAgICAgICAgbGV0IGZpZWxkID0gJChmb3JtICsgJyBbZGF0YS10eXBlPWZpZWxkXScpO1xuICAgICAgICBsZXQgZXJyID0gJChmb3JtICsgJyAuYmxvY2stZXJyJyk7XG4gICAgICAgIGxldCBidG4gPSAkKGZvcm0gKyAnIGEuYWJfYnV0dG9uJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCQoZmllbGRbaV0pLnZhbCgpID09IDApIHtcbiAgICAgICAgICAgICAgICAkKGZpZWxkW2ldKS5hZGRDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoZmllbGRbaV0pLnJlbW92ZUNsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGZvcm0gKyAnIC5lcnItZmllbGQnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgJChidG4pLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLmhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoYnRuKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICQoZXJyKS5zaG93KCk7XG4gICAgICAgIH1cblxuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBIZWxwZXJzOyJdfQ==
