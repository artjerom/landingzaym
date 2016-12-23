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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjtBQVFKLHVDQUEyQiwwQkFSdkI7O0FBVUo7QUFDQSxxQ0FBeUIsY0FYckI7O0FBYUo7QUFDQSxtQ0FBdUIsV0FkbkI7QUFlSixrQ0FBc0IsV0FmbEI7O0FBaUJKO0FBQ0Esc0NBQTBCLGdCQWxCdEI7QUFtQko7QUFDQSxzQ0FBMEIsZ0JBcEJ0Qjs7QUFzQko7QUFDQSx1Q0FBMkIsY0F2QnZCO0FBd0JKLG9DQUF3QixlQXhCcEI7QUF5QkosbUNBQXVCLGNBekJu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QUYsRUFBTyxJQUFQO0FBQ0g7QUFFSjtBQXJIWSxDQUFqQixDLENBTEE7OztrQkE2SGUsVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgTG9hbkNhbGN1bGF0b3JNb2RlbCBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvclZpZXcgZnJvbSAnLi9hcHAvTG9hbkNhbGN1bGF0b3JWaWV3JztcblxuJChmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LmFwcCA9IHt9O1xuXG4gICAgLy8g0JrQsNC70YzQutGD0LvRj9GC0L7RgFxuICAgIGFwcC5sb2FuQ2FsY3VsYXRvciA9IG5ldyBMb2FuQ2FsY3VsYXRvck1vZGVsKHtcblxuICAgIH0pO1xuICAgIGFwcC5sb2FuQ2FsY3VsYXRvclZpZXcgPSBuZXcgTG9hbkNhbGN1bGF0b3JWaWV3KHtcbiAgICAgICAgbW9kZWw6IGFwcC5sb2FuQ2FsY3VsYXRvcixcbiAgICAgICAgZWw6ICdmb3JtLmNhbGMnXG4gICAgfSk7XG5cbiAgICBsZXQgQXBwTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgICAgICBkZWZhdWx0czoge31cbiAgICB9KTtcblxuICAgIGFwcC5tb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXG4gICAgdmFyIEFwcFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnYm9keScsXG5cbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAvLyDQodC/0L7RgdC+0LEg0LLRi9C00LDRh9C4XG4gICAgICAgICAgICAnY2xpY2sgLm1ldGhvZCc6ICdjaGFuZ2VNZXRob2QnLFxuXG4gICAgICAgICAgICAvLyDQotCw0LHRiyAn0L/QvtGH0LXQvNGDINC80YsnXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bi1hYm91dCc6ICdjaGFuZ2VBYm91dFRhYicsXG4gICAgICAgICAgICAvLyDQotCw0LHRiyAn0JLQvtC/0YDQvtGB0Ysg0Lgg0L7RgtCy0LXRgtGLJ1xuICAgICAgICAgICAgJ2NsaWNrIC5idG4tcXVlc3Rpb25zJzogJ2NoYW5nZVF1ZXN0aW9uVGFiJyxcbiAgICAgICAgICAgICdjbGljayAuanNfdGFiLXF1ZXN0LWdldCc6ICdjaGFuZ2VRdWVzdGlvblRhYkdldFpheW0nLFxuXG4gICAgICAgICAgICAvLyDQoNCw0YHQutGA0YvRgtGMINC60L7QvNC10L3RgtGLXG4gICAgICAgICAgICAnY2xpY2sgLnVwZGF0ZS1jb21tZW50JzogJ3Nob3dDb21tZW50cycsXG5cbiAgICAgICAgICAgIC8vINCh0LvQsNC50LTQtdGAXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1yaWdodCc6ICduZXh0U2xpZGUnLFxuICAgICAgICAgICAgJ2NsaWNrIC5hcnJvdy0tbGVmdCc6ICdwcmV2U2xpZGUnLFxuXG4gICAgICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWJ0bl9yZWdpc3Rlcic6ICdoYW5kbGVSZWdpc3RlcicsXG4gICAgICAgICAgICAvLyDQntCx0YDQsNGC0L3QsNGPINGB0LLRj9C30YxcbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX2ZlZWRiYWNrJzogJ2hhbmRsZUZlZWRiYWNrJyxcblxuICAgICAgICAgICAgLy8g0JTQu9GPINC/0L7Qv9Cw0L/QvtCyXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXNob3dfcmVnaXN0ZXInOiAnc2hvd1JlZ2lzdGVyJyxcbiAgICAgICAgICAgICdjbGljayAuanMtcGF5X21ldGhvZCc6ICdzaG93UGF5TWV0aG9kJyxcbiAgICAgICAgICAgICdjbGljayAuYnRuX2ZlZWRiYWNrJzogJ3Nob3dGZWVkYmFjaycsXG4gICAgICAgICAgICAnY2hhbmdlIC5wb3B1cCc6ICdjaGFuZ2VQb3B1cycsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWNsb3NlX3BvcHVwJzogJ2Nsb3NlUG9wdXAnXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnI3VzZXJQaG9uZScpLm1hc2soXCIrNyAoOTk5KSA5OTktOTk5OVwiKTtcblxuICAgICAgICAgICAgLy8g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDQstGA0LXQvNGPXG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBkYXRlLnNldE1pbnV0ZXMoZGF0ZS5nZXRNaW51dGVzKCkgKyAxNSk7XG5cbiAgICAgICAgICAgIGxldCByZXNIb3VyID0gZGF0ZS5nZXRIb3VycygpLFxuICAgICAgICAgICAgICAgIHJlc01pbiA9IGRhdGUuZ2V0TWludXRlcygpO1xuXG4gICAgICAgICAgICBpZiAoZGF0ZS5nZXRIb3VycygpLnRvU3RyaW5nKCkubGVuZ3RoID09IDEpIHJlc0hvdXIgPSAnMCcgKyBkYXRlLmdldEhvdXJzKCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRlLmdldE1pbnV0ZXMoKS50b1N0cmluZygpLmxlbmd0aCA9PSAxKSByZXNNaW4gPSAnMCcgKyBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICAgICAgbGV0IHJlcyA9IHJlc0hvdXIgKyAnOicgKyByZXNNaW47XG5cbiAgICAgICAgICAgICQoJy55b3UtbG9hbiAuanMtbG9hbicpLmh0bWwoJyAnICsgcmVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQktGL0LHQvtGAINGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBjaGFuZ2VNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5tZXRob2QnKS50b2dnbGVDbGFzcygnbWV0aG9kLS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gLS0g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDRgtC10LrRgdGCXG4gICAgICAgICAgICAkKCcuanMtcGF5X21ldGhvZCcpLmh0bWwoJCgnLm1ldGhvZC0tYWN0aXZlJykuZmluZCgnLmpzLXRleHRfbWV0aG9kJykuaHRtbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YLQsNCx0L7QsiAo0LTQvtC70LbQvdC+INGA0LDQsdC+0YLQsNGC0Ywg0Lgg0L3QsCDQtNC10YHQutGC0L7Qv9C1KVxuICAgICAgICBjaGFuZ2VBYm91dFRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5idG4tYWJvdXQtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1hYm91dC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNhYm91dFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gLS0g0LLQvtC/0YDQvtGB0Ysg0Lgg0L7RgtCy0LXRgtGLXG4gICAgICAgIGNoYW5nZVF1ZXN0aW9uVGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1xdWVzdGlvbnMtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1xdWVzdGlvbnMtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBsZXQgdGFiSWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXRhYicpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YWJJZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldCk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudC1xdWVzdCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNRdWVzdFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gLS0tLSDQstC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YsgKNCf0L7Qu9GD0YfQtdC90LjQtSDQt9Cw0LnQvNCwKVxuICAgICAgICBjaGFuZ2VRdWVzdGlvblRhYkdldFpheW06IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuanNfdGFiLXF1ZXN0LWdldC0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnanNfdGFiLXF1ZXN0LWdldC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhYklkKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcblxuICAgICAgICAgICAgJCgnLmpzX2dldC16YXltLXRhYi1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzX2dldC16YXltLXRhYi1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI1F1ZXN0R2V0WmF5bVRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqc19nZXQtemF5bS10YWItY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd0NvbW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuaWNvX3VwZGF0ZS1jb21tZW50cycpLmFkZENsYXNzKCdpY29fdXBkYXRlLWNvbW1lbnRzLS1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5qcy1yb3ctY29tbWVudCcpLnNsaWRlRG93big1MDApLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2ZsZXgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnLnJvdy1jb21tZW50LWhpZGUnKS5zbGlkZVVwKDY1MCk7XG4gICAgICAgICAgICAgICAgJCgnLnVwZGF0ZS1jb21tZW50JykuaGlkZSgxMDApO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KHQu9C10LTRg9GO0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgbmV4dFNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPD0gLTU0MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgLSAyNzAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyDQn9GA0LXQtNGL0LTRg9GJ0LjQuSDRgdC70LDQudC0XG4gICAgICAgIHByZXZTbGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5jb250ZW50LXNsaWRlcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnLjNzIGVhc2Utb3V0JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodmFsdWUpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAtNTQwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSArIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1xuICAgICAgICBoYW5kbGVSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHBob25lID0gJCgnI3VzZXJQaG9uZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3MgPSAkKCcjdXNlclBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICByZVBhc3MgPSAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBwZXJpb2QgPSBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKTtcblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCXG5cbiAgICAgICAgICAgIGlmIChwYXNzICE9PSByZVBhc3MpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlcGVhdC1wYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9GMINC60L7RgNC+0YLQutC40LlcblxuICAgICAgICAgICAgaWYgKHBhc3MubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgJCgnI3VzZXJQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFzcy5sZW5ndGggPj0gNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJCgnI3VzZXJQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0YLQtdC70LXRhNC+0L3QsFxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoICE9IDE3KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZVBhc3MgJiYgcGFzcy5sZW5ndGggPj0gNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCgnI2FncmVlbWVudCcpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogcGhvbmUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3MsXG4gICAgICAgICAgICAgICAgcmVQYXNzd29yZDogcmVQYXNzLFxuICAgICAgICAgICAgICAgIHN1bTogYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyksXG4gICAgICAgICAgICAgICAgYWdyZWVtZW50OiAkKCcjYWdyZWVtZW50JykucHJvcCgnY2hlY2tlZCcpLFxuICAgICAgICAgICAgICAgIHBlcmlvZDogYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJykgPiBBcHBDb25zdGFudHMuc3VtQm9yZGVyID8gcGVyaW9kICogNyA6IHBlcmlvZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2pzUmVnaXN0ZXInKTtcblxuICAgICAgICAgICAgLy8g0JfQsNC/0YDQvtGBXG4gICAgICAgICAgICBpZiAoISQoJy5qcy1idG5fcmVnaXN0ZXInKS5oYXNDbGFzcygnaXMtZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgIEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvcmVnaXN0ZXInLFxuICAgICAgICAgICAgICAgICAgICAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDRhNC+0YDQvNGLINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfQuFxuICAgICAgICBoYW5kbGVGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHRoZW1lID0gJCgnLmpzLWZlZWQtc2VsZWN0X3RoZW1lIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgIGVtYWlsID0gJCgnLmpzLWZlZWQtZW1haWwnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJCgnLmpzLWZlZWQtbWVzc2FnZScpLnZhbCgpO1xuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0aGVtZTogdGhlbWUsXG4gICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFwcEhlbHBlcnMuZm9ybVZhbGlkYXRlKCdqc0ZlZWRiYWNrJyk7XG5cbiAgICAgICAgICAgIC8vINCX0LDQv9GA0L7RgVxuXG4gICAgICAgICAgICBpZiAoISQoJy5qcy1idG5fZmVlZGJhY2snKS5oYXNDbGFzcygnaXMtZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvZmVlZGJhY2snLFxuICAgICAgICAgICAgICAgICAgICAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWdpc3RlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XG4gICAgICAgIHNob3dSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1yZWdpc3RlcicpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQstGL0LHQvtGA0L7QvCDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y9cbiAgICAgICAgc2hvd1BheU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1tZXRob2QnKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9GM0Y5cbiAgICAgICAgc2hvd0ZlZWRiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLWZlZWRiYWNrJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQl9Cw0LrRgNGL0YLRjCDQv9C+0L/QsNC/XG4gICAgICAgIGNsb3NlUG9wdXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cCcpLmZhZGVPdXQoMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGFwcC52aWV3ID0gbmV3IEFwcFZpZXcoKTtcblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIExvYW5DYWxjdWxhdG9yTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIC8vINCX0L3QsNGH0LXQvdC40Y8g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBzdW06IDYwMDAsXG4gICAgICAgIHBlcmlvZDogMTIsXG4gICAgICAgIHR5cGU6ICdvbmNlJywgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIHNob3dQZXJpb2Q6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG5cbiAgICBzdW1SYW5nZXM6ICQoJ2lucHV0LmpzLXNsaWRlci0tc3VtJyksXG4gICAgcGVyaW9kUmFuZ2VzOiAkKCdpbnB1dC5qcy1zbGlkZXItLXBlcmlvZCcpLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bSc6ICdjaGFuZ2VTdW1SYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXN1bSc6ICdjaGFuZ2VTdW1GaWVsZCcsXG5cbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJzogJ2NoYW5nZVBlcmlvZFJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtcGVyaW9kJzogJ2NoYW5nZVBlcmlvZEZpZWxkJyxcblxuICAgICAgICAvLyDQlNC70Y8g0L/QvtC70LXQuSDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LBcbiAgICAgICAgJ2ZvY3VzIC5yYW5nZV9maWVsZCc6ICdsaWdodEJvcmRlcklucHV0JyxcbiAgICAgICAgJ2ZvY3Vzb3V0IC5yYW5nZV9maWVsZCc6ICdvZmZMaWdodEJvcmRlcklucHV0J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRoaXMudGVtcGxhdGUgPSAkKCcjdGVtcGxhdGVDYWxjJykuaHRtbCgpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdGVtcGxhdGVDYWxjJykuaHRtbCgpKTtcblxuICAgICAgICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZW5kZXJlZCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy4kZWwuaHRtbChyZW5kZXJlZCk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VDYWxjKCd5b3UtZ2V0JywgMik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDRiNCw0LHQu9C+0L3QsFxuICAgIGNoYW5nZUNhbGM6IGZ1bmN0aW9uIChzZWN0aW9uLCBuKSB7XG4gICAgICAgbGV0IGFsbEJsb2NrID0gJyMnICsgc2VjdGlvbjtcblxuICAgICAgICAvLyDQlNC70Y8g0YHRg9C80LzRi1xuICAgICAgICAvLyAtLSDQv9C+0LvRj1xuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFtuYW1lPXN1bV0nKS5hdHRyKCdpZCcsICdmb2N1c0lucFN1bScgKyBuKTtcbiAgICAgICAgJChhbGxCbG9jayArICcgLmFmLWlucHV0LS1zdW0gbGFiZWwuanMtc3ltYl9pbnAnKS5hdHRyKCdmb3InLCAnZm9jdXNJbnBTdW0nICsgbik7XG4gICAgICAgIC8vIC0tINC/0L7Qu9GD0LfQvtC90L7QulxuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bScpLmF0dHIoJ2lkJywgJ3N1bScgKyBuKTtcblxuXG4gICAgICAgIC8vINCU0LvRjyDQv9C10YDQuNC+0LTQsFxuICAgICAgICAvLyAtLSDQv9C+0LvRj1xuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFtuYW1lPXBlcmlvZF0nKS5hdHRyKCdpZCcsICdmb2N1c0lucFBlcmlvZCcgKyBuKTtcbiAgICAgICAgJChhbGxCbG9jayArICcgLmFmLWlucHV0LS1wZXJpb2QgbGFiZWwuanMtc3ltYl9pbnAnKS5hdHRyKCdmb3InLCAnZm9jdXNJbnBQZXJpb2QnICsgbik7XG4gICAgICAgIC8vIC0tINC/0L7Qu9GD0LfQvtC90L7QulxuICAgICAgICAkKGFsbEJsb2NrICsgJyBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bScpLmF0dHIoJ2lkJywgJ3N1bScgKyBuKTtcblxuICAgIH0sXG5cbiAgICBjaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMubW9kZWwuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgIHBlcmlvZCA9IHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C1INGB0YPQvNC80YtcbiAgICAgICAgICAgIGZpZWxkU3VtID0gJCgnaW5wdXRbbmFtZT1zdW1dJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQtSDRgdGA0L7QutCwXG4gICAgICAgICAgICBmaWVsZFBlcmlvZCA9ICQoJ2lucHV0W25hbWU9cGVyaW9kXScpO1xuXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtSDRgdGD0LzQvNGLINC30LDQudC80LBcbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHN1bSkgKyAnIOKCvScpO1xuXG4gICAgICAgIC8vIC0tINCyINC/0L7Qu9C1IGPRg9C80LzRi1xuICAgICAgICAkKGZpZWxkU3VtKS52YWwoc3VtKTtcbiAgICAgICAgLy8gLS0g0LIg0L/QvtC70LUg0L/QtdGA0LjQvtC0XG4gICAgICAgICQoZmllbGRQZXJpb2QpLnZhbChwZXJpb2QpO1xuXG4gICAgICAgIGlmIChzdW0gPiBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSB7XG4gICAgICAgICAgICBBcHBIZWxwZXJzLnByaW50UmVzdWx0cygpO1xuXG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMSknKS5odG1sKCc0INC90LXQtNC10LvQuCcpO1xuXG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMiknKS5odG1sKCcxMiDQvdC10LTQtdC70YwnKTtcblxuICAgICAgICAgICAgLy8g0JzQtdC90Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgMTIsIDQpO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgncGVyaW9kJykgPT0gNCA/ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSA9PSA0ID8gJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZDJdJykuaHRtbCgn0L3QtdC00LXQu9GMJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKCfQktC+0LfQstGA0LDRidCw0LXRgtC1Jyk7XG4gICAgICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcih0aGlzLm1vZGVsLmNhbGN1bGF0ZUxvYW5TdW0oc3VtLCBwZXJpb2QpKSArICcg4oK9Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMSknKS5odG1sKCc4INC00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMiknKS5odG1sKCczMCDQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kXScpLmh0bWwoJ9C00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2QyXScpLmh0bWwoJ9C00L3QtdC5Jyk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdwZXJpb2QnLCAzMCwgOCk7XG4gICAgICAgIH1cblxuICAgICAgICAkKHRoaXMuc3VtUmFuZ2VzKS52YWwoc3VtKTtcbiAgICAgICAgJCh0aGlzLnBlcmlvZFJhbmdlcykudmFsKHBlcmlvZCk7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwICh0eXBlOiBzdW0gfHwgcGVyaW9kKVxuICAgIGNoYW5nZVJhbmdlU2xpZGVyOiBmdW5jdGlvbiAodHlwZSwgbWF4LCBtaW4pIHtcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXQuanMtc2xpZGVyLS0nICsgdHlwZSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJChyYW5nZVtpXSlcbiAgICAgICAgICAgICAgICAuYXR0cignbWF4JywgbWF4KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdtaW4nLCBtaW4pXG4gICAgICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICgkKHJhbmdlW2ldKS52YWwoKSAtICQocmFuZ2VbaV0pLmF0dHIoJ21pbicpKSAqIDEwMCAvICgkKHJhbmdlW2ldKS5hdHRyKCdtYXgnKSAtICQocmFuZ2VbaV0pLmF0dHIoJ21pbicpKSArICclIDEwMCUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldCh0eXBlLCAkKHJhbmdlW2ldKS52YWwoKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsIG1heCwgbWluKTtcbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VTdW1GaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKTtcblxuICAgICAgICB2YXIgJGlucHV0ID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICB2YXIgc3VtID0gcGFyc2VJbnQoJGlucHV0LnZhbCgpKSB8fCA2MDAwO1xuICAgICAgICBsZXQgcG93ID0gTWF0aC5jZWlsKHN1bS8xMDApICoxMDA7XG4gICAgICAgIGlmKCAocG93IC0gc3VtKSA+IDUwKXtcbiAgICAgICAgICAgIHN1bSA9IHBvdyAtIDEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1bSA9IHBvdztcbiAgICAgICAgfVxuICAgICAgICAkaW5wdXQudmFsKHN1bSk7XG5cbiAgICAgICAgaWYgKHN1bSA+IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdW0nLCBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ3R3b193ZWVrcydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1pbl9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1pbl9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ29uY2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWF4JyksICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21pbicpKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMucGVyaW9kUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5wZXJpb2RSYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIG1heCwgbWluKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0L/QvtC70LfRg9C90L7QulxuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCcpO1xuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgLy8g0KHRgtC40LvQuCDQtNC70Y8g0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHJhbmdlLnZhbCgpIC0gcmFuZ2UuYXR0cignbWluJykpICogMTAwIC8gKHJhbmdlLmF0dHIoJ21heCcpIC0gcmFuZ2UuYXR0cignbWluJykpICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgICQoJy5qcy1wZXJpb2QnKS52YWwodGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpKTtcbiAgICB9LFxuXG4gICAgbGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyMxOGE0ZDInXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmZMaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnI2IwYmFjNSdcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XSxcbiAgICBmZWVJc3N1ZTogMC4wNSxcbiAgICBmYWN0b3JNYXg6IDAuMTUsXG4gICAgZmFjdG9yTWluOiAwLjAxLFxuICAgIHN1bUJvcmRlcjogMzAwMDAsXG4gICAgRkVFX0lTU1VFOiAwLjA1LCAvLyDQmtC+0LzQvNC40YHQuNGPINC30LAg0LLRi9C00LDRh9GDXG4gICAgUEVSQ0VOVF9TVEFOREFSVDogMC4wMTUsIC8vINCh0YLQsNC90LTQsNGA0YLQvdGL0Lkg0L/RgNC+0YbQtdC90YIgKNCyINC00LXQvdGMKVxuICAgIFBFUkNFTlRfREVMQVk6IDAuMDE1LCAvLyDQn9GA0L7RhtC10L3RgiDQsiDRgdC70YPRh9Cw0LUg0L/RgNC+0YHRgNC+0YfQutC4ICjQsiDQtNC10L3RjClcbiAgICBGSU5FX0RFTEFZOiAxMDAwLjAwLCAvLyDQnNCw0LrRgdC40LzQsNC70YzQvdCw0Y8g0YHRg9C80LzQsCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7Qs9C+INGI0YLRgNCw0YTQsCDQt9CwINC/0YDQvtGB0YDQvtGH0LrRg1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBDb25zdGFudHM7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDguMTIuMTYuXG4gKi9cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICAvLyBAVE9ETzogdXJsXG4gICAgYmFzZVVybDogJycsXG5cbiAgICAvLyBhamF4XG4gICAgYWpheFdyYXBwZXI6ICh1cmwsIHR5cGUsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgPT4ge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCAnUE9TVCc7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBzdWNjZXNzQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkge307XG4gICAgICAgIGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVybXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEFwcEhlbHBlcnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvckNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDQpNC40L3QsNC70YzQvdCw0Y8g0YHRg9C80LzQsFxuICAgIHByaW50UmVzdWx0czogKCkgPT4ge1xuICAgICAgICBsZXQgc3VtID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyk7XG4gICAgICAgIGxldCBkYXlzID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgbGV0IHBheW1ldGhvZDtcblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikgcGF5bWV0aG9kID0gJ9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0ZHQtiDQvdCwINGB0YPQvNC80YMnO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheXMgKj0gNztcbiAgICAgICAgICAgIHBheW1ldGhvZCA9IChBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSArICcgJyArIEFwcEhlbHBlcnMuZ2V0Q2FzZShBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSwgJ9C/0LvQsNGC0ZHQticsICfQv9C70LDRgtC10LbQsCcsICfQv9C70LDRgtC10LbQtdC5JykpO1xuICAgICAgICB9XG4gICAgICAgIHN1bSA9IEFwcEhlbHBlcnMuZXN0aW1hdGVSZXR1cm5TdW0oc3VtLCBkYXlzKTtcblxuICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKHBheW1ldGhvZCsnINC/0L4nKTtcblxuICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVBbm5QZXJpb2RzOiAoZGF5cykgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGRheXMgLyAxNCk7XG4gICAgfSxcblxuICAgIGdldENhc2U6IChfbnVtYmVyLCBfY2FzZTEsIF9jYXNlMiwgX2Nhc2UzKSA9PiB7XG4gICAgICAgIHZhciBiYXNlID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwMCkgKiAxMDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGJhc2UgPiA5ICYmIGJhc2UgPCAyMCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gX2Nhc2UzO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVtYWluZGVyID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwKSAqIDEwO1xuXG4gICAgICAgICAgICBpZiAoMSA9PSByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKDAgPCByZW1haW5kZXIgJiYgNSA+IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UyO1xuICAgICAgICAgICAgZWxzZSByZXN1bHQgPSBfY2FzZTM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZVJldHVyblN1bTogKHN1bSwgZGF5cykgPT4ge1xuICAgICAgICBjb25zdCBmZWVJc3N1ZSA9IEFwcENvbnN0YW50cy5mZWVJc3N1ZTtcbiAgICAgICAgY29uc3QgZmFjdG9yTWF4ID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1heDtcbiAgICAgICAgY29uc3QgZmFjdG9yTWluID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1pbjtcblxuICAgICAgICBzdW0gPSBOdW1iZXIoc3VtKTtcbiAgICAgICAgbGV0IHBheWJhY2sgPSBNYXRoLmNlaWwoc3VtICogZmVlSXNzdWUpO1xuICAgICAgICAvL9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0LXQtlxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogZGF5cyArIDEpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogMTQ7XG4gICAgICAgICAgICBsZXQgYW5uX3BlcmlvZHMgPSBkYXlzIC8gMTQ7XG4gICAgICAgICAgICBsZXQgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykgLSAxKTtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiBhbm51aXR5KTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGE0L7RgNC8XG4gICAgZm9ybVZhbGlkYXRlOiBmdW5jdGlvbiAoZm9ybUlkKSB7XG4gICAgICAgIGxldCBmb3JtID0gJyMnICsgZm9ybUlkO1xuICAgICAgICBsZXQgZmllbGQgPSAkKGZvcm0gKyAnIFtkYXRhLXR5cGU9ZmllbGRdJyk7XG4gICAgICAgIGxldCBlcnIgPSAkKGZvcm0gKyAnIC5ibG9jay1lcnInKTtcbiAgICAgICAgbGV0IGJ0biA9ICQoZm9ybSArICcgYS5hYl9idXR0b24nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChmaWVsZFtpXSkudmFsKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoZmllbGRbaV0pLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChmaWVsZFtpXSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJCgnI3VzZXJSZXBlYXRQYXNzJykudmFsKCkgIT09ICQoJyN1c2VyUGFzcycpLnZhbCgpID8gJCgnI3VzZXJSZXBlYXRQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpIDogJCgnI3VzZXJSZXBlYXRQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAkKCcjdXNlclBhc3MnKS52YWwoKS5sZW5ndGggPCA2ID8gJCgnI3VzZXJQYXNzJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCcpIDogJCgnI3VzZXJQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuXG4gICAgICAgIGlmICgkKGZvcm0gKyAnIC5lcnItZmllbGQnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgJChidG4pLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLmhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoYnRuKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICQoZXJyKS5zaG93KCk7XG4gICAgICAgIH1cblxuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBIZWxwZXJzOyJdfQ==
