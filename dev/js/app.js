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

});

// import Caculator from './app/Calculator'

// console.log('Сумма: ' + Caculator.sum());
// console.log(Caculator.period());
// console.log(Caculator.moneyBack());

/*
let AppModelCalculator = {
    sum: 0,
    period: 0,
    moneyBack: function () {
        return this.sum - this.period;
    }
};

AppModelCalculator.sum = function () {
    let res = 0;

    return res;
};

// Код для ползунка (Выбор суммы)
$('input[type=range].js-slider--sum').on('input', function(e){
    let min = e.target.min,
        max = e.target.max,
        val = e.target.value;

    let fieldSum = $('input[name=sum]');

    AppModelCalculator.sum = val;

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
}).trigger('input');

// Код для ползунка (Срок займа)
$('input[type=range].js-slider--time').on('input', function(e){
    let min = e.target.min,
        max = e.target.max,
        val = e.target.value;

    let fieldPeriod = $('input[name=period]');

    AppModelCalculator.period = val;

    $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
    });

    $(fieldPeriod).val(e.target.value + ' дней');
}).trigger('input');

// Вывод значений для калькулятора
$('input[type=range].js-slider').on('input', function (e) {

});



*/
