define('slick-style',
['jquery'],
    $(document).ready(function () {
        var menu = document.querySelector('#menu-button');
        var nav = document.querySelector('nav');
        menu.addEventListener('click', function (e) {
            nav.classList.toggle('toggle-nav');
        });
    })
);