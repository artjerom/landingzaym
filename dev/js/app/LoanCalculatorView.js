/**
 * Created by fred on 06.12.16.
 */

import AppConstants from '../constants';

var LoanCalculatorView = Backbone.View.extend({

    events: {
        'input input[type=range].js-slider--sum': 'changeSumRange',
        'click span': 'test'
    },

    test: function () {
        console.log('ok ...');
    }
});

export default LoanCalculatorView;