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
            } else {
                $('.js-btn_register').addClass('is-disabled');
            }
            var data = {
                phone: phone,
                password: pass,
                rePassword: rePass,
                sum: app.loanCalculator.get('sum'),
                agreement: $('#agreement').prop('checked'),
                period: app.loanCalculator.get('sum') > _constants2.default.sumBorder ? period * 7 : period
            };

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
        // let min = $(this.periodRanges).attr('min'),
        //     max = $(this.periodRanges).attr('max');

        this.changeRangeSlider('period', this.model.get('maxPeriod'), this.model.get('minPeriod'));
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

        $('#userRepeatPass').val() !== $('#userPass').val() ? $('#userRepeatPass').addClass('err-field') : $('#userRepeatPass').removeClass('err-field');
        $('#userPass').val().length < 6 ? $('#userPass').addClass('err-field') : $('#userPass').removeClass('err-field');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjtBQVFKLHVDQUEyQiwwQkFSdkI7O0FBVUo7QUFDQSxxQ0FBeUIsY0FYckI7O0FBYUo7QUFDQSxtQ0FBdUIsV0FkbkI7QUFlSixrQ0FBc0IsV0FmbEI7O0FBaUJKO0FBQ0Esc0NBQTBCLGdCQWxCdEI7QUFtQko7QUFDQSxzQ0FBMEIsZ0JBcEJ0Qjs7QUFzQko7QUFDQSx1Q0FBMkIsY0F2QnZCO0FBd0JKLG9DQUF3QixlQXhCcEI7QUF5QkosbUNBQXVCLGNBekJu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SCxjQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGFBQWhCO0FBQ0EsY0FBRSxHQUFGLEVBQU8sSUFBUDtBQUNIO0FBRUo7QUFySFksQ0FBakIsQyxDQUxBOzs7a0JBNkhlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JWaWV3IGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yVmlldyc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAubG9hbkNhbGN1bGF0b3IgPSBuZXcgTG9hbkNhbGN1bGF0b3JNb2RlbCh7XG5cbiAgICB9KTtcbiAgICBhcHAubG9hbkNhbGN1bGF0b3JWaWV3ID0gbmV3IExvYW5DYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAubG9hbkNhbGN1bGF0b3IsXG4gICAgICAgIGVsOiAnZm9ybS5jYWxjJ1xuICAgIH0pO1xuXG4gICAgbGV0IEFwcE1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgZGVmYXVsdHM6IHt9XG4gICAgfSk7XG5cbiAgICBhcHAubW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblxuICAgIHZhciBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJ2JvZHknLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgLy8g0KHQv9C+0YHQvtCxINCy0YvQtNCw0YfQuFxuICAgICAgICAgICAgJ2NsaWNrIC5tZXRob2QnOiAnY2hhbmdlTWV0aG9kJyxcblxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9C/0L7Rh9C10LzRgyDQvNGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tYWJvdXQnOiAnY2hhbmdlQWJvdXRUYWInLFxuICAgICAgICAgICAgLy8g0KLQsNCx0YsgJ9CS0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLXF1ZXN0aW9ucyc6ICdjaGFuZ2VRdWVzdGlvblRhYicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzX3RhYi1xdWVzdC1nZXQnOiAnY2hhbmdlUXVlc3Rpb25UYWJHZXRaYXltJyxcblxuICAgICAgICAgICAgLy8g0KDQsNGB0LrRgNGL0YLRjCDQutC+0LzQtdC90YLRi1xuICAgICAgICAgICAgJ2NsaWNrIC51cGRhdGUtY29tbWVudCc6ICdzaG93Q29tbWVudHMnLFxuXG4gICAgICAgICAgICAvLyDQodC70LDQudC00LXRgFxuICAgICAgICAgICAgJ2NsaWNrIC5hcnJvdy0tcmlnaHQnOiAnbmV4dFNsaWRlJyxcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLWxlZnQnOiAncHJldlNsaWRlJyxcblxuICAgICAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fcmVnaXN0ZXInOiAnaGFuZGxlUmVnaXN0ZXInLFxuICAgICAgICAgICAgLy8g0J7QsdGA0LDRgtC90LDRjyDRgdCy0Y/Qt9GMXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWJ0bl9mZWVkYmFjayc6ICdoYW5kbGVGZWVkYmFjaycsXG5cbiAgICAgICAgICAgIC8vINCU0LvRjyDQv9C+0L/QsNC/0L7QslxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1zaG93X3JlZ2lzdGVyJzogJ3Nob3dSZWdpc3RlcicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXBheV9tZXRob2QnOiAnc2hvd1BheU1ldGhvZCcsXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bl9mZWVkYmFjayc6ICdzaG93RmVlZGJhY2snLFxuICAgICAgICAgICAgJ2NoYW5nZSAucG9wdXAnOiAnY2hhbmdlUG9wdXMnLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1jbG9zZV9wb3B1cCc6ICdjbG9zZVBvcHVwJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJyN1c2VyUGhvbmUnKS5tYXNrKFwiKzcgKDk5OSkgOTk5LTk5OTlcIik7XG5cbiAgICAgICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LLRgNC10LzRj1xuICAgICAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpICsgMTUpO1xuXG4gICAgICAgICAgICBsZXQgcmVzSG91ciA9IGRhdGUuZ2V0SG91cnMoKSxcbiAgICAgICAgICAgICAgICByZXNNaW4gPSBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICAgICAgaWYgKGRhdGUuZ2V0SG91cnMoKS50b1N0cmluZygpLmxlbmd0aCA9PSAxKSByZXNIb3VyID0gJzAnICsgZGF0ZS5nZXRIb3VycygpO1xuXG4gICAgICAgICAgICBpZiAoZGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5sZW5ndGggPT0gMSkgcmVzTWluID0gJzAnICsgZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGxldCByZXMgPSByZXNIb3VyICsgJzonICsgcmVzTWluO1xuXG4gICAgICAgICAgICAkKCcueW91LWxvYW4gLmpzLWxvYW4nKS5odG1sKCcgJyArIHJlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JLRi9Cx0L7RgCDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y9cbiAgICAgICAgY2hhbmdlTWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcubWV0aG9kJykudG9nZ2xlQ2xhc3MoJ21ldGhvZC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIC8vIC0tINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0YLQtdC60YHRglxuICAgICAgICAgICAgJCgnLmpzLXBheV9tZXRob2QnKS5odG1sKCQoJy5tZXRob2QtLWFjdGl2ZScpLmZpbmQoJy5qcy10ZXh0X21ldGhvZCcpLmh0bWwoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGC0LDQsdC+0LIgKNC00L7Qu9C20L3QviDRgNCw0LHQvtGC0LDRgtGMINC4INC90LAg0LTQtdGB0LrRgtC+0L/QtSlcbiAgICAgICAgY2hhbmdlQWJvdXRUYWI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuYnRuLWFib3V0LS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdidG4tYWJvdXQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICAkKCcuanMtY2hhbmdlLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjYWJvdXRUYWItJyArIHRhYklkKS5hZGRDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtLWFjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIC0tINCy0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRi1xuICAgICAgICBjaGFuZ2VRdWVzdGlvblRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5idG4tcXVlc3Rpb25zLS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdidG4tcXVlc3Rpb25zLS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2codGFiSWQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQpO1xuXG4gICAgICAgICAgICAkKCcuanMtY2hhbmdlLWNvbnRlbnQtcXVlc3QnKS5yZW1vdmVDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtcXVlc3QtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjUXVlc3RUYWItJyArIHRhYklkKS5hZGRDbGFzcygnanMtY2hhbmdlLWNvbnRlbnQtcXVlc3QtLWFjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIC0tLS0g0LLQvtC/0YDQvtGB0Ysg0Lgg0L7RgtCy0LXRgtGLICjQn9C+0LvRg9GH0LXQvdC40LUg0LfQsNC50LzQsClcbiAgICAgICAgY2hhbmdlUXVlc3Rpb25UYWJHZXRaYXltOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmpzX3RhYi1xdWVzdC1nZXQtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2pzX3RhYi1xdWVzdC1nZXQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YWJJZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldCk7XG5cbiAgICAgICAgICAgICQoJy5qc19nZXQtemF5bS10YWItY29udGVudCcpLnJlbW92ZUNsYXNzKCdqc19nZXQtemF5bS10YWItY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNRdWVzdEdldFpheW1UYWItJyArIHRhYklkKS5hZGRDbGFzcygnanNfZ2V0LXpheW0tdGFiLWNvbnRlbnQtLWFjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dDb21tZW50czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmljb191cGRhdGUtY29tbWVudHMnKS5hZGRDbGFzcygnaWNvX3VwZGF0ZS1jb21tZW50cy0tYWN0aXZlJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtcm93LWNvbW1lbnQnKS5zbGlkZURvd24oNTAwKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdmbGV4J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJy5yb3ctY29tbWVudC1oaWRlJykuc2xpZGVVcCg2NTApO1xuICAgICAgICAgICAgICAgICQoJy51cGRhdGUtY29tbWVudCcpLmhpZGUoMTAwKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCh0LvQtdC00YPRjtGJ0LjQuSDRgdC70LDQudC0XG4gICAgICAgIG5leHRTbGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5jb250ZW50LXNsaWRlcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnLjNzIGVhc2Utb3V0JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodmFsdWUpIDw9IC01NDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIC0gMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g0J/RgNC10LTRi9C00YPRidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBwcmV2U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID0gLTU0MDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgKyAyNzAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y9cbiAgICAgICAgaGFuZGxlUmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBwaG9uZSA9ICQoJyN1c2VyUGhvbmUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBwYXNzID0gJCgnI3VzZXJQYXNzJykudmFsKCksXG4gICAgICAgICAgICAgICAgcmVQYXNzID0gJCgnI3VzZXJSZXBlYXRQYXNzJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGVyaW9kID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglxuXG4gICAgICAgICAgICBpZiAocGFzcyAhPT0gcmVQYXNzKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZXBlYXQtcGFzcycpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZXBlYXQtcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0LDRgNC+0LvRjCDQutC+0YDQvtGC0LrQuNC5XG5cbiAgICAgICAgICAgIGlmIChwYXNzLmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICQoJyN1c2VyUGFzcycpLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICQoJyN1c2VyUGFzcycpLnJlbW92ZUNsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINGC0LXQu9C10YTQvtC90LBcblxuICAgICAgICAgICAgaWYgKHBob25lLmxlbmd0aCAhPSAxNykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1waG9uZScpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBob25lLmxlbmd0aCA9PT0gMTcgJiYgcGFzcyA9PT0gcmVQYXNzICYmIHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQoJyNhZ3JlZW1lbnQnKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzLFxuICAgICAgICAgICAgICAgIHJlUGFzc3dvcmQ6IHJlUGFzcyxcbiAgICAgICAgICAgICAgICBzdW06IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgICAgIGFncmVlbWVudDogJCgnI2FncmVlbWVudCcpLnByb3AoJ2NoZWNrZWQnKSxcbiAgICAgICAgICAgICAgICBwZXJpb2Q6IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3N1bScpID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlciA/IHBlcmlvZCAqIDcgOiBwZXJpb2RcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFwcEhlbHBlcnMuZm9ybVZhbGlkYXRlKCdqc1JlZ2lzdGVyJyk7XG5cbiAgICAgICAgICAgIC8vINCX0LDQv9GA0L7RgVxuICAgICAgICAgICAgaWYgKCEkKCcuanMtYnRuX3JlZ2lzdGVyJykuaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgaGFuZGxlRmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGVtZSA9ICQoJy5qcy1mZWVkLXNlbGVjdF90aGVtZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICQoJy5qcy1mZWVkLWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICQoJy5qcy1mZWVkLW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgnanNGZWVkYmFjaycpO1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcblxuICAgICAgICAgICAgaWYgKCEkKCcuanMtYnRuX2ZlZWRiYWNrJykuaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL2ZlZWRiYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2NlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tcmVnaXN0ZXInKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0LLRi9Cx0L7RgNC+0Lwg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIHNob3dQYXlNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tbWV0aG9kJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfRjNGOXG4gICAgICAgIHNob3dGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JfQsNC60YDRi9GC0Ywg0L/QvtC/0LDQv1xuICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScsIC8vIFwib25jZVwiIG9yIFwidHdvX3dlZWtzXCJcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBzaG93UGVyaW9kOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG1heFBlcmlvZDogMzAsXG4gICAgICAgIG1pblBlcmlvZDogOCxcbiAgICB9LFxuXG4gICAgLy8g0J/QvtC00YHRh9C10YIg0L7QsdGJ0LXQuSDRgdGD0LzQvNGLINC30LDQudC80LAgKNCe0JQgKyDQn9GA0L7RhtC10L3RgtGLICsg0JrQvtC80LjRgdGB0LjQuClcbiAgICBjYWxjdWxhdGVMb2FuU3VtOiBmdW5jdGlvbiAoc3VtLCBwZXJpb2QpIHtcbiAgICAgICAgdmFyIHRvdGFsO1xuXG4gICAgICAgIHN1bSA9IHBhcnNlSW50KHN1bSk7XG4gICAgICAgIHBlcmlvZCA9IHBhcnNlSW50KHBlcmlvZCk7XG5cbiAgICAgICAgaWYgKHN1bSA8PSBBcHBDb25zdGFudHMudGFycmlmc1swXS5tYXhfc3VtKSB7XG4gICAgICAgICAgICAvLyDQodGH0LjRgtCw0LXQvCDQv9C+INC/0LXRgNCy0L7QvNGDINGC0LDRgNC40YTRg1xuICAgICAgICAgICAgdG90YWwgPSBNYXRoLmNlaWwoKHN1bSArIHN1bSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSkgKiAoQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ucGVyY2VudCAqIHBlcmlvZCArIDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0LLRgtC+0YDQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLnBlcmNlbnQgKiA3O1xuICAgICAgICAgICAgdmFyIG5fd2Vla3MgPSBwZXJpb2Q7XG4gICAgICAgICAgICB2YXIgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykpIC8gKE1hdGgucG93KCgxICsgcGVyY2VudCksIG5fd2Vla3MpIC0gMSk7XG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIGFubnVpdHkgKiBuX3dlZWtzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0b3RhbDtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hbkNhbGN1bGF0b3JNb2RlbDsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuLi9oZWxwZXJzJztcblxudmFyIExvYW5DYWxjdWxhdG9yVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXG4gICAgc3VtUmFuZ2VzOiAnaW5wdXQuanMtc2xpZGVyLS1zdW0nLFxuICAgIHBlcmlvZFJhbmdlczogJ2lucHV0LmpzLXNsaWRlci0tcGVyaW9kJyxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1zdW0nOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG5cbiAgICAgICAgLy8g0JTQu9GPINC/0L7Qu9C10Lkg0LrQsNC70YzQutGD0LvRj9GC0L7RgNCwXG4gICAgICAgICdmb2N1cyAucmFuZ2VfZmllbGQnOiAnbGlnaHRCb3JkZXJJbnB1dCcsXG4gICAgICAgICdmb2N1c291dCAucmFuZ2VfZmllbGQnOiAnb2ZmTGlnaHRCb3JkZXJJbnB1dCdcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLnRlbXBsYXRlID0gJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZW5kZXJlZCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy4kZWwuaHRtbChyZW5kZXJlZCk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VDYWxjKCd5b3UtZ2V0JywgMik7XG4gICAgICAgIHRoaXMuY2hhbmdlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDRiNCw0LHQu9C+0L3QsFxuICAgIGNoYW5nZUNhbGM6IGZ1bmN0aW9uIChzZWN0aW9uLCBuKSB7XG4gICAgICAgbGV0IGFsbEJsb2NrID0gJyMnICsgc2VjdGlvbjtcblxuICAgICAgICAvLyDQlNC70Y8g0YHRg9C80LzRi1xuICAgICAgICAvLyAtLSDQv9C+0LvRj1xuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFtuYW1lPXN1bV0nKS5hdHRyKCdpZCcsICdmb2N1c0lucFN1bScgKyBuKTtcbiAgICAgICAgJChhbGxCbG9jayArICcgLmFmLWlucHV0LS1zdW0gbGFiZWwuanMtc3ltYl9pbnAnKS5hdHRyKCdmb3InLCAnZm9jdXNJbnBTdW0nICsgbik7XG4gICAgICAgIC8vIC0tINC/0L7Qu9GD0LfQvtC90L7QulxuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bScpLmF0dHIoJ2lkJywgJ3N1bScgKyBuKTtcblxuICAgICAgICAvLyDQlNC70Y8g0L/QtdGA0LjQvtC00LBcbiAgICAgICAgLy8gLS0g0L/QvtC70Y9cbiAgICAgICAgJChhbGxCbG9jayArICcgaW5wdXRbbmFtZT1wZXJpb2RdJykuYXR0cignaWQnLCAnZm9jdXNJbnBQZXJpb2QnICsgbik7XG4gICAgICAgICQoYWxsQmxvY2sgKyAnIC5hZi1pbnB1dC0tcGVyaW9kIGxhYmVsLmpzLXN5bWJfaW5wJykuYXR0cignZm9yJywgJ2ZvY3VzSW5wUGVyaW9kJyArIG4pO1xuICAgICAgICAvLyAtLSDQv9C+0LvRg9C30L7QvdC+0LpcbiAgICAgICAgJChhbGxCbG9jayArICcgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnKS5hdHRyKCdpZCcsICdwZXJpb2QnICsgbik7XG5cbiAgICB9LFxuXG4gICAgY2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLm1vZGVsLmdldCgnc3VtJyksXG4gICAgICAgICAgICBwZXJpb2QgPSB0aGlzLm1vZGVsLmdldCgncGVyaW9kJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQtSDRgdGD0LzQvNGLXG4gICAgICAgICAgICBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LUg0YHRgNC+0LrQsFxuICAgICAgICAgICAgZmllbGRQZXJpb2QgPSAkKCdpbnB1dFtuYW1lPXBlcmlvZF0nKTtcblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0YHRg9C80LzRiyDQt9Cw0LnQvNCwXG4gICAgICAgICQoJy5qcy1vdXQtc3VtJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcblxuICAgICAgICAvLyAtLSDQsiDQv9C+0LvQtSBj0YPQvNC80YtcbiAgICAgICAgJChmaWVsZFN1bSkudmFsKHN1bSk7XG4gICAgICAgIC8vIC0tINCyINC/0L7Qu9C1INC/0LXRgNC40L7QtFxuICAgICAgICAkKGZpZWxkUGVyaW9kKS52YWwocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuICAgICAgICAgICAgQXBwSGVscGVycy5wcmludFJlc3VsdHMoKTtcblxuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDEpJykuaHRtbCgnNCDQvdC10LTQtdC70LgnKTtcblxuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDIpJykuaHRtbCgnMTIg0L3QtdC00LXQu9GMJyk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdtYXhQZXJpb2QnLCAxMik7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnbWluUGVyaW9kJywgNCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgncGVyaW9kJykgPT0gNCA/ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpID09IDQgPyAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2QyXScpLmh0bWwoJ9C90LXQtNC10LvQuCcpIDogJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLmluZm8tYmFjayBzcGFuJykuaHRtbCgn0JLQvtC30LLRgNCw0YnQsNC10YLQtScpO1xuICAgICAgICAgICAgJCgnLmpzLW91dC1zdW1fYmFjaycpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIodGhpcy5tb2RlbC5jYWxjdWxhdGVMb2FuU3VtKHN1bSwgcGVyaW9kKSkgKyAnIOKCvScpO1xuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDEpJykuaHRtbCgnOCDQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDIpJykuaHRtbCgnMzAg0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQtNC90LXQuScpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ21heFBlcmlvZCcsIDMwKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdtaW5QZXJpb2QnLCA4KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQodGhpcy5zdW1SYW5nZXMpLnZhbChzdW0pO1xuICAgICAgICAkKHRoaXMucGVyaW9kUmFuZ2VzKS52YWwocGVyaW9kKTtcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INC/0L7Qu9C30YPQvdC60LAgKHR5cGU6IHN1bSB8fCBwZXJpb2QpXG4gICAgY2hhbmdlUmFuZ2VTbGlkZXI6IGZ1bmN0aW9uICh0eXBlLCBtYXgsIG1pbikge1xuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dC5qcy1zbGlkZXItLScgKyB0eXBlKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHJhbmdlW2ldKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdtYXgnLCBtYXgpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ21pbicsIG1pbilcbiAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKCQocmFuZ2VbaV0pLnZhbCgpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICogMTAwIC8gKCQocmFuZ2VbaV0pLmF0dHIoJ21heCcpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICsgJyUgMTAwJSdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQodHlwZSwgJChyYW5nZVtpXSkudmFsKCkpO1xuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsIG1heCwgbWluKTtcbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VTdW1GaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKTtcblxuICAgICAgICB2YXIgJGlucHV0ID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICB2YXIgc3VtID0gcGFyc2VJbnQoJGlucHV0LnZhbCgpKSB8fCA2MDAwO1xuICAgICAgICBsZXQgcG93ID0gTWF0aC5jZWlsKHN1bS8xMDApICoxMDA7XG4gICAgICAgIGlmKCAocG93IC0gc3VtKSA+IDUwKXtcbiAgICAgICAgICAgIHN1bSA9IHBvdyAtIDEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1bSA9IHBvdztcbiAgICAgICAgfVxuICAgICAgICAkaW5wdXQudmFsKHN1bSk7XG5cbiAgICAgICAgaWYgKHN1bSA+IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdW0nLCBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ3R3b193ZWVrcydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1pbl9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1pbl9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ29uY2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWF4JyksICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21pbicpKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGxldCBtaW4gPSAkKHRoaXMucGVyaW9kUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgLy8gICAgIG1heCA9ICQodGhpcy5wZXJpb2RSYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIHRoaXMubW9kZWwuZ2V0KCdtYXhQZXJpb2QnKSwgdGhpcy5tb2RlbC5nZXQoJ21pblBlcmlvZCcpKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0L/QvtC70LfRg9C90L7QulxuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCcpO1xuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgLy8g0KHRgtC40LvQuCDQtNC70Y8g0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHJhbmdlLnZhbCgpIC0gcmFuZ2UuYXR0cignbWluJykpICogMTAwIC8gKHJhbmdlLmF0dHIoJ21heCcpIC0gcmFuZ2UuYXR0cignbWluJykpICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgICQoJy5qcy1wZXJpb2QnKS52YWwodGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpKTtcbiAgICB9LFxuXG4gICAgbGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyMxOGE0ZDInXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmZMaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnI2IwYmFjNSdcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XSxcbiAgICBmZWVJc3N1ZTogMC4wNSxcbiAgICBmYWN0b3JNYXg6IDAuMTUsXG4gICAgZmFjdG9yTWluOiAwLjAxLFxuICAgIHN1bUJvcmRlcjogMzAwMDAsXG4gICAgRkVFX0lTU1VFOiAwLjA1LCAvLyDQmtC+0LzQvNC40YHQuNGPINC30LAg0LLRi9C00LDRh9GDXG4gICAgUEVSQ0VOVF9TVEFOREFSVDogMC4wMTUsIC8vINCh0YLQsNC90LTQsNGA0YLQvdGL0Lkg0L/RgNC+0YbQtdC90YIgKNCyINC00LXQvdGMKVxuICAgIFBFUkNFTlRfREVMQVk6IDAuMDE1LCAvLyDQn9GA0L7RhtC10L3RgiDQsiDRgdC70YPRh9Cw0LUg0L/RgNC+0YHRgNC+0YfQutC4ICjQsiDQtNC10L3RjClcbiAgICBGSU5FX0RFTEFZOiAxMDAwLjAwLCAvLyDQnNCw0LrRgdC40LzQsNC70YzQvdCw0Y8g0YHRg9C80LzQsCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7Qs9C+INGI0YLRgNCw0YTQsCDQt9CwINC/0YDQvtGB0YDQvtGH0LrRg1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBDb25zdGFudHM7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDguMTIuMTYuXG4gKi9cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICAvLyBAVE9ETzogdXJsXG4gICAgYmFzZVVybDogJycsXG5cbiAgICAvLyBhamF4XG4gICAgYWpheFdyYXBwZXI6ICh1cmwsIHR5cGUsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgPT4ge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCAnUE9TVCc7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBzdWNjZXNzQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkge307XG4gICAgICAgIGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVybXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEFwcEhlbHBlcnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvckNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDQpNC40L3QsNC70YzQvdCw0Y8g0YHRg9C80LzQsFxuICAgIHByaW50UmVzdWx0czogKCkgPT4ge1xuICAgICAgICBsZXQgc3VtID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyk7XG4gICAgICAgIGxldCBkYXlzID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgbGV0IHBheW1ldGhvZDtcblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikgcGF5bWV0aG9kID0gJ9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0ZHQtiDQvdCwINGB0YPQvNC80YMnO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheXMgKj0gNztcbiAgICAgICAgICAgIHBheW1ldGhvZCA9IChBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSArICcgJyArIEFwcEhlbHBlcnMuZ2V0Q2FzZShBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSwgJ9C/0LvQsNGC0ZHQticsICfQv9C70LDRgtC10LbQsCcsICfQv9C70LDRgtC10LbQtdC5JykpO1xuICAgICAgICB9XG4gICAgICAgIHN1bSA9IEFwcEhlbHBlcnMuZXN0aW1hdGVSZXR1cm5TdW0oc3VtLCBkYXlzKTtcblxuICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKHBheW1ldGhvZCsnINC/0L4nKTtcblxuICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVBbm5QZXJpb2RzOiAoZGF5cykgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGRheXMgLyAxNCk7XG4gICAgfSxcblxuICAgIGdldENhc2U6IChfbnVtYmVyLCBfY2FzZTEsIF9jYXNlMiwgX2Nhc2UzKSA9PiB7XG4gICAgICAgIHZhciBiYXNlID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwMCkgKiAxMDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGJhc2UgPiA5ICYmIGJhc2UgPCAyMCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gX2Nhc2UzO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVtYWluZGVyID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwKSAqIDEwO1xuXG4gICAgICAgICAgICBpZiAoMSA9PSByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKDAgPCByZW1haW5kZXIgJiYgNSA+IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UyO1xuICAgICAgICAgICAgZWxzZSByZXN1bHQgPSBfY2FzZTM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZVJldHVyblN1bTogKHN1bSwgZGF5cykgPT4ge1xuICAgICAgICBjb25zdCBmZWVJc3N1ZSA9IEFwcENvbnN0YW50cy5mZWVJc3N1ZTtcbiAgICAgICAgY29uc3QgZmFjdG9yTWF4ID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1heDtcbiAgICAgICAgY29uc3QgZmFjdG9yTWluID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1pbjtcblxuICAgICAgICBzdW0gPSBOdW1iZXIoc3VtKTtcbiAgICAgICAgbGV0IHBheWJhY2sgPSBNYXRoLmNlaWwoc3VtICogZmVlSXNzdWUpO1xuICAgICAgICAvL9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0LXQtlxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogZGF5cyArIDEpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogMTQ7XG4gICAgICAgICAgICBsZXQgYW5uX3BlcmlvZHMgPSBkYXlzIC8gMTQ7XG4gICAgICAgICAgICBsZXQgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykgLSAxKTtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiBhbm51aXR5KTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGE0L7RgNC8XG4gICAgZm9ybVZhbGlkYXRlOiBmdW5jdGlvbiAoZm9ybUlkKSB7XG4gICAgICAgIGxldCBmb3JtID0gJyMnICsgZm9ybUlkO1xuICAgICAgICBsZXQgZmllbGQgPSAkKGZvcm0gKyAnIFtkYXRhLXR5cGU9ZmllbGRdJyk7XG4gICAgICAgIGxldCBlcnIgPSAkKGZvcm0gKyAnIC5ibG9jay1lcnInKTtcbiAgICAgICAgbGV0IGJ0biA9ICQoZm9ybSArICcgYS5hYl9idXR0b24nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChmaWVsZFtpXSkudmFsKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoZmllbGRbaV0pLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChmaWVsZFtpXSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJCgnI3VzZXJSZXBlYXRQYXNzJykudmFsKCkgIT09ICQoJyN1c2VyUGFzcycpLnZhbCgpID8gJCgnI3VzZXJSZXBlYXRQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpIDogJCgnI3VzZXJSZXBlYXRQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAkKCcjdXNlclBhc3MnKS52YWwoKS5sZW5ndGggPCA2ID8gJCgnI3VzZXJQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpIDogJCgnI3VzZXJQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuXG4gICAgICAgIGlmICgkKGZvcm0gKyAnIC5lcnItZmllbGQnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgJChidG4pLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLmhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoYnRuKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICQoZXJyKS5zaG93KCk7XG4gICAgICAgIH1cblxuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBIZWxwZXJzOyJdfQ==
