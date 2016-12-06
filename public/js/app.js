(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Calculator = require('./app/Calculator');

var _Calculator2 = _interopRequireDefault(_Calculator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_Calculator2.default.sum());
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

},{"./app/Calculator":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by fred on 06.12.16.
 */

var Calculator = {
    sum: 0,
    period: 0,
    moneyBack: 0
};

Calculator.sum = function () {
    var res = 0;

    // Код для ползунка (Выбор суммы)
    $('input[type=range].js-slider--sum').on('input', function (e) {
        var min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        var fieldSum = $('input[name=sum]');

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

exports.default = Calculator;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIiwiZGV2L2pzL2FwcC9DYWxjdWxhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsUUFBUSxHQUFSLENBQVkscUJBQVUsR0FBVixFQUFaO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTs7OztBQUlBLElBQUksYUFBYTtBQUNiLFNBQUssQ0FEUTtBQUViLFlBQVEsQ0FGSztBQUdiLGVBQVc7QUFIRSxDQUFqQjs7QUFNQSxXQUFXLEdBQVgsR0FBaUIsWUFBWTtBQUN6QixRQUFJLE1BQU0sQ0FBVjs7QUFFQTtBQUNBLE1BQUUsa0NBQUYsRUFBc0MsRUFBdEMsQ0FBeUMsT0FBekMsRUFBa0QsVUFBUyxDQUFULEVBQVc7QUFDekQsWUFBSSxNQUFNLEVBQUUsTUFBRixDQUFTLEdBQW5CO0FBQUEsWUFDSSxNQUFNLEVBQUUsTUFBRixDQUFTLEdBRG5CO0FBQUEsWUFFSSxNQUFNLEVBQUUsTUFBRixDQUFTLEtBRm5COztBQUlBLFlBQUksV0FBVyxFQUFFLGlCQUFGLENBQWY7O0FBRUEsY0FBTSxHQUFOOztBQUVBLFVBQUUsRUFBRSxNQUFKLEVBQVksR0FBWixDQUFnQjtBQUNaLDhCQUFrQixDQUFDLE1BQU0sR0FBUCxJQUFjLEdBQWQsSUFBcUIsTUFBTSxHQUEzQixJQUFrQyxRQUR4QztBQUVaLCtCQUFtQjtBQUZQLFNBQWhCOztBQUtBLFlBQUksTUFBTSxLQUFWLEVBQWlCO0FBQ2IsY0FBRSxFQUFFLE1BQUosRUFBWSxHQUFaLENBQWdCO0FBQ1osb0NBQW9CO0FBRFIsYUFBaEI7QUFHSDs7QUFFRCxVQUFFLFFBQUYsRUFBWSxHQUFaLENBQWdCLEVBQUUsTUFBRixDQUFTLEtBQVQsR0FBaUIsSUFBakM7QUFDSCxLQXJCRCxFQXFCRyxPQXJCSCxDQXFCVyxPQXJCWDs7QUF1QkEsV0FBTyxHQUFQO0FBQ0gsQ0E1QkQ7O2tCQThCZSxVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDYWN1bGF0b3IgZnJvbSAnLi9hcHAvQ2FsY3VsYXRvcidcblxuY29uc29sZS5sb2coQ2FjdWxhdG9yLnN1bSgpKTtcbi8vIGNvbnNvbGUubG9nKENhY3VsYXRvci5wZXJpb2QoKSk7XG4vLyBjb25zb2xlLmxvZyhDYWN1bGF0b3IubW9uZXlCYWNrKCkpO1xuXG4vKlxubGV0IEFwcE1vZGVsQ2FsY3VsYXRvciA9IHtcbiAgICBzdW06IDAsXG4gICAgcGVyaW9kOiAwLFxuICAgIG1vbmV5QmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdW0gLSB0aGlzLnBlcmlvZDtcbiAgICB9XG59O1xuXG5BcHBNb2RlbENhbGN1bGF0b3Iuc3VtID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCByZXMgPSAwO1xuXG4gICAgcmV0dXJuIHJlcztcbn07XG5cbi8vINCa0L7QtCDQtNC70Y8g0L/QvtC70LfRg9C90LrQsCAo0JLRi9Cx0L7RgCDRgdGD0LzQvNGLKVxuJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICBtYXggPSBlLnRhcmdldC5tYXgsXG4gICAgICAgIHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgbGV0IGZpZWxkU3VtID0gJCgnaW5wdXRbbmFtZT1zdW1dJyk7XG5cbiAgICBBcHBNb2RlbENhbGN1bGF0b3Iuc3VtID0gdmFsO1xuXG4gICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHZhbCAtIG1pbikgKiAxMDAgLyAobWF4IC0gbWluKSArICclIDEwMCUnLFxuICAgICAgICAnYmFja2dyb3VuZEltYWdlJzogJ2xpbmVhci1ncmFkaWVudCgjM2JiMzhlLCAjM2JiMzhlKSdcbiAgICB9KTtcblxuICAgIGlmICh2YWwgPiAxMDAwMCkge1xuICAgICAgICAkKGUudGFyZ2V0KS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAnbGluZWFyLWdyYWRpZW50KHJnYigyNTQsIDE1MCwgMzkpLCByZ2IoMjU0LCAxNTAsIDM5KSknXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICQoZmllbGRTdW0pLnZhbChlLnRhcmdldC52YWx1ZSArICcg4oK9Jyk7XG59KS50cmlnZ2VyKCdpbnB1dCcpO1xuXG4vLyDQmtC+0LQg0LTQu9GPINC/0L7Qu9C30YPQvdC60LAgKNCh0YDQvtC6INC30LDQudC80LApXG4kKCdpbnB1dFt0eXBlPXJhbmdlXS5qcy1zbGlkZXItLXRpbWUnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICBsZXQgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICBtYXggPSBlLnRhcmdldC5tYXgsXG4gICAgICAgIHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgbGV0IGZpZWxkUGVyaW9kID0gJCgnaW5wdXRbbmFtZT1wZXJpb2RdJyk7XG5cbiAgICBBcHBNb2RlbENhbGN1bGF0b3IucGVyaW9kID0gdmFsO1xuXG4gICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHZhbCAtIG1pbikgKiAxMDAgLyAobWF4IC0gbWluKSArICclIDEwMCUnXG4gICAgfSk7XG5cbiAgICAkKGZpZWxkUGVyaW9kKS52YWwoZS50YXJnZXQudmFsdWUgKyAnINC00L3QtdC5Jyk7XG59KS50cmlnZ2VyKCdpbnB1dCcpO1xuXG4vLyDQktGL0LLQvtC0INC30L3QsNGH0LXQvdC40Lkg0LTQu9GPINC60LDQu9GM0LrRg9C70Y/RgtC+0YDQsFxuJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyJykub24oJ2lucHV0JywgZnVuY3Rpb24gKGUpIHtcblxufSk7XG5cblxuXG4qL1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDYuMTIuMTYuXG4gKi9cblxubGV0IENhbGN1bGF0b3IgPSB7XG4gICAgc3VtOiAwLFxuICAgIHBlcmlvZDogMCxcbiAgICBtb25leUJhY2s6IDBcbn07XG5cbkNhbGN1bGF0b3Iuc3VtID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCByZXMgPSAwO1xuXG4gICAgLy8g0JrQvtC0INC00LvRjyDQv9C+0LvQt9GD0L3QutCwICjQktGL0LHQvtGAINGB0YPQvNC80YspXG4gICAgJCgnaW5wdXRbdHlwZT1yYW5nZV0uanMtc2xpZGVyLS1zdW0nKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgbGV0IG1pbiA9IGUudGFyZ2V0Lm1pbixcbiAgICAgICAgICAgIG1heCA9IGUudGFyZ2V0Lm1heCxcbiAgICAgICAgICAgIHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIGxldCBmaWVsZFN1bSA9ICQoJ2lucHV0W25hbWU9c3VtXScpO1xuXG4gICAgICAgIHJlcyA9IHZhbDtcblxuICAgICAgICAkKGUudGFyZ2V0KS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKHZhbCAtIG1pbikgKiAxMDAgLyAobWF4IC0gbWluKSArICclIDEwMCUnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQoIzNiYjM4ZSwgIzNiYjM4ZSknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh2YWwgPiAxMDAwMCkge1xuICAgICAgICAgICAgJChlLnRhcmdldCkuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICdsaW5lYXItZ3JhZGllbnQocmdiKDI1NCwgMTUwLCAzOSksIHJnYigyNTQsIDE1MCwgMzkpKSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJChmaWVsZFN1bSkudmFsKGUudGFyZ2V0LnZhbHVlICsgJyDigr0nKTtcbiAgICB9KS50cmlnZ2VyKCdpbnB1dCcpO1xuXG4gICAgcmV0dXJuIHJlcztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENhbGN1bGF0b3I7Il19
