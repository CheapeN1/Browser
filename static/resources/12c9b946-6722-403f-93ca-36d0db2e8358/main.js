(function ($) {
	"use strict"; // Start of use strict
	$(window).on('load', function () {
		var layoutMode = 'fitRows';
		if ($(window).width() < 992) {
			layoutMode = 'masonry';
		}
		$('.project-items').isotope({
			layoutMode: layoutMode
		});
	});
	$('.count').each(function () {
		$(this).prop('Counter', 0).animate({
			Counter: $(this).text()
		}, {
			duration: 4000,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now));
			}
		});
	});
	$(".site-navbar .attr-nav").each(function () {
		$("li.search > a", this).on("click", function (e) {
			e.preventDefault();
			$(".top-search").slideToggle();
		});
	});
	$(".input-group-text.close-search").on("click", function () {
		$(".top-search").slideUp();
	});
	$(window).on('load', function () {
		// Page loader
		$("body").imagesLoaded(function () {
			$(".page-loader div").fadeOut();
			$(".page-loader").delay(200).fadeOut("slow");
		});
	});
	var $carousel = $('[data-owl-carousel]');
	if ($carousel.length) {
		$carousel.each(function (index, el) {
			$(this).owlCarousel($(this).data('owl-carousel'));
		});
	}
	// Transpaner menu
	if ($("header").hasClass("transparent")) {
		$("header").addClass("js-transparent");
	}
	$(window).scroll(function () {
		if ($(window).scrollTop() > 44) {
			$(".js-transparent").removeClass("transparent");
			$("header").addClass("stick-fixed");
		} else {
			$(".js-transparent").addClass("transparent");
			$("header").removeClass("stick-fixed");
		}
	});
	var siteMenuClone = function () {
		$('.js-clone-nav').each(function () {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});
		setTimeout(function () {
			var counter = 0;
			$('.site-mobile-menu .has-children').each(function () {
				var $this = $(this);
				$this.prepend('<a class="arrow-collapse collapsed">');
				$this.find('.arrow-collapse').attr({
					'data-bs-toggle':'collapse',
					'role':'button',
					'aria-expanded':'false',
					'aria-controls':'collapseItem' + counter,
					'data-toggle': 'collapse',
					'href': '#collapseItem' + counter
				});
				$this.find('> ul').attr({
					'class': 'collapse',
					'id': 'collapseItem' + counter
				});
				counter++;
			});
		}, 1000);
		$('body').on('click', '.js-menu-toggle', function (e) {
			var $this = $(this);
			e.preventDefault();
			if ($('body').hasClass('offcanvas-menu')) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		})
	};
	siteMenuClone();
})(jQuery); // End of use strict
$(document).ready(function () {
	$(".kurumsal table").wrap("<div class='table-responsive'></div>");
	$(".kurumsal table").addClass("table table-striped");
	$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();
		$(this).parent().siblings().removeClass('open');
		$(this).parent().toggleClass('open');
	});
	var owlm = $("#owl-mansetHaber");
	owlm.owlCarousel({
		items: 1,
		itemsMobile: true,
		responsive: false,
		pagination: false,
		paginationNumbers: false,
		autoHeight: false,
		autoPlay: true,
		stopOnHover: true,
		loop: true,
		rewindSpeed: 300,
		autoplayHoverPause: false,
		slideSpeed: 300,
		afterAction: function (el) {
			var cur = this.owl.currentItem;
			$(".mansetHaberNumbers ul").find('li').each(function () {
				var aID = $(this).attr('data-id');
				if (aID == cur) {
					$(this).addClass("active");
				} else {
					$(this).removeClass("active");
				}
			});
		}
	});
////get carousel instance data and store it in variable owl
	var owam = $("#owl-mansetHaber").data('owlCarousel');
	$(".mansetHaberNumbers ul li").mouseover(function () {
		var id = $(this).attr('data-id');
		owam.goTo(id)
	});
	var sync1 = $("#sync1");
	var sync2 = $("#sync2");
	var slidesPerPage = 4; //globaly define number of elements per page
	var syncedSecondary = true;
	sync1.owlCarousel({
		items: 1,
		slideSpeed: 2000,
		nav: true,
		autoplay: true,
		dots: false,
		loop: true,
		responsiveRefreshRate: 200,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
	}).on('changed.owl.carousel', syncPosition);
	sync2
		.on('initialized.owl.carousel', function () {
			sync2.find(".owl-item").eq(0).addClass("current");
		})
		.owlCarousel({
			items: slidesPerPage,
			dots: true,
			nav: false,
			smartSpeed: 200,
			slideSpeed: 500,
			margin: 15,
			slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
			responsiveRefreshRate: 100,
			responsive: {
				0: {
					items: 3
				},
				600: {
					items: 4
				},
				1000: {
					items: 4,
					loop: false
				}
			}
		}).on('changed.owl.carousel', syncPosition2);

	function syncPosition(el) {
		//if you set loop to false, you have to restore this next line
		//var current = el.item.index;
		//if you disable loop you have to comment this block
		var count = el.item.count - 1;
		var current = Math.round(el.item.index - (el.item.count / 2) - .5);
		if (current < 0) {
			current = count;
		}
		if (current > count) {
			current = 0;
		}
		//end block
		sync2
			.find(".owl-item")
			.removeClass("current")
			.eq(current)
			.addClass("current");
		var onscreen = sync2.find('.owl-item.active').length - 1;
		var start = sync2.find('.owl-item.active').first().index();
		var end = sync2.find('.owl-item.active').last().index();
		if (current > end) {
			sync2.data('owl.carousel').to(current, 100, true);
		}
		if (current < start) {
			sync2.data('owl.carousel').to(current - onscreen, 100, true);
		}
	}

	function syncPosition2(el) {
		if (syncedSecondary) {
			var number = el.item.index;
			sync1.data('owl.carousel').to(number, 100, true);
		}
	}

	sync2.on("click", ".owl-item", function (e) {
		e.preventDefault();
		var number = $(this).index();
		sync1.data('owl.carousel').to(number, 300, true);
	});
});