$(document).ready(() => {
    window.onbeforeunload = (e) => {
        window.scroll(0, 0)
    }
    const originScrollY = 0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000)
    originalAspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, originalAspect, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha: true});
    scene.background = null;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.domElement.classList.toggle("renderer")

    let inverted = false;
    const end_pos = 0;
    const move_end_pixel = 247 * (-end_pos+15)
    const curve_end_pixel = move_end_pixel + (247 * 15)

    //Load textures
    const loader = new THREE.TextureLoader();
    const scanline_texture = loader.load('static/networking-earth.png')
    const black_texture = loader.load('static/world-outline-black.png');
    const white_texture = loader.load('static/world-outline-white.png');

    //Initiallize sphere
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({map: scanline_texture});
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 15;
    scene.add(sphere);

    //Initiallize objects for view shift
    const ellipse = new THREE.EllipseCurve(0, 0, 10+end_pos, 10, 0, 0.5 * Math.PI, false);
    const ellipse_points = ellipse.getSpacedPoints(200).reverse();
    const view_curve = new THREE.EllipseCurve(0, 0, end_pos, end_pos, 0.5 * Math.PI, Math.PI, false);
    const view_points = view_curve.getPoints(200).reverse()
    let move_end = false;
    let scrolling = false;

    const rotateX = (point, angle) => {
        const radians = angle * Math.PI/180;
        const rot_z = point.y * Math.sin(radians);
        const rot_y = point.y * Math.cos(radians);
        const rot_point = new THREE.Vector3(point.x, -rot_y, rot_z)
        return rot_point;
    }
    const below = rotateX(ellipse_points[0], 65);
    camera.position.copy(below);
    camera.position.y = 0;

    const animate = (amount) => {
        if(window.pageYOffset < move_end_pixel) {
            sphere.position.x = (window.pageYOffset * 0.004)-15;
            if (sphere.position.x > end_pos) {
                sphere.position.x = end_pos
            }
            sphere.rotation.y -= amount;
            move_end = false;
            camera.position.copy(new THREE.Vector3(below.x, 0, below.z))
            camera.lookAt(0, 0, 0)
        } else if(!move_end && amount > 0) {
            $("html, body").animate({ scrollTop: curve_end_pixel }, 500);
            scrolling = true;
            sphere.position.x = end_pos;
            sphere.rotation.y -= amount;
            move_end = true;
        }

        if(window.pageYOffset > move_end_pixel && window.pageYOffset < curve_end_pixel) {
            const amount = Math.floor((window.pageYOffset - move_end_pixel)/(3705/200));
            const vector = ellipse_points[amount]
            const translated_point = rotateX(vector, 65);
            translated_point.y -= below.y;
            const view_vector = view_points[amount];
            const translated_view = new THREE.Vector3(view_vector.x+end_pos, 0, view_vector.y);
            curve(translated_point, translated_view)
        } else if (window.pageYOffset > curve_end_pixel) {
            sphere.rotation.y -= amount;
        }

        renderer.render(scene, camera);
    };

    const invert = () => {
        if(inverted) {
            material.map = scanline_texture;
        } else {
            material.map = white_texture;
        }
        material.map.needsUpdate = true;
        renderer.render(scene, camera);
        inverted = !inverted;
    }

    const delay_invert = (i) => {
        setTimeout(() => {
            invert()
            if (i < 11) {
                delay_invert(i+1)
            }
        },50)
    }

    const curve = (point, look) => {
        camera.position.copy(point)
        camera.lookAt(look)
        renderer.render(scene, camera);
    }

    const curve_move = () => {
        for(let i=0; i<ellipse_points.length; i++) {
            const vector = ellipse_points[i]
            const translated_point = rotateX(vector, 65);
            translated_point.y -= below.y
            const view_vector = view_points[i]
            const translated_view = new THREE.Vector3(view_vector.x+end_pos, 0, view_vector.y)
        }
    }

    requestAnimationFrame(() => {
        animate(amount);
    })

    let lastScrollY = window.pageYOffset;
    $(document).click(() => {
        $("html, body").animate({ scrollTop: curve_end_pixel }, 800);
    })
    $(window).scroll((e)=> {
        if (window.pageYOffset > 0) {
            $("#scroll-arrow").addClass("scrolled").removeClass("back")
        } else {
            $("#scroll-arrow").addClass("back").removeClass("scrolled")
        }
        if (!scrolling || !e.originalEvent.details) {
            let amount = (this.pageYOffset - lastScrollY) * 0.002;
            lastScrollY = window.pageYOffset;
            requestAnimationFrame(() => {
                animate(amount);
            })
        } else if (window.pageYOffset >= curve_end_pixel){
            scrolling = false;
            let amount = (this.pageYOffset - lastScrollY) * 0.002;
            lastScrollY = window.pageYOffset;
            requestAnimationFrame(() => {
                animate(amount);
            })
        } else {
            e.preventDefault()
        }
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
});
