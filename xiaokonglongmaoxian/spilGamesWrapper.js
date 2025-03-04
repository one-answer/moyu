var GameWrapper = {
    isAsking: false,
    askAds: function (x) {
        if (!GameWrapper.isAsking) {
            GameWrapper.isAsking = true;
            if (GameAPI.IS_STANDALONE) {               
                GameWrapper.onResume();
            } else {
                GameAPI.GameBreak.request(function () {
                    GameWrapper.onPause();
                }, function () {
                    GameWrapper.onResume();
                });
            }

        }

    },
    onResume: function () {
        GameWrapper.isAsking = false;
        $("#funcName").val("OnResume");
        $("#exeCommand").click();
    },
    onPause: function () {
        $("#funcName").val("OnPaused");
        $("#exeCommand").click();
    },
};