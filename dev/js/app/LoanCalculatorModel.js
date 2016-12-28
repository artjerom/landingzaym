/**
 * Created by fred on 06.12.16.
 */
import AppConstants from '../constants';

var LoanCalculatorModel = Backbone.Model.extend({
    // Значения по умолчанию
    defaults: {
        sum: 6000,
        period: 12,
        type: 'once', // "once" or "two_weeks"
        config: {
            show: true,
            showPeriod: true
        },
        maxPeriod: 30,
        minPeriod: 8,
    },

    // Подсчет общей суммы займа (ОД + Проценты + Комиссии)
    calculateLoanSum: function (sum, period) {
        var total;

        sum = parseInt(sum);
        period = parseInt(period);

        if (sum <= AppConstants.tarrifs[0].max_sum) {
            // Считаем по первому тарифу
            total = Math.ceil((sum + sum * AppConstants.feeIssue) * (AppConstants.tarrifs[0].percent * period + 1));
        } else {
            // Считаем по второму тарифу
            var percent = AppConstants.tarrifs[1].percent * 7;
            var n_weeks = period;
            var annuity = (percent * Math.pow((1 + percent), n_weeks)) / (Math.pow((1 + percent), n_weeks) - 1);
            total = Math.ceil((sum + sum * AppConstants.feeIssue * AppConstants.feeIssue) * annuity * n_weeks);
        }

        return total;
    }
});

export default LoanCalculatorModel;