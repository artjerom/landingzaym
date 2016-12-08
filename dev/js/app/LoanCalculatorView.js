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

        // Для полей калькулятора
        'focus .range_field': 'lightBorderInput',
        'focusout .range_field': 'offLightBorderInput'
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

        $(fieldSum).val(e.target.value);

        // Подставляем значение
        $('.js-out-sum').html(e.target.value + '  ₽');

        this.model.set('sum', val);

    },

    // -- Выбор суммы при помощи поля
    changeSumField: function (e) {
        // Изменяем ползунок
        let range = $('input[type=range].js-slider--sum');

        var $input = $(event.target);
        var sum = parseInt($input.val()) || 6000;
        let pow = Math.ceil(sum/100) *100;
        if( (pow - sum) > 50){
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
    changePeriodRange: function (e) {
        let min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        let fieldPeriod = $('input[name=period]');

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

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
    },

    lightBorderInput: function (e) {
        $(e.target).next('label').css({
            'borderColor': '#18a4d2'
        });
    },

    offLightBorderInput: function (e) {
        $(e.target).next('label').css({
            'borderColor': '#b0bac5'
        });
    }
});

export default LoanCalculatorView;