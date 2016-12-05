(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLG1CQUFGLEVBQXVCLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DLFVBQVMsQ0FBVCxFQUFXO0FBQzFDLFFBQUksTUFBTSxFQUFFLE1BQUYsQ0FBUyxHQUFuQjtBQUFBLFFBQ0ksTUFBTSxFQUFFLE1BQUYsQ0FBUyxHQURuQjtBQUFBLFFBRUksTUFBTSxFQUFFLE1BQUYsQ0FBUyxLQUZuQjs7QUFJQSxRQUFJLFFBQVEsRUFBRSxpQkFBRixDQUFaOztBQUVBLE1BQUUsRUFBRSxNQUFKLEVBQVksR0FBWixDQUFnQjtBQUNaLDBCQUFrQixDQUFDLE1BQU0sR0FBUCxJQUFjLEdBQWQsSUFBcUIsTUFBTSxHQUEzQixJQUFrQztBQUR4QyxLQUFoQjs7QUFJQSxNQUFFLEtBQUYsRUFBUyxHQUFULENBQWEsRUFBRSxNQUFGLENBQVMsS0FBVCxHQUFpQixJQUE5QjtBQUNILENBWkQsRUFZRyxPQVpILENBWVcsT0FaWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKCdpbnB1dFt0eXBlPXJhbmdlXScpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciBtaW4gPSBlLnRhcmdldC5taW4sXG4gICAgICAgIG1heCA9IGUudGFyZ2V0Lm1heCxcbiAgICAgICAgdmFsID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICB2YXIgZmllbGQgPSAkKCdpbnB1dFtuYW1lPXN1bV0nKTtcblxuICAgICQoZS50YXJnZXQpLmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICh2YWwgLSBtaW4pICogMTAwIC8gKG1heCAtIG1pbikgKyAnJSAxMDAlJ1xuICAgIH0pO1xuXG4gICAgJChmaWVsZCkudmFsKGUudGFyZ2V0LnZhbHVlICsgJyDigr0nKTtcbn0pLnRyaWdnZXIoJ2lucHV0Jyk7XG5cblxuIl19
