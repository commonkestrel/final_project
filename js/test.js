$(document).ready(() => {
    $("#right").click(() => {
        if(getCookie("Name")) {
            $(".dropdown-btn").html(getCookie("Name") + '<span class="drop-arrow"></span>');
        } else {
            $(".dropdown-btn").hide();
        }
        $("drop-contents").width($("dropdown-btn").width())
        $.post(window.location.href, {
            async: false,
            correct: true
        }, (data, success) => {
            $("#header").addClass("switch");
            setTimeout(() => {
                $("#header").addClass("success");
                document.getElementById("header").innerHTML = "Correct!";
            }, 375);
        });
        $("#header").addClass("switch");
            setTimeout(() => {
                $("#header").addClass("success");
                document.getElementById("header").innerHTML = "Correct!";
            }, 375);
    })
    $("#wrong").click(() => {
        $.post(window.location.href, {
            async: false,
            correct: false
        }, (data, success) => {
        })
        $("#container").animate({"height": "0px"}, 1000)
        setTimeout(() => {
            $("#disappointing").animate({"opacity": 1}, 10000, "linear")
        }, 3000)
    })
});
