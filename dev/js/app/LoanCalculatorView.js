/**
 * Created by fred on 06.12.16.
 */

import AppConstants from '../constants';
import AppHelpers from '../helpers';

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

        _.bindAll(this, 'changeSumRange');
        _.bindAll(this, 'changePeriodRange');
    },

    change: function () {
        let sum = this.model.get('sum'),
            period = this.model.get('period'),
            // Ползунок с выбора срока
            rangePeriod = $('input#period'),
            // Поле суммы
            fieldSum = $('input[name=sum]'),
            fieldPeriod = $('input[name=period]');

        // Подставляем значение суммы займа
        $('.js-out-sum').html(sum + ' ₽');

        // -- в поле cуммы
        $(fieldSum).val(sum);
        // -- в поле период
        $(fieldPeriod).val(period);

        if (sum > AppConstants.sumBorder) {
            AppHelpers.printResults();
            $('.js-range_info-period span:nth-child(1)').html('4 недели');
            $('.js-range_info-period span:nth-child(2)').html('12 недель');
            $('label[for=focusInpPeriod]').html('недель');
            // Меняем значение ползунка
            $(rangePeriod).attr('max', 12)
                .css({
                    'backgroundSize': ($(rangePeriod).val() - $(rangePeriod).attr('min')) * 100 / ($(rangePeriod).attr('max') - $(rangePeriod).attr('min')) + '% 100%'
                });
        } else if (this.model.get('period') <= 4) {
            $('label[for=focusInpPeriod]').html('дня');
            $(rangePeriod).attr('max', 30)
                .css({
                    'backgroundSize': ($(rangePeriod).val() - $(rangePeriod).attr('min')) * 100 / ($(rangePeriod).attr('max') - $(rangePeriod).attr('min')) + '% 100%'
                });
        } else {
            $('.info-back span').html('Возвращаете');
            $('.js-out-sum_back').html(this.model.calculateLoanSum(sum, period) + ' ₽');
            $('.js-range_info-period span:nth-child(1)').html('4 дня');
            $('.js-range_info-period span:nth-child(2)').html('30 дней');
            $('label[for=focusInpPeriod]').html('дней');
            $(rangePeriod).attr('max', 30)
                .css({
                    'backgroundSize': ($(rangePeriod).val() - $(rangePeriod).attr('min')) * 100 / ($(rangePeriod).attr('max') - $(rangePeriod).attr('min')) + '% 100%'
                });
        }
    },

    // Выбор суммы при помощи ползунка
    changeSumRange: function (e) {
        let min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

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

        if (sum > AppConstants.tarrifs[1].max_sum) {
            this.model.set('sum', AppConstants.tarrifs[1].max_sum);
            this.model.set({
                sum: AppConstants.tarrifs[1].max_sum,
                type: 'two_weeks'
            });
        }

        if (sum < AppConstants.tarrifs[0].min_sum) {
            this.model.set({
                sum: AppConstants.tarrifs[0].min_sum,
                type: 'once'
            });
        }

        $(range).val(e.target.value);

        // Стили для ползунка
        $(range).css({
            'backgroundSize': (range.val() - range.attr('min')) * 100 / (range.attr('max') - range.attr('min')) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        this.model.set('sum', $('.js-sum').val());
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function (e) {
        let min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        $(e.target).css({
            'backgroundSize': (val - min) * 100 / (max - min) + '% 100%',
            'backgroundImage': 'linear-gradient(#3bb38e, #3bb38e)'
        });

        this.model.set('period', val);
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

        this.model.set('period', e.target.value);
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