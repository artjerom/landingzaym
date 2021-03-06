import AppConstants from './constants';
import AppHelpers from './helpers';
import LoanCalculatorModel from './app/LoanCalculatorModel';
import LoanCalculatorView from './app/LoanCalculatorView';

$(function () {
    window.app = {};

    // Калькулятор
    app.loanCalculator = new LoanCalculatorModel({

    });
    app.loanCalculatorView = new LoanCalculatorView({
        model: app.loanCalculator,
        el: 'form.calc'
    });

    let AppModel = Backbone.Model.extend({
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

            // Выбрать тему
            'click .js_quest-target': 'selectQuestTheme',

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

        initialize: function () {
            $('#userPhone').mask("+7 (999) 999-9999");

            // Подставляем время
            let date = new Date();
            date.setMinutes(date.getMinutes() + 15);

            let resHour = date.getHours(),
                resMin = date.getMinutes();

            if (date.getHours().toString().length == 1) resHour = '0' + date.getHours();

            if (date.getMinutes().toString().length == 1) resMin = '0' + date.getMinutes();

            let res = resHour + ':' + resMin;

            $('.you-loan .js-loan').html(' ' + res);

        },

        // Выбор способа получения
        changeMethod: function () {
            $('.method').toggleClass('method--active');

            // -- Подставляем текст
            $('.js-pay_method').html($('.method--active').find('.js-text_method').html());
        },

        // Переключение табов (должно работать и на десктопе)
        changeAboutTab: function (e) {
            $('.btn-about--active').add(e.target).toggleClass('btn-about--active');

            let tabId = $(e.target).attr('data-tab');

            $('.js-change-content').removeClass('js-change-content--active');

            $('#aboutTab-' + tabId).addClass('js-change-content--active');
        },

        // -- вопросы и ответы
        changeQuestionTab: function (e) {
            $('.btn-questions--active').add(e.target).toggleClass('btn-questions--active');

            let tabId = $(e.target).attr('data-tab');

            $('.js-change-content-quest').removeClass('js-change-content-quest--active');

            $('#QuestTab-' + tabId).addClass('js-change-content-quest--active');
        },

        // ---- вопросы и ответы (Получение займа)
        changeQuestionTabGetZaym: function (e) {
            $('.js_tab-quest-get--active').add(e.target).toggleClass('js_tab-quest-get--active');

            let tabId = $(e.target).attr('data-tab');

            $('.js_get-zaym-tab-content').removeClass('js_get-zaym-tab-content--active');

            $('#QuestGetZaymTab-' + tabId).addClass('js_get-zaym-tab-content--active');
        },

        // ---- Вопросы и ответы (Погашение займа)
        changeQuestionTabRepayZaym: function (e) {
            $('.js_tab-quest-repay--active').add(e.target).toggleClass('js_tab-quest-repay--active');

            let tabId = $(e.target).attr('data-tab');

            $('.js_repay-zaym-tab-content').removeClass('js_repay-zaym-tab-content--active');

            $('#QuestRepayZaymTab-' + tabId).addClass('js_repay-zaym-tab-content--active');
        },

        showComments: function () {
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
        nextSlide: function (e) {
            $(e.target).parent().parent().find('.content-slider').css({
                'transition': '.3s ease-out',
                'left': function (index, value) {
                    if (parseFloat(value) <= -540) {
                        return value = 0;
                    }
                    return parseFloat(value) - 270 + 'px';
                }
            });
        },
        // Предыдущий слайд
        prevSlide: function (e) {
            $(e.target).parent().parent().find('.content-slider').css({
                'transition': '.3s ease-out',
                'left': function (index, value) {
                    if (parseFloat(value) === 0) {
                        return value = -540;
                    }
                    return parseFloat(value) + 270 + 'px';
                }
            });
        },

        // Выбор темы
        selectQuestTheme: function (e) {
            let theme = $(e.target).html(),
                out = $('.feedback a.dropdown');

            $(out)
                .html(theme)
                .addClass('js-check');
        },

        // Регистрация
        handleRegister: function () {
            let phone = $('#userPhone').val(),
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
                period: app.loanCalculator.get('sum') > AppConstants.sumBorder ? period * 7 : period
            };

            $('#userRepeatPass').val() !== $('#userPass').val() ? $('#userRepeatPass').addClass('err-field') : $('#userRepeatPass').removeClass('err-field');
            $('#userPass').val().length < 6 ? $('#userPass').addClass('err-field') : $('#userPass').removeClass('err-field');
            AppHelpers.formValidate('jsRegister');

            // Запрос
            if (!$('.js-btn_register').hasClass('is-disabled')) {
                AppHelpers.ajaxWrapper(
                    '/register',
                    'POST',
                    JSON.stringify(data),
                    function (data) {
                        if (data.status === 'success') {
                            console.log('register');
                        } else {
                            console.log('err');
                        }
                    }
                )
            }
        },

        // Обработка формы обратной связи
        handleFeedback: function () {
            let theme = $('.feedback a.dropdown').html(),
                email = $('.js-feed-email').val(),
                message = $('.js-feed-message').val();

            var data = {
                theme: theme,
                email: email,
                message: message
            };

            AppHelpers.formValidate('jsFeedback');

            // Запрос
            if (!$('.js-btn_feedback').hasClass('is-disabled')) {
                console.log(data);
                AppHelpers.ajaxWrapper(
                    '/feedback',
                    'POST',
                    JSON.stringify(data),
                    function (data) {
                        if (data.status === 'succes') {
                            console.log('register');
                        } else {
                            console.log('err');
                        }
                    }
                )
            }
        },

        // Попап регистрации
        showRegister: function () {
            $('.popup--register').fadeIn(250);
            $('#all').addClass('overlay');
        },

        // Попап с выбором способа получения
        showPayMethod: function () {
            $('.popup--method').fadeIn(250);
            $('#all').addClass('overlay');
        },

        // Попап с обратной связью
        showFeedback: function () {
            $('.popup--feedback').fadeIn(250);
            $('#all').addClass('overlay');
        },

        // Закрыть попап
        closePopup: function () {
            $('.popup').fadeOut(250);
            $('#all').removeClass('overlay');
        }

    });

    app.view = new AppView();

});