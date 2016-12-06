/**
 * Created by fred on 06.12.16.
 */

let Calculator = {
    sum: 0,
    period: 0,
    moneyBack: 0
};

Calculator.sum = function () {
    let res = 0;

    // Код для ползунка (Выбор суммы)
    $('input[type=range].js-slider--sum').on('input', function(e){
        let min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        let fieldSum = $('input[name=sum]');

        res = val;

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

    return res;
};

export default Calculator;