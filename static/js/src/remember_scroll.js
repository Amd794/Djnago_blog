$(window).scroll(function () {

    // Change this to target a different percentage
    var targetPercentage = 99.5;

    //Change this to set the height of your nav bar so it hides properly. If you have a box shadow you may have to adjust this number to be height + shadow distance
    var navBarHeight = 70;

    //Change this to the ID of the content you are trying to show.
    var targetID = "#navigation";

    //Window Math
    var scrollTo = $(window).scrollTop(),
        docHeight = $(document).height(),
        windowHeight = $(window).height();
    scrollPercent = (scrollTo / (docHeight - windowHeight)) * 100;
    scrollPercent = scrollPercent.toFixed(1);

    // $('#percentageCounter h1').text(scrollPercent + "%");
    $('.ydjd').width(scrollPercent + "%");

    if (scrollPercent > targetPercentage) {
        $(targetID).stop().slideDown();
        var timerId = setTimeout(function () {
            $(targetID).stop().slideUp();
        }, 1000);
    }

    if (scrollPercent < targetPercentage) {
        $(targetID).slideUp();
    }

}).trigger('scroll');


"use strict";
var RememberScroll = {
    init: function () {
        this._scrollToSavedPosition(), this._onUnloadStoreScrollPosition()
    }, _scrollToSavedPosition: function () {
        var o = CPLocalStorage.getItem(this._getScrollPositionKey());
        void 0 !== o && window.scrollTo(0, o), CPLocalStorage.removeItem(this._getScrollPositionKey())
    }, _onUnloadStoreScrollPosition: function () {
        if (window.onunload) return 0;
        var o = this;
        window.onunload = function () {
            var t = document.getElementsByTagName("body")[0];
            CPLocalStorage.setItem(o._getScrollPositionKey(), t.scrollTop)
        }
    }, _getScrollPositionKey: function () {
        var o = document.location.pathname.split("/").pop();
        return "scrollposition:" + o
    }
};
