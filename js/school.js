const valid_email = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

$(document).ready(() => {
    $("#danger").hide()
    $(".error-message").hide()

    $(window).scroll(() => {
        document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
    });

    $("#signuptoggle").click(() => {
        $(".collapse").collapse('hide');
        $("#signup").collapse('toggle');
    });
    $("#logintoggle").click(() => {
        $(".collapse").collapse('hide');
        $("#login").collapse('toggle');
    });
    $("#signup-email").keyup(() => {
        let email_val = $("#signup-email").val();
        if (email_val == "" || !valid_email(email_val)) {
            $("#signup-email").removeClass("is-valid");
            $("#signup-email").addClass("is-invalid");
            $("#email-error").show();
        } else {
            $("#signup-email").removeClass("is-invalid");
            $("#signup-email").addClass("is-valid");
            $("#email-error").hide();
        }
    });
    $('.confirm').keyup(() => {
        let pass_text = $("#signup-pass").val();
        let confirm_text = $("#confirm").val();             
        if (pass_text != confirm_text) {
            $("#confirm").removeClass("is-valid")
            $("#confirm").addClass("is-invalid")
            $("#confirm-error").show()
        } else {
            $("#confirm").removeClass("is-invalid")
            $("#confirm").addClass("is-valid")
            $("#confirm-error").hide()
        }
    });
    $('#loginform').submit((event) => {
        event.preventDefault()
        const email = $("#login-email").val();
        const pass = $("#login-pass").val();
        console.log(email + ' ' + pass)
        $("#loginform")[0].reset()
        $.post("/users/login", {
            async: false,
            email: email,
            pass: pass
        }, (data, status) => {
            if(!data) {
                $("#danger").html("Email or password incorrect!" + $("#danger").html()).show();
            } else {
                window.location.href = window.location.origin + "/utils"
            }
        })
    });
    $('#signupform').submit((event) => {
        event.preventDefault()
        let errors = 0;
        const email_val = $("#signup-email").val();
        const pass_val = $("#signup-pass").val();
        const confirm_val = $("#confirm").val();
        if(email_val == "" || !valid_email(email_val)) {
            errors++;
            $("#email-error").show()
        }
        if(pass_val != confirm_val) {
            errors++;
            $("#confirm-error").show()
        }
        if(pass_val.length < 8) {
            errors++;
            $("#pass-error").html('<i class="fa fa-warning"></i>  Password must be 8 characters or longer.')
        }

        if(errors == 0) {
            $.post("/users/create", {
                async: false,
                email: email_val,
                pass: pass_val,
                confirm: confirm_val
            }, (data, status) => {
                if(data == true) {
                    try {
                        window.location.href = window.location.origin + "/utils"
                    } catch (err) {
                        alert(err)
                    }
                }
            })
        } else {
            alert(errors)
        }
    });
});
