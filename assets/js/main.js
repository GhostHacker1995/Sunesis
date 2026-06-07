/*
::
:: Theme Name: MedHealth - Medical & Health Template
:: Email: Nourramadan144@gmail.com
:: Author URI: https://themeforest.net/user/ar-coder
:: Author: ar-coder
:: Version: 1.0
::
*/

(function () {
    'use strict';

    // :: Loading
    $(window).on('load', function () {
        $('.loading').fadeOut();
    });

    // :: Scroll Smooth To Go Section
    $('.move-section').on('click', function (e) {
        e.preventDefault();
        var anchorLink = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchorLink.attr('href')).offset().top + 1
        }, 1000);
    });

    // :: Add Class Active To Navbar
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > ($('.nav-bar').height())) {
            $('.nav-bar').addClass('active');
        } else {
            $('.nav-bar').removeClass('active');
        }
    });

    // :: Add Class Active To Navbar Toggle
    $('.nav-bar .nav-bar-toggler').on('click', function (e) {
        $('.nav-bar .nav-menu-links').toggleClass('active');
    });

    // :: Open Menu (.sub-menu)
    $('.nav-bar .item.has-menu').on('click', function () {
        $(this).find('.sub-menu').slideToggle().parent().siblings().find('.sub-menu').slideUp();
    });

    // :: Add Function slideUp() To .sub-menu
    $(document).mouseup(function (e) {
        var nav_item = $('.nav-bar .item.has-menu');
        if (!nav_item.is(e.target) && nav_item.has(e.target).length === 0) {
            $('.sub-menu').slideUp();
        }
    });

    // :: Animation Header
    $('.header-hero.header-1').on('translate.owl.carousel', function () {
        $('.header-hero.header-1 .head-info').removeClass('animated fadeOut').css('opacity', '0');
        $('.header-hero.header-1 .head-info .top-handline').removeClass('animated fadeInUp').css('opacity', '0');
        $('.header-hero.header-1 .head-info .handline').removeClass('animated fadeInUp').css('opacity', '0');
        $('.header-hero.header-1 .head-info p').removeClass('animated fadeInDown').css('opacity', '0');
        $('.header-hero.header-1 .head-info .buttons').removeClass('animated fadeInDown').css('opacity', '0');
    });
    $('.header-hero.header-1').on('translated.owl.carousel', function () {
        $('.header-hero.header-1 .head-info').removeClass('animated fadeIn').css('opacity', '1');
        $('.header-hero.header-1 .head-info .top-handline').addClass('animated fadeInUp').css('opacity', '1');
        $('.header-hero.header-1 .head-info .handline').addClass('animated fadeInUp').css('opacity', '1');
        $('.header-hero.header-1 .head-info p').addClass('animated fadeInDown').css('opacity', '1');
        $('.header-hero.header-1 .head-info .buttons').addClass('animated fadeInDown').css('opacity', '1');
    });

    // :: Add Class Active On Go To Header
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 400) {
            $('.scroll-up').addClass('active');
        } else {
            $('.scroll-up').removeClass('active');
        }
    });

    // :: OWL Carousel Js Header Hero
    $('.header-hero').owlCarousel({
        loop: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        mouseDrag: true,
        touchDrag: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            991: {
                items: 1
            }
        }
    });

    // :: OWL Carousel Js Services Box
    $('.services-box').owlCarousel({
        loop: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        margin: 30,
        autoplayHoverPause: true,
        mouseDrag: true,
        touchDrag: true,
        navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            991: {
                items: 3
            }
        }
    });

    // :: OWL Carousel Js Statistic
    $('.statistic').owlCarousel({
        loop: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        mouseDrag: true,
        touchDrag: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            991: {
                items: 1
            }
        }
    });

    // :: OWL Carousel Js Testimonials Carousel
    $('.testimonials-carousel').owlCarousel({
        loop: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        mouseDrag: true,
        touchDrag: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            991: {
                items: 1
            }
        }
    });
    $('.testimonials-2-carousel').owlCarousel({
        loop: true,
        nav: true,
        margin: 30,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        mouseDrag: true,
        touchDrag: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            991: {
                items: 3
            }
        }
    });

    // :: OWL Carousel Js Sponsors Box
    $('.sponsors-box').owlCarousel({
        loop: true,
        autoplay: true,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        mouseDrag: true,
        touchDrag: true,
        margin: 30,
        responsive: {
            0: {
                items: 3
            },
            768: {
                items: 4
            },
            991: {
                items: 7
            }
        }
    });

    // :: CounterUp Plugin
    $('.count').counterUp({
        delay: 3,
        time: 500
    });

    // :: WoW Plugin
	new WOW().init();


}());
