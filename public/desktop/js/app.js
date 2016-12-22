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
                // $(phone).addClass('err-filed');
            } else {
                $('.js-err-val-phone').hide();
                // $(phone).removeClass('err-filed');
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

        // this.change();

        return this;
    },

    change: function change() {
        var sum = this.model.get('sum'),
            period = this.model.get('period'),

        // Ползунок с выбора срока
        rangePeriod = $(this.periodRanges),

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
        $(this.periodRanges).val(period);

        this.model.set('period', $(rangePeriod).val());
        $(this.sumRanges).val(sum);
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

        console.log($(form + ' .err-field').length);
    }
}; /**
    * Created by fred on 08.12.16.
    */
exports.default = AppHelpers;

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjtBQU1KO0FBQ0Esb0NBQXdCLG1CQVBwQjtBQVFKLHVDQUEyQiwwQkFSdkI7O0FBVUo7QUFDQSxxQ0FBeUIsY0FYckI7O0FBYUo7QUFDQSxtQ0FBdUIsV0FkbkI7QUFlSixrQ0FBc0IsV0FmbEI7O0FBaUJKO0FBQ0Esc0NBQTBCLGdCQWxCdEI7QUFtQko7QUFDQSxzQ0FBMEIsZ0JBcEJ0Qjs7QUFzQko7QUFDQSx1Q0FBMkIsY0F2QnZCO0FBd0JKLG9DQUF3QixlQXhCcEI7QUF5QkosbUNBQXVCLGNBekJu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LENBQWpCLEMsQ0FMQTs7O2tCQTRIZSxVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IEFwcEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvck1vZGVsIGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yTW9kZWwnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yVmlldyBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcnO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICAvLyDQmtCw0LvRjNC60YPQu9GP0YLQvtGAXG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yID0gbmV3IExvYW5DYWxjdWxhdG9yTW9kZWwoe1xuXG4gICAgfSk7XG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yVmlldyA9IG5ldyBMb2FuQ2FsY3VsYXRvclZpZXcoe1xuICAgICAgICBtb2RlbDogYXBwLmxvYW5DYWxjdWxhdG9yLFxuICAgICAgICBlbDogJ2Zvcm0uY2FsYydcbiAgICB9KTtcblxuICAgIGxldCBBcHBNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgICAgIGRlZmF1bHRzOiB7fVxuICAgIH0pO1xuXG4gICAgYXBwLm1vZGVsID0gbmV3IEFwcE1vZGVsKCk7XG5cbiAgICB2YXIgQXBwVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdib2R5JyxcblxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIC8vINCh0L/QvtGB0L7QsSDQstGL0LTQsNGH0LhcbiAgICAgICAgICAgICdjbGljayAubWV0aG9kJzogJ2NoYW5nZU1ldGhvZCcsXG5cbiAgICAgICAgICAgIC8vINCi0LDQsdGLICfQv9C+0YfQtdC80YMg0LzRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLWFib3V0JzogJ2NoYW5nZUFib3V0VGFiJyxcbiAgICAgICAgICAgIC8vINCi0LDQsdGLICfQktC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YsnXG4gICAgICAgICAgICAnY2xpY2sgLmJ0bi1xdWVzdGlvbnMnOiAnY2hhbmdlUXVlc3Rpb25UYWInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qc190YWItcXVlc3QtZ2V0JzogJ2NoYW5nZVF1ZXN0aW9uVGFiR2V0WmF5bScsXG5cbiAgICAgICAgICAgIC8vINCg0LDRgdC60YDRi9GC0Ywg0LrQvtC80LXQvdGC0YtcbiAgICAgICAgICAgICdjbGljayAudXBkYXRlLWNvbW1lbnQnOiAnc2hvd0NvbW1lbnRzJyxcblxuICAgICAgICAgICAgLy8g0KHQu9Cw0LnQtNC10YBcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLXJpZ2h0JzogJ25leHRTbGlkZScsXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1sZWZ0JzogJ3ByZXZTbGlkZScsXG5cbiAgICAgICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y9cbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX3JlZ2lzdGVyJzogJ2hhbmRsZVJlZ2lzdGVyJyxcbiAgICAgICAgICAgIC8vINCe0LHRgNCw0YLQvdCw0Y8g0YHQstGP0LfRjFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1idG5fZmVlZGJhY2snOiAnaGFuZGxlRmVlZGJhY2snLFxuXG4gICAgICAgICAgICAvLyDQlNC70Y8g0L/QvtC/0LDQv9C+0LJcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvd19yZWdpc3Rlcic6ICdzaG93UmVnaXN0ZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1wYXlfbWV0aG9kJzogJ3Nob3dQYXlNZXRob2QnLFxuICAgICAgICAgICAgJ2NsaWNrIC5idG5fZmVlZGJhY2snOiAnc2hvd0ZlZWRiYWNrJyxcbiAgICAgICAgICAgICdjaGFuZ2UgLnBvcHVwJzogJ2NoYW5nZVBvcHVzJyxcbiAgICAgICAgICAgICdjbGljayAuanMtY2xvc2VfcG9wdXAnOiAnY2xvc2VQb3B1cCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjdXNlclBob25lJykubWFzayhcIis3ICg5OTkpIDk5OS05OTk5XCIpO1xuXG4gICAgICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INCy0YDQtdC80Y9cbiAgICAgICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSArIDE1KTtcblxuICAgICAgICAgICAgbGV0IHJlc0hvdXIgPSBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgICAgICAgcmVzTWluID0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKS5sZW5ndGggPT0gMSkgcmVzSG91ciA9ICcwJyArIGRhdGUuZ2V0SG91cnMoKTtcblxuICAgICAgICAgICAgaWYgKGRhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkubGVuZ3RoID09IDEpIHJlc01pbiA9ICcwJyArIGRhdGUuZ2V0TWludXRlcygpO1xuXG4gICAgICAgICAgICBsZXQgcmVzID0gcmVzSG91ciArICc6JyArIHJlc01pbjtcblxuICAgICAgICAgICAgJCgnLnlvdS1sb2FuIC5qcy1sb2FuJykuaHRtbCgnICcgKyByZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0YvQsdC+0YAg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIGNoYW5nZU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLm1ldGhvZCcpLnRvZ2dsZUNsYXNzKCdtZXRob2QtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLyAtLSDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INGC0LXQutGB0YJcbiAgICAgICAgICAgICQoJy5qcy1wYXlfbWV0aG9kJykuaHRtbCgkKCcubWV0aG9kLS1hY3RpdmUnKS5maW5kKCcuanMtdGV4dF9tZXRob2QnKS5odG1sKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyICjQtNC+0LvQttC90L4g0YDQsNCx0L7RgtCw0YLRjCDQuCDQvdCwINC00LXRgdC60YLQvtC/0LUpXG4gICAgICAgIGNoYW5nZUFib3V0VGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnLmJ0bi1hYm91dC0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLWFib3V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI2Fib3V0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLSDQstC+0L/RgNC+0YHRiyDQuCDQvtGC0LLQtdGC0YtcbiAgICAgICAgY2hhbmdlUXVlc3Rpb25UYWI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcuYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJykuYWRkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnYnRuLXF1ZXN0aW9ucy0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhYklkKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcblxuICAgICAgICAgICAgJCgnLmpzLWNoYW5nZS1jb250ZW50LXF1ZXN0JykucmVtb3ZlQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI1F1ZXN0VGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzLWNoYW5nZS1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyAtLS0tINCy0L7Qv9GA0L7RgdGLINC4INC+0YLQstC10YLRiyAo0J/QvtC70YPRh9C10L3QuNC1INC30LDQudC80LApXG4gICAgICAgIGNoYW5nZVF1ZXN0aW9uVGFiR2V0WmF5bTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5qc190YWItcXVlc3QtZ2V0LS1hY3RpdmUnKS5hZGQoZS50YXJnZXQpLnRvZ2dsZUNsYXNzKCdqc190YWItcXVlc3QtZ2V0LS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgbGV0IHRhYklkID0gJChlLnRhcmdldCkuYXR0cignZGF0YS10YWInKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2codGFiSWQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQpO1xuXG4gICAgICAgICAgICAkKCcuanNfZ2V0LXpheW0tdGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnanNfZ2V0LXpheW0tdGFiLWNvbnRlbnQtLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjUXVlc3RHZXRaYXltVGFiLScgKyB0YWJJZCkuYWRkQ2xhc3MoJ2pzX2dldC16YXltLXRhYi1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93Q29tbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5pY29fdXBkYXRlLWNvbW1lbnRzJykuYWRkQ2xhc3MoJ2ljb191cGRhdGUtY29tbWVudHMtLWFjdGl2ZScpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLXJvdy1jb21tZW50Jykuc2xpZGVEb3duKDUwMCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnZmxleCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKCcucm93LWNvbW1lbnQtaGlkZScpLnNsaWRlVXAoNjUwKTtcbiAgICAgICAgICAgICAgICAkKCcudXBkYXRlLWNvbW1lbnQnKS5oaWRlKDEwMCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQodC70LXQtNGD0Y7RidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBuZXh0U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA8PSAtNTQwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSAtIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vINCf0YDQtdC00YvQtNGD0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgcHJldlNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IC01NDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpICsgMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgIGhhbmRsZVJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgcGhvbmUgPSAkKCcjdXNlclBob25lJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzcyA9ICQoJyN1c2VyUGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHJlcFBhc3MgPSAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKTtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2pzUmVnaXN0ZXInKTtcblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCXG4gICAgICAgICAgICBpZiAocGFzcyAhPT0gcmVwUGFzcykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItcmVwZWF0LXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INC/0LDRgNC+0LvRjCDQutC+0YDQvtGC0LrQuNC5XG4gICAgICAgICAgICBpZiAocGFzcy5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFzcy5sZW5ndGggPj0gNikge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBhc3MnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0YLQtdC70LXRhNC+0L3QsFxuICAgICAgICAgICAgaWYgKHBob25lLmxlbmd0aCAhPSAxNykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIC8vICQocGhvbmUpLmFkZENsYXNzKCdlcnItZmlsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGhvbmUnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgLy8gJChwaG9uZSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoID09PSAxNyAmJiBwYXNzID09PSByZXBQYXNzICYmIHBhc3MubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5qcy1idG5fcmVnaXN0ZXInKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgIHBhc3M6IHBhc3MsXG4gICAgICAgICAgICAgICAgc3VtOiBhcHAubG9hbkNhbGN1bGF0b3IuZ2V0KCdzdW0nKSxcbiAgICAgICAgICAgICAgICBwZXJpb2Q6IGFwcC5sb2FuQ2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgaGFuZGxlRmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGVtZSA9ICQoJy5qcy1mZWVkLXNlbGVjdF90aGVtZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICQoJy5qcy1mZWVkLWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICQoJy5qcy1mZWVkLW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgnanNGZWVkYmFjaycpO1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcblxuICAgICAgICAgICAgaWYgKCEkKCcuanMtYnRuX2ZlZWRiYWNrJykuaGFzQ2xhc3MoJ2lzLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL2ZlZWRiYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2NlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tcmVnaXN0ZXInKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0LLRi9Cx0L7RgNC+0Lwg0YHQv9C+0YHQvtCx0LAg0L/QvtC70YPRh9C10L3QuNGPXG4gICAgICAgIHNob3dQYXlNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0tbWV0aG9kJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfRjNGOXG4gICAgICAgIHNob3dGZWVkYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JfQsNC60YDRi9GC0Ywg0L/QvtC/0LDQv1xuICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbn0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBMb2FuQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA2MDAwLFxuICAgICAgICBwZXJpb2Q6IDEyLFxuICAgICAgICB0eXBlOiAnb25jZScgLy8gXCJvbmNlXCIgb3IgXCJ0d29fd2Vla3NcIlxuICAgIH0sXG5cbiAgICAvLyDQn9C+0LTRgdGH0LXRgiDQvtCx0YnQtdC5INGB0YPQvNC80Ysg0LfQsNC50LzQsCAo0J7QlCArINCf0YDQvtGG0LXQvdGC0YsgKyDQmtC+0LzQuNGB0YHQuNC4KVxuICAgIGNhbGN1bGF0ZUxvYW5TdW06IGZ1bmN0aW9uIChzdW0sIHBlcmlvZCkge1xuICAgICAgICB2YXIgdG90YWw7XG5cbiAgICAgICAgc3VtID0gcGFyc2VJbnQoc3VtKTtcbiAgICAgICAgcGVyaW9kID0gcGFyc2VJbnQocGVyaW9kKTtcblxuICAgICAgICBpZiAoc3VtIDw9IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIC8vINCh0YfQuNGC0LDQtdC8INC/0L4g0L/QtdGA0LLQvtC80YMg0YLQsNGA0LjRhNGDXG4gICAgICAgICAgICB0b3RhbCA9IE1hdGguY2VpbCgoc3VtICsgc3VtICogQXBwQ29uc3RhbnRzLmZlZUlzc3VlKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogcGVyaW9kICsgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQstGC0L7RgNC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMV0ucGVyY2VudCAqIDc7XG4gICAgICAgICAgICB2YXIgbl93ZWVrcyA9IHBlcmlvZDtcbiAgICAgICAgICAgIHZhciBhbm51aXR5ID0gKHBlcmNlbnQgKiBNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSkgLyAoTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgbl93ZWVrcykgLSAxKTtcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUgKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogYW5udWl0eSAqIG5fd2Vla3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FuQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjEyLjE2LlxuICovXG5cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgc3VtUmFuZ2VzOiAkKCdpbnB1dC5qcy1zbGlkZXItLXN1bScpLFxuICAgIHBlcmlvZFJhbmdlczogJCgnaW5wdXQuanMtc2xpZGVyLS1wZXJpb2QnKSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9dGVsXS5qcy1zdW0nOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXBlcmlvZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG5cbiAgICAgICAgLy8g0JTQu9GPINC/0L7Qu9C10Lkg0LrQsNC70YzQutGD0LvRj9GC0L7RgNCwXG4gICAgICAgICdmb2N1cyAucmFuZ2VfZmllbGQnOiAnbGlnaHRCb3JkZXJJbnB1dCcsXG4gICAgICAgICdmb2N1c291dCAucmFuZ2VfZmllbGQnOiAnb2ZmTGlnaHRCb3JkZXJJbnB1dCdcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLnRlbXBsYXRlID0gJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVuZGVyZWQgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgIHRoaXMuJGVsLmh0bWwocmVuZGVyZWQpO1xuXG4gICAgICAgIC8vIHRoaXMuY2hhbmdlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5tb2RlbC5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgcGVyaW9kID0gdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpLFxuICAgICAgICAgICAgLy8g0J/QvtC70LfRg9C90L7QuiDRgSDQstGL0LHQvtGA0LAg0YHRgNC+0LrQsFxuICAgICAgICAgICAgcmFuZ2VQZXJpb2QgPSAkKHRoaXMucGVyaW9kUmFuZ2VzKSxcbiAgICAgICAgICAgIC8vINCf0L7Qu9C1INGB0YPQvNC80YtcbiAgICAgICAgICAgIGZpZWxkU3VtID0gJCgnaW5wdXRbbmFtZT1zdW1dJyksXG4gICAgICAgICAgICAvLyDQn9C+0LvQtSDRgdGA0L7QutCwXG4gICAgICAgICAgICBmaWVsZFBlcmlvZCA9ICQoJ2lucHV0W25hbWU9cGVyaW9kXScpO1xuXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtSDRgdGD0LzQvNGLINC30LDQudC80LBcbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5odG1sKEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKHN1bSkgKyAnIOKCvScpO1xuXG4gICAgICAgIC8vIC0tINCyINC/0L7Qu9C1IGPRg9C80LzRi1xuICAgICAgICAkKGZpZWxkU3VtKS52YWwoc3VtKTtcbiAgICAgICAgLy8gLS0g0LIg0L/QvtC70LUg0L/QtdGA0LjQvtC0XG4gICAgICAgICQoZmllbGRQZXJpb2QpLnZhbChwZXJpb2QpO1xuXG4gICAgICAgIGlmIChzdW0gPiBBcHBDb25zdGFudHMuc3VtQm9yZGVyKSB7XG4gICAgICAgICAgICBBcHBIZWxwZXJzLnByaW50UmVzdWx0cygpO1xuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDEpJykuaHRtbCgnNCDQvdC10LTQtdC70LgnKTtcblxuICAgICAgICAgICAgJCgnLmpzLXJhbmdlX2luZm8tcGVyaW9kIHNwYW46bnRoLWNoaWxkKDIpJykuaHRtbCgnMTIg0L3QtdC00LXQu9GMJyk7XG5cbiAgICAgICAgICAgIC8vINCc0LXQvdGP0LXQvCDQt9C90LDRh9C10L3QuNC1INC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIDEyLCA0KTtcblxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQZXJpb2RSYW5nZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgncGVyaW9kJykgPT0gNCA/ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZF0nKS5odG1sKCfQvdC10LTQtdC70YwnKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSA9PSA0ID8gJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kMl0nKS5odG1sKCfQvdC10LTQtdC70LgnKSA6ICQoJ2xhYmVsW2Zvcj1mb2N1c0lucFBlcmlvZDJdJykuaHRtbCgn0L3QtdC00LXQu9GMJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKCfQktC+0LfQstGA0LDRidCw0LXRgtC1Jyk7XG4gICAgICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcih0aGlzLm1vZGVsLmNhbGN1bGF0ZUxvYW5TdW0oc3VtLCBwZXJpb2QpKSArICcg4oK9Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMSknKS5odG1sKCc4INC00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCcuanMtcmFuZ2VfaW5mby1wZXJpb2Qgc3BhbjpudGgtY2hpbGQoMiknKS5odG1sKCczMCDQtNC90LXQuScpO1xuICAgICAgICAgICAgJCgnbGFiZWxbZm9yPWZvY3VzSW5wUGVyaW9kXScpLmh0bWwoJ9C00L3QtdC5Jyk7XG4gICAgICAgICAgICAkKCdsYWJlbFtmb3I9Zm9jdXNJbnBQZXJpb2QyXScpLmh0bWwoJ9C00L3QtdC5Jyk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdwZXJpb2QnLCAzMCwgOCk7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLnBlcmlvZFJhbmdlcykudmFsKHBlcmlvZCk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsICQocmFuZ2VQZXJpb2QpLnZhbCgpKTtcbiAgICAgICAgJCh0aGlzLnN1bVJhbmdlcykudmFsKHN1bSk7XG5cbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INC/0L7Qu9C30YPQvdC60LAgKHR5cGU6IHN1bSB8fCBwZXJpb2QpXG4gICAgY2hhbmdlUmFuZ2VTbGlkZXI6IGZ1bmN0aW9uICh0eXBlLCBtYXgsIG1pbikge1xuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dC5qcy1zbGlkZXItLScgKyB0eXBlKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHJhbmdlW2ldKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdtYXgnLCBtYXgpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ21pbicsIG1pbilcbiAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKCQocmFuZ2VbaV0pLnZhbCgpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICogMTAwIC8gKCQocmFuZ2VbaV0pLmF0dHIoJ21heCcpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICsgJyUgMTAwJSdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQodHlwZSwgJChyYW5nZVtpXSkudmFsKCkpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMuc3VtUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsIG1heCwgbWluKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlbC5nZXQoJ3N1bScpID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsIDUpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gLS0g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VTdW1GaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKTtcblxuICAgICAgICB2YXIgJGlucHV0ID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICB2YXIgc3VtID0gcGFyc2VJbnQoJGlucHV0LnZhbCgpKSB8fCA2MDAwO1xuICAgICAgICBsZXQgcG93ID0gTWF0aC5jZWlsKHN1bS8xMDApICoxMDA7XG4gICAgICAgIGlmKCAocG93IC0gc3VtKSA+IDUwKXtcbiAgICAgICAgICAgIHN1bSA9IHBvdyAtIDEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1bSA9IHBvdztcbiAgICAgICAgfVxuICAgICAgICAkaW5wdXQudmFsKHN1bSk7XG5cbiAgICAgICAgaWYgKHN1bSA+IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdW0nLCBBcHBDb25zdGFudHMudGFycmlmc1sxXS5tYXhfc3VtKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJyaWZzWzFdLm1heF9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ3R3b193ZWVrcydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1pbl9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJyaWZzWzBdLm1pbl9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ29uY2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgJCh0aGlzLnN1bVJhbmdlcykuYXR0cignbWF4JyksICQodGhpcy5zdW1SYW5nZXMpLmF0dHIoJ21pbicpKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlbC5nZXQoJ3N1bScpID4gQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3BlcmlvZCcsIDUpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMucGVyaW9kUmFuZ2VzKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5wZXJpb2RSYW5nZXMpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIG1heCwgbWluKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0L/QvtC70LfRg9C90L7QulxuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXBlcmlvZCcpO1xuXG4gICAgICAgICQocmFuZ2UpLnZhbChlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgICAgLy8g0KHRgtC40LvQuCDQtNC70Y8g0L/QvtC70LfRg9C90LrQsFxuICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHJhbmdlLnZhbCgpIC0gcmFuZ2UuYXR0cignbWluJykpICogMTAwIC8gKHJhbmdlLmF0dHIoJ21heCcpIC0gcmFuZ2UuYXR0cignbWluJykpICsgJyUgMTAwJScsXG4gICAgICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgICQoJy5qcy1wZXJpb2QnKS52YWwodGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpKTtcbiAgICB9LFxuXG4gICAgbGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyMxOGE0ZDInXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmZMaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnI2IwYmFjNSdcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XSxcbiAgICBmZWVJc3N1ZTogMC4wNSxcbiAgICBmYWN0b3JNYXg6IDAuMTUsXG4gICAgZmFjdG9yTWluOiAwLjAxLFxuICAgIHN1bUJvcmRlcjogMzAwMDAsXG4gICAgRkVFX0lTU1VFOiAwLjA1LCAvLyDQmtC+0LzQvNC40YHQuNGPINC30LAg0LLRi9C00LDRh9GDXG4gICAgUEVSQ0VOVF9TVEFOREFSVDogMC4wMTUsIC8vINCh0YLQsNC90LTQsNGA0YLQvdGL0Lkg0L/RgNC+0YbQtdC90YIgKNCyINC00LXQvdGMKVxuICAgIFBFUkNFTlRfREVMQVk6IDAuMDE1LCAvLyDQn9GA0L7RhtC10L3RgiDQsiDRgdC70YPRh9Cw0LUg0L/RgNC+0YHRgNC+0YfQutC4ICjQsiDQtNC10L3RjClcbiAgICBGSU5FX0RFTEFZOiAxMDAwLjAwLCAvLyDQnNCw0LrRgdC40LzQsNC70YzQvdCw0Y8g0YHRg9C80LzQsCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7Qs9C+INGI0YLRgNCw0YTQsCDQt9CwINC/0YDQvtGB0YDQvtGH0LrRg1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcHBDb25zdGFudHM7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDguMTIuMTYuXG4gKi9cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICAvLyBAVE9ETzogdXJsXG4gICAgYmFzZVVybDogJycsXG5cbiAgICAvLyBhamF4XG4gICAgYWpheFdyYXBwZXI6ICh1cmwsIHR5cGUsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgPT4ge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCAnUE9TVCc7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBzdWNjZXNzQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkge307XG4gICAgICAgIGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVybXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEFwcEhlbHBlcnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvckNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDQpNC40L3QsNC70YzQvdCw0Y8g0YHRg9C80LzQsFxuICAgIHByaW50UmVzdWx0czogKCkgPT4ge1xuICAgICAgICBsZXQgc3VtID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgnc3VtJyk7XG4gICAgICAgIGxldCBkYXlzID0gYXBwLmxvYW5DYWxjdWxhdG9yLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgbGV0IHBheW1ldGhvZDtcblxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikgcGF5bWV0aG9kID0gJ9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0ZHQtiDQvdCwINGB0YPQvNC80YMnO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheXMgKj0gNztcbiAgICAgICAgICAgIHBheW1ldGhvZCA9IChBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSArICcgJyArIEFwcEhlbHBlcnMuZ2V0Q2FzZShBcHBIZWxwZXJzLmVzdGltYXRlQW5uUGVyaW9kcyhkYXlzKSwgJ9C/0LvQsNGC0ZHQticsICfQv9C70LDRgtC10LbQsCcsICfQv9C70LDRgtC10LbQtdC5JykpO1xuICAgICAgICB9XG4gICAgICAgIHN1bSA9IEFwcEhlbHBlcnMuZXN0aW1hdGVSZXR1cm5TdW0oc3VtLCBkYXlzKTtcblxuICAgICAgICAkKCcuaW5mby1iYWNrIHNwYW4nKS5odG1sKHBheW1ldGhvZCsnINC/0L4nKTtcblxuICAgICAgICAkKCcuanMtb3V0LXN1bV9iYWNrJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcihzdW0pICsgJyDigr0nKTtcbiAgICB9LFxuXG4gICAgZXN0aW1hdGVBbm5QZXJpb2RzOiAoZGF5cykgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGRheXMgLyAxNCk7XG4gICAgfSxcblxuICAgIGdldENhc2U6IChfbnVtYmVyLCBfY2FzZTEsIF9jYXNlMiwgX2Nhc2UzKSA9PiB7XG4gICAgICAgIHZhciBiYXNlID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwMCkgKiAxMDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGJhc2UgPiA5ICYmIGJhc2UgPCAyMCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gX2Nhc2UzO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVtYWluZGVyID0gX251bWJlciAtIE1hdGguZmxvb3IoX251bWJlciAvIDEwKSAqIDEwO1xuXG4gICAgICAgICAgICBpZiAoMSA9PSByZW1haW5kZXIpIHJlc3VsdCA9IF9jYXNlMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKDAgPCByZW1haW5kZXIgJiYgNSA+IHJlbWFpbmRlcikgcmVzdWx0ID0gX2Nhc2UyO1xuICAgICAgICAgICAgZWxzZSByZXN1bHQgPSBfY2FzZTM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBlc3RpbWF0ZVJldHVyblN1bTogKHN1bSwgZGF5cykgPT4ge1xuICAgICAgICBjb25zdCBmZWVJc3N1ZSA9IEFwcENvbnN0YW50cy5mZWVJc3N1ZTtcbiAgICAgICAgY29uc3QgZmFjdG9yTWF4ID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1heDtcbiAgICAgICAgY29uc3QgZmFjdG9yTWluID0gQXBwQ29uc3RhbnRzLmZhY3Rvck1pbjtcblxuICAgICAgICBzdW0gPSBOdW1iZXIoc3VtKTtcbiAgICAgICAgbGV0IHBheWJhY2sgPSBNYXRoLmNlaWwoc3VtICogZmVlSXNzdWUpO1xuICAgICAgICAvL9Cg0LDQt9C+0LLRi9C5INC/0LvQsNGC0LXQtlxuICAgICAgICBpZiAoc3VtIDwgQXBwQ29uc3RhbnRzLnN1bUJvcmRlcikge1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChzdW0gKyBwYXliYWNrKSAqIChBcHBDb25zdGFudHMudGFycmlmc1swXS5wZXJjZW50ICogZGF5cyArIDEpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFycmlmc1sxXS5wZXJjZW50ICogMTQ7XG4gICAgICAgICAgICBsZXQgYW5uX3BlcmlvZHMgPSBkYXlzIC8gMTQ7XG4gICAgICAgICAgICBsZXQgYW5udWl0eSA9IChwZXJjZW50ICogTWF0aC5wb3coKDEgKyBwZXJjZW50KSwgYW5uX3BlcmlvZHMpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBhbm5fcGVyaW9kcykgLSAxKTtcblxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoc3VtICsgcGF5YmFjaykgKiBhbm51aXR5KTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGE0L7RgNC8XG4gICAgZm9ybVZhbGlkYXRlOiBmdW5jdGlvbiAoZm9ybUlkKSB7XG4gICAgICAgIGxldCBmb3JtID0gJyMnICsgZm9ybUlkO1xuICAgICAgICBsZXQgZmllbGQgPSAkKGZvcm0gKyAnIFtkYXRhLXR5cGU9ZmllbGRdJyk7XG4gICAgICAgIGxldCBlcnIgPSAkKGZvcm0gKyAnIC5ibG9jay1lcnInKTtcbiAgICAgICAgbGV0IGJ0biA9ICQoZm9ybSArICcgYS5hYl9idXR0b24nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChmaWVsZFtpXSkudmFsKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoZmllbGRbaV0pLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChmaWVsZFtpXSkucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoZm9ybSArICcgLmVyci1maWVsZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAkKGJ0bikucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAkKGVycikuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChidG4pLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChlcnIpLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCQoZm9ybSArICcgLmVyci1maWVsZCcpLmxlbmd0aCk7XG5cbiAgICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwSGVscGVyczsiXX0=
