/**
 * Created by fred on 06.12.16.
 */

import AppConstants from '../constants';
import AppHelpers from '../helpers';

var LoanCalculatorView = Backbone.View.extend({


    sumRanges: 'input.js-slider--sum',
    periodRanges: 'input.js-slider--period',

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
        // this.template = $('#templateCalc').html();
        this.template = _.template($('#templateCalc').html());

        this.model.on('change', this.change, this);

        this.render();
    },

    render: function () {
        var rendered = this.template(this.model.attributes);
        this.$el.html(rendered);

        // this.changePeriodRange();
        this.changeCalc('you-get', 2);
        this.change();

        return this;
    },

    // Изменение шаблона
    changeCalc: function (section, n) {
       let allBlock = '#' + section;

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
        $(allBlock + ' input[type=range].js-slider--period').attr('id', 'period' + n);

    },

    change: function () {
        let sum = this.model.get('sum'),
            period = this.model.get('period'),
            // Поле суммы
            fieldSum = $('input[name=sum]'),
            // Поле срока
            fieldPeriod = $('input[name=period]');

        // Подставляем значение суммы займа
        $('.js-out-sum').html(AppHelpers.formatNumber(sum) + ' ₽');

        // -- в поле cуммы
        $(fieldSum).val(sum);
        // -- в поле период
        $(fieldPeriod).val(period);

        if (sum > AppConstants.sumBorder) {

            AppHelpers.printResults();

            $('.js-range_info-period span:nth-child(1)').html('4 недели');

            $('.js-range_info-period span:nth-child(2)').html('12 недель');
            this.model.set('maxPeriod', 12);
            this.model.set('minPeriod', 4);

            this.model.get('period') == 4 ? $('label[for=focusInpPeriod]').html('недели') : $('label[for=focusInpPeriod]').html('недель');

            this.model.get('period') == 4 ? $('label[for=focusInpPeriod2]').html('недели') : $('label[for=focusInpPeriod2]').html('недель');
        } else {
            $('.info-back span').html('Возвращаете');
            $('.js-out-sum_back').html(AppHelpers.formatNumber(this.model.calculateLoanSum(sum, period)) + ' ₽');
            $('.js-range_info-period span:nth-child(1)').html('8 дней');
            $('.js-range_info-period span:nth-child(2)').html('30 дней');
            $('label[for=focusInpPeriod]').html('дней');
            $('label[for=focusInpPeriod2]').html('дней');
            this.model.set('maxPeriod', 30);
            this.model.set('minPeriod', 8);
        }

        // $($(this.sumRanges)[0]).val($($(this.sumRanges)[1]).val());
        $(this.sumRanges).val(sum);
        $(this.periodRanges).val(period);
    },

    // Изменение ползунка (type: sum || period)
    changeRangeSlider: function (type, max, min) {
        let range = $('input.js-slider--' + type);

        for (let i = 0; i < range.length; i++) {
            $(range[i])
                .attr('max', max)
                .attr('min', min)
                .css({
                    'backgroundSize': ($(range[i]).val() - $(range[i]).attr('min')) * 100 / ($(range[i]).attr('max') - $(range[i]).attr('min')) + '% 100%'
                });

            this.model.set(type, $(range[i]).val());
        }
    },

    // Выбор суммы при помощи ползунка
    changeSumRange: function () {
        let min = $(this.sumRanges).attr('min'),
            max = $(this.sumRanges).attr('max');

        this.changeRangeSlider('sum', max, min);

        if (this.model.get('sum') > AppConstants.sumBorder) {
            this.model.set('period', 5);
        }

        this.changePeriodRange();
    },

    // -- Выбор суммы при помощи поля
    changeSumField: function (e) {
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

        this.changeRangeSlider('sum', $(this.sumRanges).attr('max'), $(this.sumRanges).attr('min'));

        if (this.model.get('sum') > AppConstants.sumBorder) {
            this.model.set('period', 5);
        }

        this.changePeriodRange();
    },

    // Выбор срока при помощи ползунка
    changePeriodRange: function () {

        this.changeRangeSlider('period', this.model.get('maxPeriod'), this.model.get('minPeriod'));

        $('input[type=range]#period').css('backgroundSize', $('input[type=range]#period2').css('backgroundSize'));

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

        this.model.set('period', e.target.value);

        $('.js-period').val(this.model.get('period'));
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