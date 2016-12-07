import AppConstants from './constants.js';
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
            // Для попапов
            'click .js-pay_method': 'showPayMethod',
            'click .btn_feedbadk': 'showFeedback',
            'change .popup': 'changePopus',
            'click .js-close_popup': 'closePopup',

            'click .method': 'changeMethod'
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
        },

        // Выбор способа получения
        changeMethod: function () {
            $('.method').toggleClass('method--active');

            // -- Подставляем текст
            $('.js-pay_method').html($('.method--active').find('.js-text_method').html());
        }
    });

    app.view = new AppView();

});