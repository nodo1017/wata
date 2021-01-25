// platform nav 
jQuery(document).ready(function ($) {

	//solution select
	$('.method').on('click', function () {
		$('.method').removeClass('active');
		$(this).addClass('active');
	});

	//on mobile - open submenu
	$('.has-children').children('a').on('click', function (event) {
		//prevent default clicking on direct children of .has-children 
		event.preventDefault();
		var selected = $(this);
		selected.next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('move-out');
	});

	//submenu items - go back links
	$('.go-back').on('click', function () {
		var selected = $(this),
			visibleNav = $(this).parent('ul').parent('.has-children').parent('ul');
		selected.parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('move-out');
	});

	function toggleNav() {
		var navIsVisible = (!$('.cd-dropdown').hasClass('dropdown-is-active')) ? true : false;
		$('.cd-dropdown').toggleClass('dropdown-is-active', navIsVisible);
		$('.cd-dropdown-trigger').toggleClass('dropdown-is-active', navIsVisible);
		if (!navIsVisible) {
			$('.cd-dropdown').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
				$('.has-children ul').addClass('is-hidden');
				$('.move-out').removeClass('move-out');
				$('.is-active').removeClass('is-active');
			});
		}
	}
});

// global GNB
jQuery(document).ready(function ($) {
	function morphDropdown(element) {
		this.element = element;
		this.mainNavigation = this.element.find('.main-nav');
		this.mainNavigationItems = this.mainNavigation.find('.has-dropdown');
		this.dropdownList = this.element.find('.dropdown-list');
		this.dropdownWrappers = this.dropdownList.find('.dropdown');
		this.dropdownItems = this.dropdownList.find('.content');
		this.dropdownBg = this.dropdownList.find('.bg-layer');
		this.mq = this.checkMq();
		this.bindEvents();
	}

	morphDropdown.prototype.checkMq = function () {
		//check screen size
		var self = this;
		return window.getComputedStyle(self.element.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
	};

	morphDropdown.prototype.bindEvents = function () {
		var self = this;
		//hover over an item in the main navigation
		this.mainNavigationItems.mouseenter(function (event) {
			//hover over one of the nav items -> show dropdown
			self.showDropdown($(this));
		}).mouseleave(function () {
			setTimeout(function () {
				//if not hovering over a nav item or a dropdown -> hide dropdown
				if (self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0) self.hideDropdown();
			}, 50);
		});

		//hover over the dropdown
		this.dropdownList.mouseleave(function () {
			setTimeout(function () {
				//if not hovering over a dropdown or a nav item -> hide dropdown
				(self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0) && self.hideDropdown();
			}, 50);
		});

		//click on an item in the main navigation -> open a dropdown on a touch device
		this.mainNavigationItems.on('touchstart', function (event) {
			var selectedDropdown = self.dropdownList.find('#' + $(this).data('content'));
			if (!self.element.hasClass('is-dropdown-visible') || !selectedDropdown.hasClass('active')) {
				event.preventDefault();
				self.showDropdown($(this));
			}
		});

		//on small screens, open navigation clicking on the menu icon
		this.element.on('click', '.nav-trigger', function (event) {
			event.preventDefault();
			self.element.toggleClass('nav-open');
		});
	};

	morphDropdown.prototype.showDropdown = function (item) {
		this.mq = this.checkMq();
		if (this.mq == 'desktop') {
			var self = this;
			var selectedDropdown = this.dropdownList.find('#' + item.data('content')),
				selectedDropdownHeight = selectedDropdown.innerHeight(),
				selectedDropdownWidth = selectedDropdown.children('.content').innerWidth(),
				selectedDropdownLeft = item.offset().left + item.innerWidth() / 2 - selectedDropdownWidth / 2;

			//update dropdown position and size
			this.updateDropdown(selectedDropdown, parseInt(selectedDropdownHeight), selectedDropdownWidth, parseInt(selectedDropdownLeft));
			//add active class to the proper dropdown item
			this.element.find('.active').removeClass('active');
			selectedDropdown.addClass('active').removeClass('move-left move-right').prevAll().addClass('move-left').end().nextAll().addClass('move-right');
			item.addClass('active');
			//show the dropdown wrapper if not visible yet
			if (!this.element.hasClass('is-dropdown-visible')) {
				setTimeout(function () {
					self.element.addClass('is-dropdown-visible');
				}, 10);
			}
		}
	};

	morphDropdown.prototype.updateDropdown = function (dropdownItem, height, width, left) {
		this.dropdownList.css({
			'-moz-transform': 'translateX(' + left + 'px)',
			'-webkit-transform': 'translateX(' + left + 'px)',
			'-ms-transform': 'translateX(' + left + 'px)',
			'-o-transform': 'translateX(' + left + 'px)',
			'transform': 'translateX(' + left + 'px)',
			'width': width + 'px',
			'height': height + 'px'
		});

		this.dropdownBg.css({
			'-moz-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-webkit-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-ms-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-o-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'transform': 'scaleX(' + width + ') scaleY(' + height + ')'
		});
	};

	morphDropdown.prototype.hideDropdown = function () {
		this.mq = this.checkMq();
		if (this.mq == 'desktop') {
			this.element.removeClass('is-dropdown-visible').find('.active').removeClass('active').end().find('.move-left').removeClass('move-left').end().find('.move-right').removeClass('move-right');
		}
	};

	morphDropdown.prototype.resetDropdown = function () {
		this.mq = this.checkMq();
		if (this.mq == 'mobile') {
			this.dropdownList.removeAttr('style');
		}
	};

	var morphDropdowns = [];
	if ($('.cd-morph-dropdown').length > 0) {
		$('.cd-morph-dropdown').each(function () {
			//create a morphDropdown object for each .cd-morph-dropdown
			morphDropdowns.push(new morphDropdown($(this)));
		});

		var resizing = false;

		//on resize, reset dropdown style property
		updateDropdownPosition();
		$(window).on('resize', function () {
			if (!resizing) {
				resizing = true;
				(!window.requestAnimationFrame) ? setTimeout(updateDropdownPosition, 300) : window.requestAnimationFrame(updateDropdownPosition);
			}
		});

		function updateDropdownPosition() {
			morphDropdowns.forEach(function (element) {
				element.resetDropdown();
			});

			resizing = false;
		};
	}
});

// Glitch Timeline Function
jQuery(document).ready(function () {

	// Glitch Timeline Function
	var glitchTimeline = function () {
		var timeline = new TimelineMax({
			repeat: -1,
			repeatDelay: 2,
			paused: true,
			onUpdate: function () {
				$turb.setAttribute('baseFrequency', turbVal.val + ' ' + turbValX.val);
			}
		});

		timeline
			.to(turbValX, 0.1, {
				val: 0.5
			})
			.to(turbVal, 0.1, {
				val: 0.02
			});
		timeline
			.set(turbValX, {
				val: 0.000001
			})
			.set(turbVal, {
				val: 0.000001
			});
		timeline
			.to(turbValX, 0.2, {
				val: 0.4
			}, 0.4)
			.to(turbVal, 0.2, {
				val: 0.002
			}, 0.4);
		timeline
			.set(turbValX, {
				val: 0.000001
			})
			.set(turbVal, {
				val: 0.000001
			});

		// console.log("duration is: " + timeline.duration());

		return {
			start: function () {
				timeline.play(0);
			},
			stop: function () {
				timeline.pause();
			}
		};
	};


});

jQuery(document).ready(function(){
	if( $('.cd-stretchy-nav').length > 0 ) {
		var stretchyNavs = $('.cd-stretchy-nav');
		
		stretchyNavs.each(function(){
			var stretchyNav = $(this),
				stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');
			
			stretchyNavTrigger.on('click', function(event){
				event.preventDefault();
				stretchyNav.toggleClass('nav-is-visible');
			});
		});

		$(document).on('click', function(event){
			( !$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span') ) && stretchyNavs.removeClass('nav-is-visible');
		});
	}
});

jQuery(document).ready(function(){
    // Slide In Panel - by CodyHouse.co
	var panelTriggers = document.getElementsByClassName('js-cd-panel-trigger');
	if( panelTriggers.length > 0 ) {
		for(var i = 0; i < panelTriggers.length; i++) {
			(function(i){
				var panelClass = 'js-cd-panel-'+panelTriggers[i].getAttribute('data-panel'),
					panel = document.getElementsByClassName(panelClass)[0];
				// open panel when clicking on trigger btn
				panelTriggers[i].addEventListener('click', function(event){
					event.preventDefault();
					addClass(panel, 'cd-panel--is-visible');
				});
				//close panel when clicking on 'x' or outside the panel
				panel.addEventListener('click', function(event){
					if( hasClass(event.target, 'js-cd-close') || hasClass(event.target, panelClass)) {
						event.preventDefault();
						removeClass(panel, 'cd-panel--is-visible');
					}
				});
			})(i);
		}
	}
	
	//class manipulations - needed if classList is not supported
	//https://jaketrent.com/post/addremove-classes-raw-javascript/
	function hasClass(el, className) {
	  	if (el.classList) return el.classList.contains(className);
	  	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}
	function addClass(el, className) {
	 	if (el.classList) el.classList.add(className);
	 	else if (!hasClass(el, className)) el.className += " " + className;
	}
	function removeClass(el, className) {
	  	if (el.classList) el.classList.remove(className);
	  	else if (hasClass(el, className)) {
	    	var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	    	el.className=el.className.replace(reg, ' ');
	  	}
	}
});