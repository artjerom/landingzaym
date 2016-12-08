/**
 * Created by fred on 08.12.16.
 */
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
    }
};

export default AppHelpers;