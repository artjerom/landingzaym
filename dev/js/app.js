/*ФАЙЛ ДЛЯ ОТОБРАЖЕНИЯ ВЕРСТКИ*/

$('input[type=range]').on('input', function(e){
    var min = e.target.min,
        max = e.target.max,
        val = e.target.value;

    var field = $('input[name=sum]');

    $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
    });

    $(field).val(e.target.value + ' ₽');
}).trigger('input');


