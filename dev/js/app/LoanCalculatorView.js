/**
 * Created by fred on 06.12.16.
 */

import AppConstants from '../constants';

var LoanCalculatorView = Backbone.View.extend({

    events: {
        'input input[type=range].js-slider--sum': 'changeSumRange',
        'change input[type=tel].js-sum': 'changeSumField',

        'input input[type=range].js-slider--period': 'changePeriodRange',
        'change input[type=tel].js-period': 'changePeriodField',
    },

    initialize: function () {
        this.model.on('change', this.change, this);

    },

    // Выбор суммы при помощи ползунка
    changeSumRange: function (e) {
        let min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        let fieldSum = $('input[name=sum]');

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        if (val > 10000) {
            $(e.target).css({
                'background-image': 'linear-gradient(rgb(254, 150, 39), rgb(254, 150, 39))'
            });
        }

        $(fieldSum).val(e.target.value + ' ₽');

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + ' ₽');

    },

    // -- Выбор суммы при помощи поля
    changeSumField: function (e) {
        // Изменяем ползунок
        let range = $('input[type=range].js-slider--sum');

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

        $('.js-sum').val(e.target.value);
        // @TODO: Пока без рубля
        // Подставляем символ рубля
/*        if (~$('.js-sum').val().indexOf('₽')) {
            $('.js-sum').val(e.target.value);
        } else {
            $('.js-sum').val(e.target.value + ' ₽');
        }*/

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + ' ₽');
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function (e) {
        let min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        let fieldPeriod = $('input[name=period]');

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        // @TODO: Пока без дней ( + ' дней')
        $(fieldPeriod).val(e.target.value);
    },

    // -- Выбор срока при помощи поля
    changePeriodField: function (e) {
        // Изменяем ползунок
        let range = $('input[type=range].js-slider--period');

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
    }
});

export default LoanCalculatorView;