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
        }
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
        this.changeCalc('you-get', 2);

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
        $(allBlock + ' input[type=range].js-slider--sum').attr('id', 'sum' + n);
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
            console.log($(range[i]).val());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjtBQVFKLHVDQUEyQiwwQkFSdkI7O0FBVUo7QUFDQSxxQ0FBeUIsY0FYckI7O0FBYUo7QUFDQSxtQ0FBdUIsV0FkbkI7QUFlSixrQ0FBc0IsV0FmbEI7O0FBaUJKO0FBQ0Esc0NBQTBCLGdCQWxCdEI7QUFtQko7QUFDQSxzQ0FBMEIsZ0JBcEJ0Qjs7QUFzQko7QUFDQSx1Q0FBMkIsY0F2QnZCO0FBd0JKLG9DQUF3QixlQXhCcEI7QUF5QkosbUNBQXVCLGNBekJu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RCxNQUdPO0FBQ0gsY0FBRSxHQUFGLEVBQU8sUUFBUCxDQUFnQixhQUFoQjtBQUNBLGNBQUUsR0FBRixFQUFPLElBQVA7QUFDSDtBQUVKO0FBckhZLENBQWpCLEMsQ0FMQTs7O2tCQTZIZSxVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IEFwcEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvck1vZGVsIGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yTW9kZWwnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yVmlldyBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcnO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICAvLyDQmtCw0LvRjNC60YPQu9GP0YLQvtGAXG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yID0gbmV3IExvYW5DYWxjdWxhdG9yTW9kZWwoe1xuXG4gICAgfSk7XG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yVmlldyA9IG5ldyBMb2FuQ2FsY3VsYXRvclZpZXcoe1xuICAgICAgICBtb2RlbDogYXBwLmxvYW5DYWxjdWxhdG9yLFxuICAgICAgICBlbDogJ2Zvcm0uY2FsYydcbiAgICB9KTtcblxuICAgIGxldCBBcHBNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgICAgIGRlZmF1bHRzOiB7fVxuICAgIH0pO1xuXG4gICAgYXBwLm1vZGVsID0gbmV3IEFwcE1vZGVsKCk7XG5cbiAgICB2YXIgQXBwVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdib2R5JyxcblxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIC8vINCh0L/QvtGB0L7QsSDQstGL0LTQsNGH0LhcbiAgICAgICAgICAgICdjbGljayAubWV0aG9kJzogJ2NoYW5nZU1ldGhvZCcsXG5cbiAgICAgICAgICAgIC8vINCi0LDQsdGLICfQv9C+0YfQtdC80YMg0LzRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLWFib3V0JzogJ2NoYW5nZUFib3V0VGFiJyxcbiAgICAgICAgICAgIC8vINCi0LDQsdGLICfQktC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YsnXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bi1xdWVzdGlvbnMnOiAnY2hhbmdlUXVlc3Rpb25UYWInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qc190YWItcXVlc3QtZ2V0JzogJ2NoYW5nZVF1ZXN0aW9uVGFiR2V0WmF5bScsXG5cbiAgICAgICAgICAgIC8vINCg0LDRgdC60YDRi9GC0Ywg0LrQvtC80LXQvdGC0YtcbiAgICAgICAgICAgICdjbGljayAudXBkYXRlLWNvbW1lbnQnOiAnc2hvd0NvbW1lbnRzJyxcblxuICAgICAgICAgICAgLy8g0KHQu9Cw0LnQtNC10YBcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLXJpZ2h0JzogJ25leHRTbGlkZScsXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1sZWZ0JzogJ3ByZXZTbGlkZScsXG5cbiAgICAgICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y9cbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX3JlZ2lzdGVyJzogJ2hhbmRsZVJlZ2lzdGVyJyxcbiAgICAgICAgICAgIC8vINCe0LHRgNCw0YLQvdCw0Y8g0YHQstGP0LfRjFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fZmVlZGJhY2snOiAnaGFuZGxlRmVlZGJhY2snLFxuXG4gICAgICAgICAgICAvLyDQlNC70Y8g0L/QvtC/0LDQv9C+0LJcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvd19yZWdpc3Rlcic6ICdzaG93UmVnaXN0ZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1wYXlfbWV0aG9kJzogJ3Nob3dQYXlNZXRob2QnLFxuICAgICAgICAgICAgJ2NsaWNrIC5idG5fZmVlZGJhY2snOiAnc2hvd0ZlZWRiYWNrJyxcbiAgICAgICAgICAgICdjaGFuZ2UgLnBvcHVwJzogJ2NoYW5nZVBvcHVzJyxcbiAgICAgICAgICAgICdjbGljayAuanMtY2xvc2VfcG9wdXAnOiAnY2xvc2VQb3B1cCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjdXNlclBob25lJykubWFzayhcIis3ICg5OTkpIDk5OS05OTk5XCIpO1xuXG4gICAgICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INCy0YDQtdC80Y9cbiAgICAgICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSArIDE1KTtcblxuICAgICAgICAgICAgbGV0IHJlc0hvdXIgPSBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgICAgICAgcmVzTWluID0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKS5sZW5ndGggPT0gMSkgcmVzSG91ciA9ICcwJyArIGRhdGUuZ2V0SG91cnMoKTtcblxuICAgICAgICAgICAgaWYgKGRhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkubGVuZ3RoID09IDEpIHJlc01pbiA9ICcwJyArIGRhdGUuZ2V0TWludXRlcygpO1xuXG4gICAgICAgICAgICBsZXQgcmVzID0gcmVzSG91ciArICc6JyArIHJlc01pbjtcblxuICAgICAgICAgICAgJCgnLnlvdS1sb2FuIC5qcy1sb2FuJykuaHRtbCgnICcgKyByZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIGNoYW5nZU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLm1ldGhvZCcpLnRvZ2dsZUNsYXNzKCdtZXRob2QtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyAtLSDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INGC0LXQutGB0YJcbiAgICAgICAgICAgICQoJy5qcy1wYXlfbWV0aG9kJykuaHRtbCgkKCcubWV0aG9kLS1hY3RpdmUnKS5maW5kKCcuanMtdGV4dF9tZXRob2QnKS5odG1sKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyICjQtNC+0LvQttC90L4g0YDQsNCx0L7RgtCw0YLRjCDQuCDQvdCwINC00LXRgdC60YLQvtC/0LUpXG4gICAgICAgIGNoYW5nZUFib3V0VGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1hYm91dC0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLWFib3V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI2Fib3V0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLSDQstC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YtcbiAgICAgICAgY2hhbmdlUXVlc3Rpb25UYWI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhYklkKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50LXF1ZXN0JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI1F1ZXN0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLS0tINCy0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiyAo0J/QvtC70YPRh9C10L3QuNC1INC30LDQudC80LApXG4gICAgICAgIGNoYW5nZVF1ZXN0aW9uVGFiR2V0WmF5bTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5qc190YWItcXVlc3QtZ2V0LS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdqc190YWItcXVlc3QtZ2V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2codGFiSWQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQpO1xuXG4gICAgICAgICAgICAkKCcuanNfZ2V0LXpheW0tdGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnanNfZ2V0LXpheW0tdGFiLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjUXVlc3RHZXRaYXltVGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzX2dldC16YXltLXRhYi1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93Q29tbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5pY29fdXBkYXRlLWNvbW1lbnRzJykuYWRkQ2xhc3MoJ2ljb191cGRhdGUtY29tbWVudHMtLWFjdGl2ZScpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLXJvdy1jb21tZW50Jykuc2xpZGVEb3duKDUwMCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnZmxleCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKCcucm93LWNvbW1lbnQtaGlkZScpLnNsaWRlVXAoNjUwKTtcbiAgICAgICAgICAgICAgICAkKCcudXBkYXRlLWNvbW1lbnQnKS5oaWRlKDEwMCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQodC70LXQtNGD0Y7RidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBuZXh0U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA8PSAtNTQwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSAtIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vINCf0YDQtdC00YvQtNGD0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgcHJldlNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IC01NDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpICsgMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgIGhhbmRsZVJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgcGhvbmUgPSAkKCcjdXNlclBob25lJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzcyA9ICQoJyN1c2VyUGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHJlUGFzcyA9ICQoJyN1c2VyUmVwZWF0UGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBlcmlvZCA9IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpO1xuXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcblxuICAgICAgICAgICAgaWYgKHBhc3MgIT09IHJlUGFzcykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Ywg0LrQvtGA0L7RgtC60LjQuVxuXG4gICAgICAgICAgICBpZiAocGFzcy5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLnNob3coKTtcbiAgICAgICAgICAgICAgICAkKCcjdXNlclBhc3MnKS5hZGRDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXNzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkKCcjdXNlclBhc3MnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCDRgtC10LvQtdGE0L7QvdCwXG5cbiAgICAgICAgICAgIGlmIChwaG9uZS5sZW5ndGggIT0gMTcpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1waG9uZScpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwaG9uZS5sZW5ndGggPT09IDE3ICYmIHBhc3MgPT09IHJlUGFzcyAmJiBwYXNzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKCcjYWdyZWVtZW50JykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHBob25lOiBwaG9uZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzcyxcbiAgICAgICAgICAgICAgICByZVBhc3N3b3JkOiByZVBhc3MsXG4gICAgICAgICAgICAgICAgc3VtOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgICAgICBhZ3JlZW1lbnQ6ICQoJyNhZ3JlZW1lbnQnKS5wcm9wKCdjaGVja2VkJyksXG4gICAgICAgICAgICAgICAgcGVyaW9kOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSA+IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIgPyBwZXJpb2QgKiA3IDogcGVyaW9kXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgnanNSZWdpc3RlcicpO1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWdpc3RlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINGE0L7RgNC80Ysg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9C4XG4gICAgICAgIGhhbmRsZUZlZWRiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgdGhlbWUgPSAkKCcuanMtZmVlZC1zZWxlY3RfdGhlbWUgb3B0aW9uOnNlbGVjdGVkJykudmFsKCksXG4gICAgICAgICAgICAgICAgZW1haWwgPSAkKCcuanMtZmVlZC1lbWFpbCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkKCcuanMtZmVlZC1tZXNzYWdlJykudmFsKCk7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHRoZW1lOiB0aGVtZSxcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2pzRmVlZGJhY2snKTtcblxuICAgICAgICAgICAgLy8g0JfQsNC/0YDQvtGBXG5cbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9mZWVkYmFjaycpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgICAgICAgc2hvd1JlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLXJlZ2lzdGVyJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINCy0YvQsdC+0YDQvtC8INGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBzaG93UGF5TWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLW1ldGhvZCcpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30YzRjlxuICAgICAgICBzaG93RmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tZmVlZGJhY2snKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCX0LDQutGA0YvRgtGMINC/0L7Qv9Cw0L9cbiAgICAgICAgY2xvc2VQb3B1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwJykuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgYXBwLnZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgLy8g0JfQvdCw0YfQtdC90LjRjyDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHN1bTogNjAwMCxcbiAgICAgICAgcGVyaW9kOiAxMixcbiAgICAgICAgdHlwZTogJ29uY2UnLCAvLyBcIm9uY2VcIiBvciBcInR3b193ZWVrc1wiXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgc2hvd1BlcmlvZDogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vINCf0L7QtNGB0YfQtdGCINC+0LHRidC10Lkg0YHRg9C80LzRiyDQt9Cw0LnQvNCwICjQntCUICsg0J/RgNC+0YbQtdC90YLRiyArINCa0L7QvNC40YHRgdC40LgpXG4gICAgY2FsY3VsYXRlTG9hblN1bTogZnVuY3Rpb24gKHN1bSwgcGVyaW9kKSB7XG4gICAgICAgIHZhciB0b3RhbDtcblxuICAgICAgICBzdW0gPSBwYXJzZUludChzdW0pO1xuICAgICAgICBwZXJpb2QgPSBwYXJzZUludChwZXJpb2QpO1xuXG4gICAgICAgIGlmIChzdW0gPD0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWF4X3N1bSkge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQv9C10YDQstC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogKEFwcENvbnN0YW50cy50YXJyaWZzWzBdLnBlcmNlbnQgKiBwZXJpb2QgKyAxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDQodGH0LjRgtCw0LXQvCDQv9C+INCy0YLQvtGA0L7QvNGDINGC0LDRgNC40YTRg1xuICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogNztcbiAgICAgICAgICAgIHZhciBuX3dlZWtzID0gcGVyaW9kO1xuICAgICAgICAgICAgdmFyIGFubnVpdHkgPSAocGVyY2VudCAqIE1hdGgucG93KCgxICsgcGVyY2VudCksIG5fd2Vla3MpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSAtIDEpO1xuICAgICAgICAgICAgdG90YWwgPSBNYXRoLmNlaWwoKHN1bSArIHN1bSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSkgKiBhbm51aXR5ICogbl93ZWVrcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yTW9kZWw7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cblxuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IEFwcEhlbHBlcnMgZnJvbSAnLi4vaGVscGVycyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblxuICAgIHN1bVJhbmdlczogJCgnaW5wdXQuanMtc2xpZGVyLS1zdW0nKSxcbiAgICBwZXJpb2RSYW5nZXM6ICQoJ2lucHV0LmpzLXNsaWRlci0tcGVyaW9kJyksXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJzogJ2NoYW5nZVN1bVJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtc3VtJzogJ2NoYW5nZVN1bUZpZWxkJyxcblxuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnOiAnY2hhbmdlUGVyaW9kUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1wZXJpb2QnOiAnY2hhbmdlUGVyaW9kRmllbGQnLFxuXG4gICAgICAgIC8vINCU0LvRjyDQv9C+0LvQtdC5INC60LDQu9GM0LrRg9C70Y/RgtC+0YDQsFxuICAgICAgICAnZm9jdXMgLnJhbmdlX2ZpZWxkJzogJ2xpZ2h0Qm9yZGVySW5wdXQnLFxuICAgICAgICAnZm9jdXNvdXQgLnJhbmdlX2ZpZWxkJzogJ29mZkxpZ2h0Qm9yZGVySW5wdXQnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy50ZW1wbGF0ZSA9ICQoJyN0ZW1wbGF0ZUNhbGMnKS5odG1sKCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfLnRlbXBsYXRlKCQoJyN0ZW1wbGF0ZUNhbGMnKS5odG1sKCkpO1xuXG4gICAgICAgIHRoaXMubW9kZWwub24oJ2NoYW5nZScsIHRoaXMuY2hhbmdlLCB0aGlzKTtcblxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlbmRlcmVkID0gdGhpcy50ZW1wbGF0ZSh0aGlzLm1vZGVsLmF0dHJpYnV0ZXMpO1xuICAgICAgICB0aGlzLiRlbC5odG1sKHJlbmRlcmVkKTtcblxuICAgICAgICB0aGlzLmNoYW5nZSgpO1xuICAgICAgICB0aGlzLmNoYW5nZUNhbGMoJ3lvdS1nZXQnLCAyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INGI0LDQsdC70L7QvdCwXG4gICAgY2hhbmdlQ2FsYzogZnVuY3Rpb24gKHNlY3Rpb24sIG4pIHtcbiAgICAgICBsZXQgYWxsQmxvY2sgPSAnIycgKyBzZWN0aW9uO1xuXG4gICAgICAgIC8vINCU0LvRjyDRgdGD0LzQvNGLXG4gICAgICAgIC8vIC0tINC/0L7Qu9GPXG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W25hbWU9c3VtXScpLmF0dHIoJ2lkJywgJ2ZvY3VzSW5wU3VtJyArIG4pO1xuICAgICAgICAkKGFsbEJsb2NrICsgJyAuYWYtaW5wdXQtLXN1bSBsYWJlbC5qcy1zeW1iX2lucCcpLmF0dHIoJ2ZvcicsICdmb2N1c0lucFN1bScgKyBuKTtcbiAgICAgICAgLy8gLS0g0L/QvtC70YPQt9C+0L3QvtC6XG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJykuYXR0cignaWQnLCAnc3VtJyArIG4pO1xuXG5cbiAgICAgICAgLy8g0JTQu9GPINC/0LXRgNC40L7QtNCwXG4gICAgICAgIC8vIC0tINC/0L7Qu9GPXG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W25hbWU9cGVyaW9kXScpLmF0dHIoJ2lkJywgJ2ZvY3VzSW5wUGVyaW9kJyArIG4pO1xuICAgICAgICAkKGFsbEJsb2NrICsgJyAuYWYtaW5wdXQtLXBlcmlvZCBsYWJlbC5qcy1zeW1iX2lucCcpLmF0dHIoJ2ZvcicsICdmb2N1c0lucFBlcmlvZCcgKyBuKTtcbiAgICAgICAgLy8gLS0g0L/QvtC70YPQt9C+0L3QvtC6XG4gICAgICAgICQoYWxsQmxvY2sgKyAnIGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tc3VtJykuYXR0cignaWQnLCAnc3VtJyArIG4pO1xuXG4gICAgfSxcblxuICAgIGNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5tb2RlbC5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgcGVyaW9kID0gdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LUg0YHRg9C80LzRi1xuICAgICAgICAgICAgZmllbGRTdW0gPSAkKCdpbnB1dFtuYW1lPXN1bV0nKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C1INGB0YDQvtC60LBcbiAgICAgICAgICAgIGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICAgICAgLy8g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDQt9C90LDRh9C10L3QuNC1INGB0YPQvNC80Ysg0LfQsNC50LzQsFxuICAgICAgICAkKCcuanMtb3V0LXN1bScpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIoc3VtKSArICcg4oK9Jyk7XG5cbiAgICAgICAgLy8gLS0g0LIg0L/QvtC70LUgY9GD0LzQvNGLXG4gICAgICAgICQoZmllbGRTdW0pLnZhbChzdW0pO1xuICAgICAgICAvLyAtLSDQsiDQv9C+0LvQtSDQv9C10YDQuNC+0LRcbiAgICAgICAgJChmaWVsZFBlcmlvZCkudmFsKHBlcmlvZCk7XG5cbiAgICAgICAgaWYgKHN1bSA+IEFwcENvbnN0YW50cy5zdW1Cb3JkZXIpIHtcbiAgICAgICAgICAgIEFwcEhlbHBlcnMucHJpbnRSZXN1bHRzKCk7XG5cbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzQg0L3QtdC00LXQu9C4Jyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgyKScpLmh0bWwoJzEyINC90LXQtNC10LvRjCcpO1xuXG4gICAgICAgICAgICAvLyDQnNC10L3Rj9C10Lwg0LfQvdCw0YfQtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdwZXJpb2QnLCAxMiwgNCk7XG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSA9PSA0ID8gJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kXScpLmh0bWwoJ9C90LXQtNC10LvQuCcpIDogJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kXScpLmh0bWwoJ9C90LXQtNC10LvRjCcpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpID09IDQgPyAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2QyXScpLmh0bWwoJ9C90LXQtNC10LvQuCcpIDogJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5pbmZvLWJhY2sgc3BhbicpLmh0bWwoJ9CS0L7Qt9Cy0YDQsNGJ0LDQtdGC0LUnKTtcbiAgICAgICAgICAgICQoJy5qcy1vdXQtc3VtX2JhY2snKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHRoaXMubW9kZWwuY2FsY3VsYXRlTG9hblN1bShzdW0sIHBlcmlvZCkpICsgJyDigr0nKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgxKScpLmh0bWwoJzgg0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJy5qcy1yYW5nZV9pbmZvLXBlcmlvZCBzcGFuOm50aC1jaGlsZCgyKScpLmh0bWwoJzMwINC00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2RdJykuaHRtbCgn0LTQvdC10LknKTtcbiAgICAgICAgICAgICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZDJdJykuaHRtbCgn0LTQvdC10LknKTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIDMwLCA4KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQodGhpcy5zdW1SYW5nZXMpLnZhbChzdW0pO1xuICAgICAgICAkKHRoaXMucGVyaW9kUmFuZ2VzKS52YWwocGVyaW9kKTtcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INC/0L7Qu9C30YPQvdC60LAgKHR5cGU6IHN1bSB8fCBwZXJpb2QpXG4gICAgY2hhbmdlUmFuZ2VTbGlkZXI6IGZ1bmN0aW9uICh0eXBlLCBtYXgsIG1pbikge1xuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dC5qcy1zbGlkZXItLScgKyB0eXBlKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHJhbmdlW2ldKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdtYXgnLCBtYXgpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ21pbicsIG1pbilcbiAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKCQocmFuZ2VbaV0pLnZhbCgpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICogMTAwIC8gKCQocmFuZ2VbaV0pLmF0dHIoJ21heCcpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICsgJyUgMTAwJSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHR5cGUsICQocmFuZ2VbaV0pLnZhbCgpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCQocmFuZ2VbaV0pLnZhbCgpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlU3VtUmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1pbiA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgbWF4ID0gJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWF4Jyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgbWF4LCBtaW4pO1xuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVN1bUZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bScpO1xuXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIHZhciBzdW0gPSBwYXJzZUludCgkaW5wdXQudmFsKCkpIHx8IDYwMDA7XG4gICAgICAgIGxldCBwb3cgPSBNYXRoLmNlaWwoc3VtLzEwMCkgKjEwMDtcbiAgICAgICAgaWYoIChwb3cgLSBzdW0pID4gNTApe1xuICAgICAgICAgICAgc3VtID0gcG93IC0gMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VtID0gcG93O1xuICAgICAgICB9XG4gICAgICAgICRpbnB1dC52YWwoc3VtKTtcblxuICAgICAgICBpZiAoc3VtID4gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3N1bScsIEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0pO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIHN1bTogQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ubWF4X3N1bSxcbiAgICAgICAgICAgICAgICB0eXBlOiAndHdvX3dlZWtzJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWluX3N1bSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgICAgIHN1bTogQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWluX3N1bSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnb25jZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdzdW0nLCAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWluJykpO1xuICAgIH0sXG5cbiAgICAvLyDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlUGVyaW9kUmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1pbiA9ICQodGhpcy5wZXJpb2RSYW5nZXMpLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgbWF4ID0gJCh0aGlzLnBlcmlvZFJhbmdlcykuYXR0cignbWF4Jyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgbWF4LCBtaW4pO1xuXG4gICAgfSxcblxuICAgIC8vIC0tINCS0YvQsdC+0YAg0YHRgNC+0LrQsCDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9GPXG4gICAgY2hhbmdlUGVyaW9kRmllbGQ6IGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgLy8g0JjQt9C80LXQvdGP0LXQvCDQv9C+0LvQt9GD0L3QvtC6XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJyk7XG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAvLyDQodGC0LjQu9C4INC00LvRjyDQv9C+0LvQt9GD0L3QutCwXG4gICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAocmFuZ2UudmFsKCkgLSByYW5nZS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAocmFuZ2UuYXR0cignbWF4JykgLSByYW5nZS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJhbmdlLnZhbCgpID4gMTAwMDApIHtcbiAgICAgICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KHJnYigyNTQsIDE1MCwgMzkpLCByZ2IoMjU0LCAxNTAsIDM5KSknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdwZXJpb2QnLCBlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgJCgnLmpzLXBlcmlvZCcpLnZhbCh0aGlzLm1vZGVsLmdldCgncGVyaW9kJykpO1xuICAgIH0sXG5cbiAgICBsaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnIzE4YTRkMidcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9mZkxpZ2h0Qm9yZGVySW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICQoZS50YXJnZXQpLm5leHQoJ2xhYmVsJykuY3NzKHtcbiAgICAgICAgICAgICdib3JkZXJDb2xvcic6ICcjYjBiYWM1J1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hbkNhbGN1bGF0b3JWaWV3OyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG52YXIgQXBwQ29uc3RhbnRzID0ge1xuICAgIHRhcnJpZnM6IFt7XG4gICAgICAgIGdyYWRlX2lkOiAxLFxuICAgICAgICBuYW1lOiAn0J7QsdGL0YfQvdGL0LknLFxuICAgICAgICBtaW5fbGltaXQ6IDAsXG4gICAgICAgIG1heF9saW1pdDogMjk5OTksXG4gICAgICAgIG1pbl9zdW06IDE1MDAsXG4gICAgICAgIG1heF9zdW06IDI5OTk5LFxuICAgICAgICBwZXJjZW50OiAwLjAxNSxcbiAgICAgICAgcGVyaW9kX29uY2U6IHtcbiAgICAgICAgICAgIG1pbjogOCxcbiAgICAgICAgICAgIG1heDogMzBcbiAgICAgICAgfSxcbiAgICAgICAgcGVyaW9kX3R3OiB7XG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDBcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQtNC+0YHRgtGD0L/QtdC9INC00LvRjyDQstGB0LXRhSDQt9Cw0LXQvNGJ0LjQutC+0LInXG4gICAgfSwge1xuICAgICAgICBncmFkZV9pZDogMixcbiAgICAgICAgbmFtZTogJ9Cf0YDQtdC80LjRg9C8JyxcbiAgICAgICAgbWluX2xpbWl0OiAzMDAwMCxcbiAgICAgICAgbWF4X2xpbWl0OiA1MDAwMCxcbiAgICAgICAgbWluX3N1bTogMzAwMDAsXG4gICAgICAgIG1heF9zdW06IDUwMDAwLFxuICAgICAgICBwZXJjZW50OiAwLjAwNDksXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDBcbiAgICAgICAgfSxcbiAgICAgICAgcGVyaW9kX3R3OiB7XG4gICAgICAgICAgICBtaW46IDI4LFxuICAgICAgICAgICAgbWF4OiA4NFxuICAgICAgICB9LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ9Cx0YPQtNC10YIg0LTQvtGB0YLRg9C/0LXQvSDQv9C+0YHQu9C1INGB0LLQvtC10LLRgNC10LzQtdC90L3QvtCz0L4g0L/QvtCz0LDRiNC10L3QuNGPINC+0LTQvdC+0LPQviDQt9Cw0LnQvNCwJ1xuICAgIH1dLFxuICAgIGZlZUlzc3VlOiAwLjA1LFxuICAgIGZhY3Rvck1heDogMC4xNSxcbiAgICBmYWN0b3JNaW46IDAuMDEsXG4gICAgc3VtQm9yZGVyOiAzMDAwMCxcbiAgICBGRUVfSVNTVUU6IDAuMDUsIC8vINCa0L7QvNC80LjRgdC40Y8g0LfQsCDQstGL0LTQsNGH0YNcbiAgICBQRVJDRU5UX1NUQU5EQVJUOiAwLjAxNSwgLy8g0KHRgtCw0L3QtNCw0YDRgtC90YvQuSDQv9GA0L7RhtC10L3RgiAo0LIg0LTQtdC90YwpXG4gICAgUEVSQ0VOVF9ERUxBWTogMC4wMTUsIC8vINCf0YDQvtGG0LXQvdGCINCyINGB0LvRg9GH0LDQtSDQv9GA0L7RgdGA0L7Rh9C60LggKNCyINC00LXQvdGMKVxuICAgIEZJTkVfREVMQVk6IDEwMDAuMDAsIC8vINCc0LDQutGB0LjQvNCw0LvRjNC90LDRjyDRgdGD0LzQvNCwINGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtCz0L4g0YjRgtGA0LDRhNCwINC30LAg0L/RgNC+0YHRgNC+0YfQutGDXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENvbnN0YW50czsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwOC4xMi4xNi5cbiAqL1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5cbnZhciBBcHBIZWxwZXJzID0ge1xuICAgIC8vIEBUT0RPOiB1cmxcbiAgICBiYXNlVXJsOiAnJyxcblxuICAgIC8vIGFqYXhcbiAgICBhamF4V3JhcHBlcjogKHVybCwgdHlwZSwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHR5cGUgPSB0eXBlIHx8ICdQT1NUJztcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIHN1Y2Nlc3NDYWxsYmFjayA9IHN1Y2Nlc3NDYWxsYmFjayB8fCBmdW5jdGlvbihkYXRhKSB7fTtcbiAgICAgICAgZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJtc2cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVybXNnKTtcbiAgICAgICAgfTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogQXBwSGVscGVycy5iYXNlVXJsICsgdXJsLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGVycm9yQ2FsbGJhY2tcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vINCk0LjQvdCw0LvRjNC90LDRjyDRgdGD0LzQvNCwXG4gICAgcHJpbnRSZXN1bHRzOiAoKSA9PiB7XG4gICAgICAgIGxldCBzdW0gPSBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKTtcbiAgICAgICAgbGV0IGRheXMgPSBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKTtcblxuICAgICAgICBsZXQgcGF5bWV0aG9kO1xuXG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSBwYXltZXRob2QgPSAn0KDQsNC30L7QstGL0Lkg0L/Qu9Cw0YLRkdC2INC90LAg0YHRg9C80LzRgyc7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF5cyAqPSA3O1xuICAgICAgICAgICAgcGF5bWV0aG9kID0gKEFwcEhlbHBlcnMuZXN0aW1hdGVBbm5QZXJpb2RzKGRheXMpICsgJyAnICsgQXBwSGVscGVycy5nZXRDYXNlKEFwcEhlbHBlcnMuZXN0aW1hdGVBbm5QZXJpb2RzKGRheXMpLCAn0L/Qu9Cw0YLRkdC2JywgJ9C/0LvQsNGC0LXQttCwJywgJ9C/0LvQsNGC0LXQttC10LknKSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VtID0gQXBwSGVscGVycy5lc3RpbWF0ZVJldHVyblN1bShzdW0sIGRheXMpO1xuXG4gICAgICAgICQoJy5pbmZvLWJhY2sgc3BhbicpLmh0bWwocGF5bWV0aG9kKycg0L/QvicpO1xuXG4gICAgICAgICQoJy5qcy1vdXQtc3VtX2JhY2snKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHN1bSkgKyAnIOKCvScpO1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZUFublBlcmlvZHM6IChkYXlzKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwoZGF5cyAvIDE0KTtcbiAgICB9LFxuXG4gICAgZ2V0Q2FzZTogKF9udW1iZXIsIF9jYXNlMSwgX2Nhc2UyLCBfY2FzZTMpID0+IHtcbiAgICAgICAgdmFyIGJhc2UgPSBfbnVtYmVyIC0gTWF0aC5mbG9vcihfbnVtYmVyIC8gMTAwKSAqIDEwMDtcbiAgICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgICBpZiAoYmFzZSA+IDkgJiYgYmFzZSA8IDIwKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBfY2FzZTM7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZW1haW5kZXIgPSBfbnVtYmVyIC0gTWF0aC5mbG9vcihfbnVtYmVyIC8gMTApICogMTA7XG5cbiAgICAgICAgICAgIGlmICgxID09IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UxO1xuICAgICAgICAgICAgZWxzZSBpZiAoMCA8IHJlbWFpbmRlciAmJiA1ID4gcmVtYWluZGVyKSByZXN1bHQgPSBfY2FzZTI7XG4gICAgICAgICAgICBlbHNlIHJlc3VsdCA9IF9jYXNlMztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGVzdGltYXRlUmV0dXJuU3VtOiAoc3VtLCBkYXlzKSA9PiB7XG4gICAgICAgIGNvbnN0IGZlZUlzc3VlID0gQXBwQ29uc3RhbnRzLmZlZUlzc3VlO1xuICAgICAgICBjb25zdCBmYWN0b3JNYXggPSBBcHBDb25zdGFudHMuZmFjdG9yTWF4O1xuICAgICAgICBjb25zdCBmYWN0b3JNaW4gPSBBcHBDb25zdGFudHMuZmFjdG9yTWluO1xuXG4gICAgICAgIHN1bSA9IE51bWJlcihzdW0pO1xuICAgICAgICBsZXQgcGF5YmFjayA9IE1hdGguY2VpbChzdW0gKiBmZWVJc3N1ZSk7XG4gICAgICAgIC8v0KDQsNC30L7QstGL0Lkg0L/Qu9Cw0YLQtdC2XG4gICAgICAgIGlmIChzdW0gPCBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoKHN1bSArIHBheWJhY2spICogKEFwcENvbnN0YW50cy50YXJyaWZzWzBdLnBlcmNlbnQgKiBkYXlzICsgMSkpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLnBlcmNlbnQgKiAxNDtcbiAgICAgICAgICAgIGxldCBhbm5fcGVyaW9kcyA9IGRheXMgLyAxNDtcbiAgICAgICAgICAgIGxldCBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykpIC8gKE1hdGgucG93KCgxICsgcGVyY2VudCksIGFubl9wZXJpb2RzKSAtIDEpO1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIGFubnVpdHkpO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBmb3JtYXROdW1iZXI6IChudW0pID0+IHtcbiAgICAgICAgcmV0dXJuIG51bS50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZFxcZCkrKFteXFxkXXwkKSkvZywgJyQxICcpO1xuICAgIH0sXG5cbiAgICAvLyDQktCw0LvQuNC00LDRhtC40Y8g0YTQvtGA0LxcbiAgICBmb3JtVmFsaWRhdGU6IGZ1bmN0aW9uIChmb3JtSWQpIHtcbiAgICAgICAgbGV0IGZvcm0gPSAnIycgKyBmb3JtSWQ7XG4gICAgICAgIGxldCBmaWVsZCA9ICQoZm9ybSArICcgW2RhdGEtdHlwZT1maWVsZF0nKTtcbiAgICAgICAgbGV0IGVyciA9ICQoZm9ybSArICcgLmJsb2NrLWVycicpO1xuICAgICAgICBsZXQgYnRuID0gJChmb3JtICsgJyBhLmFiX2J1dHRvbicpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkKGZpZWxkW2ldKS52YWwoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgJChmaWVsZFtpXSkuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGZpZWxkW2ldKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKSAhPT0gJCgnI3VzZXJQYXNzJykudmFsKCkgPyAkKCcjdXNlclJlcGVhdFBhc3MnKS5hZGRDbGFzcygnZXJyLWZpZWxkJykgOiAkKCcjdXNlclJlcGVhdFBhc3MnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICQoJyN1c2VyUGFzcycpLnZhbCgpLmxlbmd0aCA8IDYgPyAkKCcjdXNlclBhc3MnKS5hZGRDbGFzcygnZXJyLWZpZWxkJykgOiAkKCcjdXNlclBhc3MnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG5cbiAgICAgICAgaWYgKCQoZm9ybSArICcgLmVyci1maWVsZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAkKGJ0bikucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAkKGVycikuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChidG4pLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcEhlbHBlcnM7Il19
