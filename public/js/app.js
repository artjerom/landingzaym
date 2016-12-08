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
                repPass = $('#userRepeatPass').val(),
                sum = $('.js-sum').val(),
                period = $('.js-period').val();

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
                sum: sum,
                period: period
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
            var theme = $('.js-select_theme').val(),
                email = $('.js-feed-email').val(),
                message = $('.js-feed-message').val();

            var data = {
                theme: theme,
                email: email,
                message: message
            };

            console.log(data);

            // Запрос
            if (!$('.js-btn_feedback').hasClass('is-disabled')) {
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
            total = Math.ceil((sum + sum * _constants2.default.feeIssue) * (_constants2.default.tariffs[0].percent * period + 1));
        } else {
            // Считаем по второму тарифу
            var percent = _constants2.default.tariffs[1].percent * 7;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    // Выбор суммы при помощи ползунка
    changeSumRange: function changeSumRange(e) {
        var min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        var fieldSum = $('input[name=sum]');

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        $(fieldSum).val(e.target.value);

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + '  ₽');

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
        /*        if (sum > AppConstants.tariffs[1].max_sum) {
                    this.model.set('sum', AppConstants.tariffs[1].max_sum);
                    this.model.set({
                        sum: AppConstants.tariffs[1].max_sum,
                        type: 'two_weeks'
                    });
                }
        
                if (sum < AppConstants.tariffs[0].min_sum) {
                    this.model.set({
                        sum: AppConstants.tariffs[0].min_sum,
                        type: 'once'
                    });
                }*/

        $(range).val(e.target.value);

        // Стили для ползунка
        $(range).css({
            'backgroundSize': (range.val() - range.attr('min')) * 100 / (range.attr('max') - range.attr('min')) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        $('.js-sum').val(e.target.value);

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + ' ₽');

        this.model.set('sum', $('.js-sum').val());
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function changePeriodRange(e) {
        var min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        var fieldPeriod = $('input[name=period]');

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        $(fieldPeriod).val(e.target.value);
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
}); /**
     * Created by fred on 06.12.16.
     */

exports.default = LoanCalculatorView;

},{"../constants":4}],4:[function(require,module,exports){
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
    }]
};

exports.default = AppConstants;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by fred on 08.12.16.
 */
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
    }
};

