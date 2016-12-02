(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*ФАЙЛ ДЛЯ ОТОБРАЖЕНИЯ ВЕРСТКИ*/

$('input[type=range]').on('input', function (e) {
    var min = e.target.min,
        max = e.target.max,
        val = e.target.value;

    var field = $('input[name=sum]');

    $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
    });

    $(field).val(e.target.value + ' ₽');
}).trigger('input');

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQSxFQUFFLG1CQUFGLEVBQXVCLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DLFVBQVMsQ0FBVCxFQUFXO0FBQzFDLFFBQUksTUFBTSxFQUFFLE1BQUYsQ0FBUyxHQUFuQjtBQUFBLFFBQ0ksTUFBTSxFQUFFLE1BQUYsQ0FBUyxHQURuQjtBQUFBLFFBRUksTUFBTSxFQUFFLE1BQUYsQ0FBUyxLQUZuQjs7QUFJQSxRQUFJLFFBQVEsRUFBRSxpQkFBRixDQUFaOztBQUVBLE1BQUUsRUFBRSxNQUFKLEVBQVksR0FBWixDQUFnQjtBQUNaLDBCQUFrQixDQUFDLE1BQU0sR0FBUCxJQUFjLEdBQWQsSUFBcUIsTUFBTSxHQUEzQixJQUFrQztBQUR4QyxLQUFoQjs7QUFJQSxNQUFFLEtBQUYsRUFBUyxHQUFULENBQWEsRUFBRSxNQUFGLENBQVMsS0FBVCxHQUFpQixJQUE5QjtBQUNILENBWkQsRUFZRyxPQVpILENBWVcsT0FaWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKtCk0JDQmdCbINCU0JvQryDQntCi0J7QkdCg0JDQltCV0J3QmNCvINCS0JXQoNCh0KLQmtCYKi9cblxuJCgnaW5wdXRbdHlwZT1yYW5nZV0nKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgbWluID0gZS50YXJnZXQubWluLFxuICAgICAgICBtYXggPSBlLnRhcmdldC5tYXgsXG4gICAgICAgIHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgdmFyIGZpZWxkID0gJCgnaW5wdXRbbmFtZT1zdW1dJyk7XG5cbiAgICAkKGUudGFyZ2V0KS5jc3Moe1xuICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAodmFsIC0gbWluKSAqIDEwMCAvIChtYXggLSBtaW4pICsgJyUgMTAwJSdcbiAgICB9KTtcblxuICAgICQoZmllbGQpLnZhbChlLnRhcmdldC52YWx1ZSArICcg4oK9Jyk7XG59KS50cmlnZ2VyKCdpbnB1dCcpO1xuXG5cbiJdfQ==
