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
        el: '#loanCalculator'
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

        initialize: function () {
            $('#userPhone').mask("+7 (999) 999-9999");
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

        showComments: function () {
            $('.ico_update-comments').addClass('ico_update-comments--active');
            setTimeout(function () {
                $('.js-row-comment').slideDown(500).css('display', 'flex');
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

        // Регистрация
        handleRegister: function () {
            let phone = $('#userPhone').val(),
                pass = $('#userPass').val(),
                repPass = $('#userRepeatPass').val();

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
                sum: app.loanCalculator.get('sum'),
                period: app.loanCalculator.get('period')
            };

            // Запрос
            if (!$('.js-btn_register').hasClass('is-disabled')) {
                AppHelpers.ajaxWrapper(
                    '/register',
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

        // Обработка формы обратной связи
        handleFeedback: function () {
            let theme = $('.js-feed-select_theme option:selected').val(),
                email = $('.js-feed-email').val(),
                message = $('.js-feed-message').val();

            var data = {
                theme: theme,
                email: email,
                message: message
            };

            email == 0 || message == 0 ? $('.js-btn_feedback').addClass('is-disabled') : $('.js-btn_feedback').removeClass('is-disabled');

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