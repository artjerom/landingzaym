/**
 * Created by fred on 06.12.16.
 */

window.Calculator = {
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

        res = val;
    }).trigger('input');

    // Код для поля (Выбор суммы)
    $('input[type=tel].js-sum').on({
        keyup: function (e) {
            // code ...
        },
        // Для поля ввода суммы
        change: function (e) {
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

            $(this).val(e.target.value + ' ₽');
        }
    }).trigger('input');

    return res;
};

export default Calculator;