(function() {
	'use strict';

//Плагин к Lampa для перключения серий клавишами пульта для ТВ LG
	//listen to button
	Lampa.Keypad.listener.destroy();
	 Lampa.Keypad.listener.follow('keydown', function (e) {
      var code = e.code;
     // Lampa.Noty.show('code_ '+ code);
      if (Lampa.Player.opened()) {
        if (code === 428 || code === 34) {
          Lampa.PlayerPlaylist.prev();
          //$('body').find('.player-panel__prev.button.selector').click();
  			 // console.log ("[P- button hit]");
        } 
        if (code === 427 || code === 33) {
          Lampa.PlayerPlaylist.next();
		    	//$('body').find('.player-panel__next.button.selector').click();
  			  //console.log ("[P+ button hit]");
        } 
      } 
    });

//Стиль "Жёлтая обводка"
	Lampa.Template.add('tv_style', '<style>#app > div.wrap.layer--height.layer--width > div.wrap__content.layer--height.layer--width > div > div > div.activity.layer--width.activity--active > div.activity__body > div > div.scroll.scroll--mask.scroll--over.layer--wheight > div > div > div > div.card.selector.card--collection.card--loaded.focus > div.card__view > img{box-shadow: 0 0 0 0.4em #fff10d!important;}</style>');
	$('body').append(Lampa.Template.get('tv_style', {}, true));


	function freetv_n(object) {
		var network = new Lampa.Reguest();
		var scroll = new Lampa.Scroll({
			mask: true,
			over: true,
			step: 200
		});
		var items = [];
		var html = $('<div></div>');
		var body = $('<div class="freetv_n category-full"></div>');
		var info;
		var last;
		var cors = '';
		var catalogs = [];
		this.create = function() {
			var _this = this;
			this.activity.loader(true);
			network.silent(object.url, this.build.bind(this), function() {
				var empty = new Lampa.Empty();
				html.append(empty.render());
				_this.start = empty.start;
				_this.activity.loader(false);
				_this.activity.toggle();
			});
			return this.render();
		};
		this.append = function (data) {
			var _this3 = this;
			data.forEach(function (element) {
				var card = Lampa.Template.get('card', {
					title: element.name,
					release_year: element.group ? element.group + (element.epg ? ' / ' + element.epg : '') : ''
				});
				card.addClass('card--collection');
				card.find('.card__img').css({
					'cursor': 'pointer',
					'background-color': '#353535a6'
				});
				var img = card.find('.card__img')[0];
				img.onload = function () {
					card.addClass('card--loaded');
				};
				img.onerror = function (e) {
					img.src = './img/img_broken.svg';
				};
				img.src = element.picture;
				card.on('hover:focus', function () {
					last = card[0];
					scroll.update(card, true);
					info.find('.info__title').text(element.name);
					info.find('.info__title-original').text(element.time);
				});
				card.on('hover:enter', function () {
					var video = {
						title: element.name,
						url: element.video
					};
					Lampa.Player.play(video);
					var playlist = [];
					var i = 1;
					data.forEach(function (elem) {
						playlist.push({
							title: i + ' - ' + elem.name,
							url: elem.video
						});
						i++;
					});
					Lampa.Player.playlist(playlist);
				});
				body.append(card);
				items.push(card);
			});
		};
		this.build = function(data) {
			var _this2 = this;
			Lampa.Background.change('https://images.wallpaperscraft.com/image/single/wierschem_germany_castle_119771_2560x1600.jpg');
			Lampa.Template.add('button_category', "<style>@media screen and (max-width: 2560px) {.freetv_n .card--collection {width: 16.6%!important;}}@media screen and (max-width: 385px) {.freetv_n .card--collection {width: 33.3%!important;}}</style><div class=\"full-start__button selector view--category\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   \n    </div>");
			Lampa.Template.add('info_radio', '<div class="info layer--width"><div class="info__left"><div class="info__title"></div><div class="info__title-original"></div><div class="info__create"></div></div><div class="info__right">  <div id="stantion_filtr"></div></div></div>');
			var btn = Lampa.Template.get('button_category');
			info = Lampa.Template.get('info_radio');
		  info.find('#stantion_filtr').append(btn);
			info.find('.view--category').on('hover:enter hover:click', function () {
				_this2.selectGroup();
			});
			scroll.render().addClass('layer--wheight').data('mheight', info);
			html.append(info.append());
			html.append(scroll.render());
			this.append(data);
			scroll.append(body);
			this.activity.loader(false);
			this.activity.toggle();
		};
		this.selectGroup = function () {
		  Lampa.Select.show({
				title: '',
				items: catalogs,
				onSelect: function onSelect(a) {
					Lampa.Activity.push({
						url: cors + a.url,
						title: a.title,
						component: 'freetv_n',
						page: 1
					});
				},
				onBack: function onBack() {
					Lampa.Controller.toggle('content');
				}
			});
		};
		this.start = function () {
			var _this = this;
			Lampa.Controller.add('content', {
				toggle: function toggle() {
					Lampa.Controller.collectionSet(scroll.render());
					Lampa.Controller.collectionFocus(last || false, scroll.render());
				},
				left: function left() {
					if (Navigator.canmove('left')) Navigator.move('left');
					else Lampa.Controller.toggle('menu');
				},
				right: function right() {
					if (Navigator.canmove('right')) Navigator.move('right');
					else _this.selectGroup();
				},
				up: function up() {
					if (Navigator.canmove('up')) {
						Navigator.move('up');
					} else {
					 	if (!info.find('.view--category').hasClass('focus')) {
							if (!info.find('.view--category').hasClass('focus')) {
								Lampa.Controller.collectionSet(info);
					  		Navigator.move('right')
							}
						} else Lampa.Controller.toggle('head');
					}
				},
				down: function down() {
					if (Navigator.canmove('down')) Navigator.move('down');
					else if (info.find('.view--category').hasClass('focus')) {
						 Lampa.Controller.toggle('content');
					} 
				},
				back: function back() {
					Lampa.Activity.backward();
				}
			});
			Lampa.Controller.toggle('content');
		};
		this.pause = function() {};
		this.stop = function() {};
		this.render = function() {
			return html;
		};
		this.destroy = function() {
			network.clear();
			scroll.destroy();
			if (info) info.remove();
			html.remove();
			body.remove();
			network = null;
			items = null;
			html = null;
			body = null;
			info = null;
		};
	}

	function startfreetv_n() {
		window.plugin_freetv_N_ready = true;
		Lampa.Component.add('freetv_n', freetv_n);
		Lampa.Listener.follow('app', function(r) {
			if (r.type == 'ready') {
				var ico = '<svg height=\"244\" viewBox=\"0 0 260 244\" xmlns=\"http://www.w3.org/2000/svg\" style=\"fill-rule:evenodd;\" fill=\"currentColor\"><path d=\"M259.5 47.5v114c-1.709 14.556-9.375 24.723-23 30.5a2934.377 2934.377 0 0 1-107 1.5c-35.704.15-71.37-.35-107-1.5-13.625-5.777-21.291-15.944-23-30.5v-115c1.943-15.785 10.61-25.951 26-30.5a10815.71 10815.71 0 0 1 208 0c15.857 4.68 24.523 15.18 26 31.5zm-230-13a4963.403 4963.403 0 0 0 199 0c5.628 1.128 9.128 4.462 10.5 10 .667 40 .667 80 0 120-1.285 5.618-4.785 8.785-10.5 9.5-66 .667-132 .667-198 0-5.715-.715-9.215-3.882-10.5-9.5-.667-40-.667-80 0-120 1.35-5.18 4.517-8.514 9.5-10z\"/><path d=\"M70.5 71.5c17.07-.457 34.07.043 51 1.5 5.44 5.442 5.107 10.442-1 15-5.991.5-11.991.666-18 .5.167 14.337 0 28.671-.5 43-3.013 5.035-7.18 6.202-12.5 3.5a11.529 11.529 0 0 1-3.5-4.5 882.407 882.407 0 0 1-.5-42c-5.676.166-11.343 0-17-.5-4.569-2.541-6.069-6.375-4.5-11.5 1.805-2.326 3.972-3.992 6.5-5zM137.5 73.5c4.409-.882 7.909.452 10.5 4a321.009 321.009 0 0 0 16 30 322.123 322.123 0 0 0 16-30c2.602-3.712 6.102-4.879 10.5-3.5 5.148 3.334 6.314 7.834 3.5 13.5a1306.032 1306.032 0 0 0-22 43c-5.381 6.652-10.715 6.652-16 0a1424.647 1424.647 0 0 0-23-45c-1.691-5.369-.191-9.369 4.5-12zM57.5 207.5h144c7.788 2.242 10.288 7.242 7.5 15a11.532 11.532 0 0 1-4.5 3.5c-50 .667-100 .667-150 0-6.163-3.463-7.496-8.297-4-14.5 2.025-2.064 4.358-3.398 7-4z\"/></svg>';
				var menu_items = $('<li class="menu__item selector" data-action="freetv_r"><div class="menu__ico">' + ico + '</div><div class="menu__text">4K Films</div></li>');
				menu_items.on('hover:enter', function() {
					Lampa.Activity.push({
						url: 'https://wolfdsvsdv.000webhostapp.com/Bazon/Films4K.json',
						title: '4K Films',
						component: 'freetv_n',
						page: 1
					});
				});
				$('.menu .menu__list').eq(0).append(menu_items);
			}
		});
	}
//METRIKA	
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(92225618, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });

var METRIKAF = '<noscript><div><img src="https://mc.yandex.ru/watch/92225618" style="position:absolute; left:-9999px;" alt="" /></div></noscript>';
$('body').append(METRIKAF);
/*
	function updateLogo() {
			$("#MyLogoDiv").remove()
			var MyLogo = '<div id="MyLogoDiv" class="hide" style="z-index: 51!important; position: fixed!important;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/FreeTv_Egypt_Logo.png/640px-FreeTv_Egypt_Logo.png" width="150" height="150"></div>'
			$('.player').append(MyLogo)
		if (($('body > div.player > div.player-panel').hasClass( "panel--visible" ) == false) || ($('body > div.player > div.player-info').hasClass( "info--visible" ) == false)) {
			if (Lampa.Activity.active().component == 'freetv_n') {
			$('#MyLogoDiv').removeClass('hide')
			} 
		}
	} 
  
	
	
	if(window.appready) setInterval(updateLogo, 500);
	else {
		Lampa.Listener.follow('app', function(e) {
			if(e.type == 'ready') setInterval(updateLogo, 500);
		});
	}
*/
	if (!window.plugin_freetv_N_ready) startfreetv_n();


})();