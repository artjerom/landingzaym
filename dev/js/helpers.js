/**
 * Created by fred on 08.12.16.
 */
import AppConstants from './constants';

var AppHelpers = {
    // @TODO: url
    baseUrl: '',

    // ajax
    ajaxWrapper: (url, type, data, successCallback, errorCallback) => {
        type = type || 'POST';
        data = data || {};
        successCallback = successCallback || function(data) {};
        errorCallback = errorCallback || function(ermsg) {
            console.log(ermsg);
        };
        $.ajax({
            url: AppHelpers.baseUrl + url,
            type: type,
            data: data,
            success: function (data) {
                if (data.declined == 1) {
                    console.log('decline');
                } else {
                    return successCallback(data);
                }
            },
            error: errorCallback
        });
    },

    // Финальная сумма
    printResults: () => {
        let sum = app.loanCalculator.get('sum');
        let days = app.loanCalculator.get('period');

/*        let sum = $('.js-sum').val();
        let days = $('.js-period').val();*/

        let paymethod;

        if (sum < AppConstants.sumBorder) paymethod = 'Разовый платёж на сумму';
        else {
            days *= 7;
            paymethod = (AppHelpers.estimateAnnPeriods(days) + ' ' + AppHelpers.getCase(AppHelpers.estimateAnnPeriods(days), 'платёж', 'платежа', 'платежей'));
        }
        sum = AppHelpers.estimateReturnSum(sum, days);

        $('.info-back span').html(paymethod+' по');

        $('.js-out-sum_back').html(AppHelpers.formatNumber(sum) + ' ₽');
    },

    estimateAnnPeriods: (days) => {
        return Math.ceil(days / 14);
    },

    getCase: (_number, _case1, _case2, _case3) => {
        var base = _number - Math.floor(_number / 100) * 100;
        var result;

        if (base > 9 && base < 20) {
            result = _case3;

        } else {
            var remainder = _number - Math.floor(_number / 10) * 10;

            if (1 == remainder) result = _case1;
            else if (0 < remainder && 5 > remainder) result = _case2;
            else result = _case3;
        }

        return result;
    },

    estimateReturnSum: (sum, days) => {
        const feeIssue = AppConstants.feeIssue;
        const factorMax = AppConstants.factorMax;
        const factorMin = AppConstants.factorMin;

        sum = Number(sum);
        let payback = Math.ceil(sum * feeIssue);
        //Разовый платеж
        if (sum < AppConstants.sumBorder) {

            return Math.ceil((sum + payback) * (AppConstants.tarrifs[0].percent * days + 1));

        }
        else {
            let percent = AppConstants.tarrifs[1].percent * 14;
            let ann_periods = days / 14;
            let annuity = (percent * Math.pow((1 + percent), ann_periods)) / (Math.pow((1 + percent), ann_periods) - 1);

            return Math.ceil((sum + payback) * annuity);

        }

    },

    formatNumber: (num) => {
        return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    },
};

export default AppHelpers;