exports.default = AppHelpers;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvck1vZGVsLmpzIiwiZGV2L2pzL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcuanMiLCJkZXYvanMvY29uc3RhbnRzLmpzIiwiZGV2L2pzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFlBQVk7QUFDVixXQUFPLEdBQVAsR0FBYSxFQUFiOztBQUVBO0FBQ0EsUUFBSSxjQUFKLEdBQXFCLGtDQUF3QixFQUF4QixDQUFyQjtBQUdBLFFBQUksa0JBQUosR0FBeUIsaUNBQXVCO0FBQzVDLGVBQU8sSUFBSSxjQURpQztBQUU1QyxZQUFJO0FBRndDLEtBQXZCLENBQXpCOztBQUtBLFFBQUksV0FBVyxTQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXNCO0FBQ2pDLGtCQUFVO0FBRHVCLEtBQXRCLENBQWY7O0FBSUEsUUFBSSxLQUFKLEdBQVksSUFBSSxRQUFKLEVBQVo7O0FBRUEsUUFBSSxVQUFVLFNBQVMsSUFBVCxDQUFjLE1BQWQsQ0FBcUI7QUFDL0IsWUFBSSxNQUQyQjs7QUFHL0IsZ0JBQVE7QUFDSjtBQUNBLDZCQUFpQixjQUZiOztBQUlKO0FBQ0EsZ0NBQW9CLGdCQUxoQjs7QUFPSjtBQUNBLG1DQUF1QixXQVJuQjtBQVNKLGtDQUFzQixXQVRsQjs7QUFXSjtBQUNBLHNDQUEwQixnQkFadEI7QUFhSixzQ0FBMEIsZ0JBYnRCOztBQWVKO0FBQ0EsdUNBQTJCLGNBaEJ2QjtBQWlCSixvQ0FBd0IsZUFqQnBCO0FBa0JKLG1DQUF1QixjQWxCbkI7QUFtQkosNkJBQWlCLGFBbkJiO0FBb0JKLHFDQUF5QjtBQXBCckIsU0FIdUI7O0FBMEIvQixvQkFBWSxzQkFBWTtBQUNwQixjQUFF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OiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IEFwcEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBMb2FuQ2FsY3VsYXRvck1vZGVsIGZyb20gJy4vYXBwL0xvYW5DYWxjdWxhdG9yTW9kZWwnO1xuaW1wb3J0IExvYW5DYWxjdWxhdG9yVmlldyBmcm9tICcuL2FwcC9Mb2FuQ2FsY3VsYXRvclZpZXcnO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICAvLyDQmtCw0LvRjNC60YPQu9GP0YLQvtGAXG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yID0gbmV3IExvYW5DYWxjdWxhdG9yTW9kZWwoe1xuXG4gICAgfSk7XG4gICAgYXBwLmxvYW5DYWxjdWxhdG9yVmlldyA9IG5ldyBMb2FuQ2FsY3VsYXRvclZpZXcoe1xuICAgICAgICBtb2RlbDogYXBwLmxvYW5DYWxjdWxhdG9yLFxuICAgICAgICBlbDogJyNsb2FuQ2FsY3VsYXRvcidcbiAgICB9KTtcblxuICAgIGxldCBBcHBNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgICAgIGRlZmF1bHRzOiB7fVxuICAgIH0pO1xuXG4gICAgYXBwLm1vZGVsID0gbmV3IEFwcE1vZGVsKCk7XG5cbiAgICB2YXIgQXBwVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdib2R5JyxcblxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIC8vINCh0L/QvtGB0L7QsSDQstGL0LTQsNGH0LhcbiAgICAgICAgICAgICdjbGljayAubWV0aG9kJzogJ2NoYW5nZU1ldGhvZCcsXG5cbiAgICAgICAgICAgIC8vINCi0LDQsdGLICfQv9C+0YfQtdC80YMg0LzRiydcbiAgICAgICAgICAgICdjbGljayAuYnRuLWFib3V0JzogJ2NoYW5nZUFib3V0VGFiJyxcblxuICAgICAgICAgICAgLy8g0KHQu9Cw0LnQtNC10YBcbiAgICAgICAgICAgICdjbGljayAuYXJyb3ctLXJpZ2h0JzogJ25leHRTbGlkZScsXG4gICAgICAgICAgICAnY2xpY2sgLmFycm93LS1sZWZ0JzogJ3ByZXZTbGlkZScsXG5cbiAgICAgICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y9cbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX3JlZ2lzdGVyJzogJ2hhbmRsZVJlZ2lzdGVyJyxcbiAgICAgICAgICAgICdjbGljayAuanMtYnRuX2ZlZWRiYWNrJzogJ2hhbmRsZUZlZWRiYWNrJyxcblxuICAgICAgICAgICAgLy8g0JTQu9GPINC/0L7Qv9Cw0L/QvtCyXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXNob3dfcmVnaXN0ZXInOiAnc2hvd1JlZ2lzdGVyJyxcbiAgICAgICAgICAgICdjbGljayAuanMtcGF5X21ldGhvZCc6ICdzaG93UGF5TWV0aG9kJyxcbiAgICAgICAgICAgICdjbGljayAuYnRuX2ZlZWRiYWNrJzogJ3Nob3dGZWVkYmFjaycsXG4gICAgICAgICAgICAnY2hhbmdlIC5wb3B1cCc6ICdjaGFuZ2VQb3B1cycsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLWNsb3NlX3BvcHVwJzogJ2Nsb3NlUG9wdXAnXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnI3VzZXJQaG9uZScpLm1hc2soXCIrNyAoOTk5KSA5OTktOTk5OVwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQktGL0LHQvtGAINGB0L/QvtGB0L7QsdCwINC/0L7Qu9GD0YfQtdC90LjRj1xuICAgICAgICBjaGFuZ2VNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5tZXRob2QnKS50b2dnbGVDbGFzcygnbWV0aG9kLS1hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gLS0g0J/QvtC00YHRgtCw0LLQu9GP0LXQvCDRgtC10LrRgdGCXG4gICAgICAgICAgICAkKCcuanMtcGF5X21ldGhvZCcpLmh0bWwoJCgnLm1ldGhvZC0tYWN0aXZlJykuZmluZCgnLmpzLXRleHRfbWV0aG9kJykuaHRtbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YLQsNCx0L7QsiAo0LTQvtC70LbQvdC+INGA0LDQsdC+0YLQsNGC0Ywg0Lgg0L3QsCDQtNC10YHQutGC0L7Qv9C1KVxuICAgICAgICBjaGFuZ2VBYm91dFRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5idG4tYWJvdXQtLWFjdGl2ZScpLmFkZChlLnRhcmdldCkudG9nZ2xlQ2xhc3MoJ2J0bi1hYm91dC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGxldCB0YWJJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cbiAgICAgICAgICAgICQoJy5qcy1jaGFuZ2UtY29udGVudCcpLnJlbW92ZUNsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJyNhYm91dFRhYi0nICsgdGFiSWQpLmFkZENsYXNzKCdqcy1jaGFuZ2UtY29udGVudC0tYWN0aXZlJyk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQodC70LXQtNGD0Y7RidC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICBuZXh0U2xpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY29udGVudC1zbGlkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJy4zcyBlYXNlLW91dCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHZhbHVlKSA8PSAtNTQwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSAtIDI3MCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vINCf0YDQtdC00YvQtNGD0YnQuNC5INGB0LvQsNC50LRcbiAgICAgICAgcHJldlNsaWRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNvbnRlbnQtc2xpZGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcuM3MgZWFzZS1vdXQnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh2YWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9IC01NDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpICsgMjcwICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPXG4gICAgICAgIGhhbmRsZVJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgcGhvbmUgPSAkKCcjdXNlclBob25lJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzcyA9ICQoJyN1c2VyUGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHJlcFBhc3MgPSAkKCcjdXNlclJlcGVhdFBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBzdW0gPSAkKCcuanMtc3VtJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGVyaW9kID0gJCgnLmpzLXBlcmlvZCcpLnZhbCgpO1xuXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcbiAgICAgICAgICAgIGlmIChwYXNzICE9PSByZXBQYXNzKSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZXBlYXQtcGFzcycpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZXBlYXQtcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/QsNGA0L7Qu9GMINC60L7RgNC+0YLQutC40LlcbiAgICAgICAgICAgIGlmIChwYXNzLmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1wYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXNzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWVyci12YWwtcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCDRgtC10LvQtdGE0L7QvdCwXG4gICAgICAgICAgICBpZiAocGhvbmUubGVuZ3RoICE9PSAxNykge1xuICAgICAgICAgICAgICAgICQoJy5qcy1lcnItdmFsLXBob25lJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXZhbC1waG9uZScpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBob25lLmxlbmd0aCA9PT0gMTcgJiYgcGFzcyA9PT0gcmVwUGFzcyAmJiBwYXNzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLWJ0bl9yZWdpc3RlcicpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtYnRuX3JlZ2lzdGVyJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHBob25lOiBwaG9uZSxcbiAgICAgICAgICAgICAgICBwYXNzOiBwYXNzLFxuICAgICAgICAgICAgICAgIHN1bTogc3VtLFxuICAgICAgICAgICAgICAgIHBlcmlvZDogcGVyaW9kXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDQl9Cw0L/RgNC+0YFcbiAgICAgICAgICAgIGlmICghJCgnLmpzLWJ0bl9yZWdpc3RlcicpLmhhc0NsYXNzKCdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9yZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgaGFuZGxlRmVlZGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGVtZSA9ICQoJy5qcy1zZWxlY3RfdGhlbWUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICQoJy5qcy1mZWVkLWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICQoJy5qcy1mZWVkLW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgICAgICAgLy8g0JfQsNC/0YDQvtGBXG4gICAgICAgICAgICBpZiAoISQoJy5qcy1idG5fZmVlZGJhY2snKS5oYXNDbGFzcygnaXMtZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgIEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvZmVlZGJhY2snLFxuICAgICAgICAgICAgICAgICAgICAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWdpc3RlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XG4gICAgICAgIHNob3dSZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1yZWdpc3RlcicpLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI2FsbCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgSDQstGL0LHQvtGA0L7QvCDRgdC/0L7RgdC+0LHQsCDQv9C+0LvRg9GH0LXQvdC40Y9cbiAgICAgICAgc2hvd1BheU1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS1tZXRob2QnKS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9GM0Y5cbiAgICAgICAgc2hvd0ZlZWRiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucG9wdXAtLWZlZWRiYWNrJykuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjYWxsJykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQl9Cw0LrRgNGL0YLRjCDQv9C+0L/QsNC/XG4gICAgICAgIGNsb3NlUG9wdXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cCcpLmZhZGVPdXQoMjUwKTtcbiAgICAgICAgICAgICQoJyNhbGwnKS5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGFwcC52aWV3ID0gbmV3IEFwcFZpZXcoKTtcblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIExvYW5DYWxjdWxhdG9yTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIC8vINCX0L3QsNGH0LXQvdC40Y8g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBzdW06IDYwMDAsXG4gICAgICAgIHBlcmlvZDogMTIsXG4gICAgICAgIHR5cGU6ICdvbmNlJyAvLyBcIm9uY2VcIiBvciBcInR3b193ZWVrc1wiXG4gICAgfSxcblxuICAgIC8vINCf0L7QtNGB0YfQtdGCINC+0LHRidC10Lkg0YHRg9C80LzRiyDQt9Cw0LnQvNCwICjQntCUICsg0J/RgNC+0YbQtdC90YLRiyArINCa0L7QvNC40YHRgdC40LgpXG4gICAgY2FsY3VsYXRlTG9hblN1bTogZnVuY3Rpb24gKHN1bSwgcGVyaW9kKSB7XG4gICAgICAgIHZhciB0b3RhbDtcblxuICAgICAgICBzdW0gPSBwYXJzZUludChzdW0pO1xuICAgICAgICBwZXJpb2QgPSBwYXJzZUludChwZXJpb2QpO1xuXG4gICAgICAgIGlmIChzdW0gPD0gQXBwQ29uc3RhbnRzLnRhcnJpZnNbMF0ubWF4X3N1bSkge1xuICAgICAgICAgICAgLy8g0KHRh9C40YLQsNC10Lwg0L/QviDQv9C10YDQstC+0LzRgyDRgtCw0YDQuNGE0YNcbiAgICAgICAgICAgIHRvdGFsID0gTWF0aC5jZWlsKChzdW0gKyBzdW0gKiBBcHBDb25zdGFudHMuZmVlSXNzdWUpICogKEFwcENvbnN0YW50cy50YXJpZmZzWzBdLnBlcmNlbnQgKiBwZXJpb2QgKyAxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDQodGH0LjRgtCw0LXQvCDQv9C+INCy0YLQvtGA0L7QvNGDINGC0LDRgNC40YTRg1xuICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBBcHBDb25zdGFudHMudGFyaWZmc1sxXS5wZXJjZW50ICogNztcbiAgICAgICAgICAgIHZhciBuX3dlZWtzID0gcGVyaW9kO1xuICAgICAgICAgICAgdmFyIGFubnVpdHkgPSAocGVyY2VudCAqIE1hdGgucG93KCgxICsgcGVyY2VudCksIG5fd2Vla3MpKSAvIChNYXRoLnBvdygoMSArIHBlcmNlbnQpLCBuX3dlZWtzKSAtIDEpO1xuICAgICAgICAgICAgdG90YWwgPSBNYXRoLmNlaWwoKHN1bSArIHN1bSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSAqIEFwcENvbnN0YW50cy5mZWVJc3N1ZSkgKiBhbm51aXR5ICogbl93ZWVrcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yTW9kZWw7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cblxuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgTG9hbkNhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdpbnB1dCBpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXN1bSc6ICdjaGFuZ2VTdW1SYW5nZScsXG4gICAgICAgICdjaGFuZ2UgaW5wdXRbdHlwZT10ZWxdLmpzLXN1bSc6ICdjaGFuZ2VTdW1GaWVsZCcsXG5cbiAgICAgICAgJ2lucHV0IGlucHV0W3R5cGU9cmFuZ2VdLmpzLXNsaWRlci0tcGVyaW9kJzogJ2NoYW5nZVBlcmlvZFJhbmdlJyxcbiAgICAgICAgJ2NoYW5nZSBpbnB1dFt0eXBlPXRlbF0uanMtcGVyaW9kJzogJ2NoYW5nZVBlcmlvZEZpZWxkJyxcblxuICAgICAgICAvLyDQlNC70Y8g0L/QvtC70LXQuSDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LBcbiAgICAgICAgJ2ZvY3VzIC5yYW5nZV9maWVsZCc6ICdsaWdodEJvcmRlcklucHV0JyxcbiAgICAgICAgJ2ZvY3Vzb3V0IC5yYW5nZV9maWVsZCc6ICdvZmZMaWdodEJvcmRlcklucHV0J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubW9kZWwub24oJ2NoYW5nZScsIHRoaXMuY2hhbmdlLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgbGV0IGZpZWxkU3VtID0gJCgnaW5wdXRbbmFtZT1zdW1dJyk7XG5cbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGZpZWxkU3VtKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCf0L7QtNGB0YLQsNCy0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtVxuICAgICAgICAkKCcuanMtb3V0LXN1bScpLmh0bWwoZS50YXJnZXQudmFsdWUgKyAnICDigr0nKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgdmFsKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVN1bUZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKTtcblxuICAgICAgICB2YXIgJGlucHV0ID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICB2YXIgc3VtID0gcGFyc2VJbnQoJGlucHV0LnZhbCgpKSB8fCA2MDAwO1xuICAgICAgICBsZXQgcG93ID0gTWF0aC5jZWlsKHN1bS8xMDApICoxMDA7XG4gICAgICAgIGlmKCAocG93IC0gc3VtKSA+IDUwKXtcbiAgICAgICAgICAgIHN1bSA9IHBvdyAtIDEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1bSA9IHBvdztcbiAgICAgICAgfVxuICAgICAgICAkaW5wdXQudmFsKHN1bSk7XG4vKiAgICAgICAgaWYgKHN1bSA+IEFwcENvbnN0YW50cy50YXJpZmZzWzFdLm1heF9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdW0nLCBBcHBDb25zdGFudHMudGFyaWZmc1sxXS5tYXhfc3VtKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJpZmZzWzFdLm1heF9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ3R3b193ZWVrcydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN1bSA8IEFwcENvbnN0YW50cy50YXJpZmZzWzBdLm1pbl9zdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgICBzdW06IEFwcENvbnN0YW50cy50YXJpZmZzWzBdLm1pbl9zdW0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ29uY2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgJChyYW5nZSkudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAvLyDQodGC0LjQu9C4INC00LvRjyDQv9C+0LvQt9GD0L3QutCwXG4gICAgICAgICQocmFuZ2UpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAocmFuZ2UudmFsKCkgLSByYW5nZS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAocmFuZ2UuYXR0cignbWF4JykgLSByYW5nZS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuanMtc3VtJykudmFsKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQstC70Y/QtdC8INC30L3QsNGH0LXQvdC40LVcbiAgICAgICAgJCgnLmpzLW91dC1zdW0nKS5odG1sKGUudGFyZ2V0LnZhbHVlICsgJyDigr0nKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgJCgnLmpzLXN1bScpLnZhbCgpKTtcbiAgICB9LFxuXG4gICAgLy8g0JLRi9Cx0L7RgCDRgdGA0L7QutCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICAgICAgbWF4ID0gZS50YXJnZXQubWF4LFxuICAgICAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgbGV0IGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kSW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KCMzYmIzOGUsICMzYmIzOGUpJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGZpZWxkUGVyaW9kKS52YWwoZS50YXJnZXQudmFsdWUpO1xuICAgIH0sXG5cbiAgICAvLyAtLSDQktGL0LHQvtGAINGB0YDQvtC60LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyDQmNC30LzQtdC90Y/QtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1wZXJpb2QnKTtcblxuICAgICAgICAkKHJhbmdlKS52YWwoZS50YXJnZXQudmFsdWUpO1xuXG4gICAgICAgIC8vINCh0YLQuNC70Lgg0LTQu9GPINC/0L7Qu9C30YPQvdC60LBcbiAgICAgICAgJChyYW5nZSkuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6IChyYW5nZS52YWwoKSAtIHJhbmdlLmF0dHIoJ21pbicpKSAqIDEwMCAvIChyYW5nZS5hdHRyKCdtYXgnKSAtIHJhbmdlLmF0dHIoJ21pbicpKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyYW5nZS52YWwoKSA+IDEwMDAwKSB7XG4gICAgICAgICAgICAkKHJhbmdlKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ2xpbmVhci1ncmFkaWVudChyZ2IoMjU0LCAxNTAsIDM5KSwgcmdiKDI1NCwgMTUwLCAzOSkpJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuanMtcGVyaW9kJykudmFsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9LFxuXG4gICAgbGlnaHRCb3JkZXJJbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChlLnRhcmdldCkubmV4dCgnbGFiZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2JvcmRlckNvbG9yJzogJyMxOGE0ZDInXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmZMaWdodEJvcmRlcklucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKGUudGFyZ2V0KS5uZXh0KCdsYWJlbCcpLmNzcyh7XG4gICAgICAgICAgICAnYm9yZGVyQ29sb3InOiAnI2IwYmFjNSdcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYW5DYWxjdWxhdG9yVmlldzsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4xMi4xNi5cbiAqL1xudmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICB0YXJyaWZzOiBbe1xuICAgICAgICBncmFkZV9pZDogMSxcbiAgICAgICAgbmFtZTogJ9Ce0LHRi9GH0L3Ri9C5JyxcbiAgICAgICAgbWluX2xpbWl0OiAwLFxuICAgICAgICBtYXhfbGltaXQ6IDI5OTk5LFxuICAgICAgICBtaW5fc3VtOiAxNTAwLFxuICAgICAgICBtYXhfc3VtOiAyOTk5OSxcbiAgICAgICAgcGVyY2VudDogMC4wMTUsXG4gICAgICAgIHBlcmlvZF9vbmNlOiB7XG4gICAgICAgICAgICBtaW46IDgsXG4gICAgICAgICAgICBtYXg6IDMwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn0LTQvtGB0YLRg9C/0LXQvSDQtNC70Y8g0LLRgdC10YUg0LfQsNC10LzRidC40LrQvtCyJ1xuICAgIH0sIHtcbiAgICAgICAgZ3JhZGVfaWQ6IDIsXG4gICAgICAgIG5hbWU6ICfQn9GA0LXQvNC40YPQvCcsXG4gICAgICAgIG1pbl9saW1pdDogMzAwMDAsXG4gICAgICAgIG1heF9saW1pdDogNTAwMDAsXG4gICAgICAgIG1pbl9zdW06IDMwMDAwLFxuICAgICAgICBtYXhfc3VtOiA1MDAwMCxcbiAgICAgICAgcGVyY2VudDogMC4wMDQ5LFxuICAgICAgICBwZXJpb2Rfb25jZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAwXG4gICAgICAgIH0sXG4gICAgICAgIHBlcmlvZF90dzoge1xuICAgICAgICAgICAgbWluOiAyOCxcbiAgICAgICAgICAgIG1heDogODRcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246ICfQsdGD0LTQtdGCINC00L7RgdGC0YPQv9C10L0g0L/QvtGB0LvQtSDRgdCy0L7QtdCy0YDQtdC80LXQvdC90L7Qs9C+INC/0L7Qs9Cw0YjQtdC90LjRjyDQvtC00L3QvtCz0L4g0LfQsNC50LzQsCdcbiAgICB9XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA4LjEyLjE2LlxuICovXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICAvLyBAVE9ETzogdXJsXG4gICAgYmFzZVVybDogJycsXG5cbiAgICAvLyBhamF4XG4gICAgYWpheFdyYXBwZXI6ICh1cmwsIHR5cGUsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgPT4ge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCAnUE9TVCc7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBzdWNjZXNzQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkge307XG4gICAgICAgIGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVybXNnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IEFwcEhlbHBlcnMuYmFzZVVybCArIHVybCxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kZWNsaW5lZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWNsaW5lJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGVycm9yQ2FsbGJhY2tcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwSGVscGVyczsiXX0=
