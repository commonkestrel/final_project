const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {return decodeURIComponent(parts.pop().split(';').shift());}
}

$(document).ready(() => {
    if(getCookie("Name")) {
        $(".dropdown-btn").html(getCookie("Name") + '<span class="drop-arrow"></span>');
    } else {
        $(".dropdown-btn").hide();
    }
    $("drop-contents").width($("dropdown-btn").width())
    $(".dropdown-btn").click(() => {
        if($(".dropdown-btn").hasClass("open")) {
            $(".dropdown-btn").removeClass("open");
            $(".drop-arrow").removeClass("up");
            $(".drop-arrow").addClass("flip-down");
            $("#drop-contents").animate({height: "0rem"}, 250);
            setTimeout(() => {
                $(".drop-arrow").addClass("down").removeClass("flip-down");
            }, 250)
        } else {
            $(".dropdown-btn").addClass("open");
            $(".drop-arrow").removeClass("down");
            $(".drop-arrow").addClass("flip-up");
            $("#drop-contents").animate({height: "6rem"}, 250);
            setTimeout(() => {
                $(".drop-arrow").addClass("up").removeClass("flip-up");
            }, 250)
        }
    })
    $("#logout").click(() => {
        $.post("/users/logout", {
            async: false
        }, (data, status) => {
            window.location.href = window.location.origin + "/login"
        })
    })
    $("#delete").click(() => {
        $.post("/users/delete", {
            async: false
        }, (data, status) => {
            window.location.href = window.location.origin + "/login"
        })
    })
});
