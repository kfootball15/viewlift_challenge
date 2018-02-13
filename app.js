/* Assessment: Use this MRSS feed http://www.snagfilms.com/apis/films.json?limit=10 and render that in 
React/Angular.JS in grid layout using and this should look something 
like this http://www.snagfilms.com/. This exercise should take 30 minutes. */

/* Approach:
	[] Services to fetch data from site
	[] component for hero carousel
	[] component for list
	[] fixed navbar that sticks to top of screen
*/

angular.module('viewLift',['ui.carousel'])
.run(function () {
	console.log("STARTED")
})
.service('snagfilmsService', function ($http) {
	this.getFilms = function () {
		return $http.get('http://www.snagfilms.com/apis/films.json?limit=10')
		.then((films)=>{
			return films.data.films.film
		})
		.catch((error)=>{console.error(error)})
	}
})
.component('navbarTop', {
	template: `
		<header>
			<div class="main-nav-container">
				<div class="hamburger-button" ng-click="$ctrl.switchmenu()">&#xf394;</div>
				

  				<a class="hamburger-menu-button" ng-click="$ctrl.openMenu()"></a>
  				<div class="hamburger-menu-content" ng-class="{active: $ctrl.isShowingMenu}">
    				<div class="hamburger-menu-close-wrapper">
      					<a class="hamburger-menu-close" ng-click="$ctrl.closeMenu()">X</a>
      					  	<ul class="menu-list">
						    	<li class="menu-item">
						      		Home
						    	</li>
						    	<li class="menu-item">
						      		Movies
						    	</li>
						    	<li class="menu-item">
						      		Shows
						    	</li>
						    </ul>
    				</div>
  				</div>
  				<div class="hamburger-backdrop" ng-class="{active: $ctrl.isShowingMenu}" ng-click="dtHamburgerMenu.closeMenu()">
  				</div>


				<div class="main-logo-container">
					<a href=# class="nav-link"> 
						<img ng-src="snag-logo.png"class="logo-image" alt="Home">
					</a>
				</div>
				<div class="main-nav-items">
					<div class="nav-item"> 
						<a href=# class="nav-link"> 
							<span>Home</span>
						</a>
					</div>
					<div class="nav-item"> 
						<a href=# class="nav-link"> 
							<span>Movies</span>
						</a>
					</div>
					<div class="nav-item">
						<a href=# class="nav-link"> 
							<span>Shows</span>
						</a>
					</div>
				</div>
				<div class="sub-nav-items">
					<div class="nav-search sub-nav-item">
						<img ng-src="search-icon.png" alt="Search">
					</div>
					<div class="nav-login sub-nav-item">
						<button>Login</button>
					</div>
				</div>
			</div>
		</header>
	`,
	controller ($window) {

		this.$onInit = function () {
			this.isShowingMenu = false;
			var screenWidth = $window.innerWidth;
			screenWidth < 1000 ? this.isMobile = true : this.isMobile = false;
		}
		this.switchmenu = function () {
		    this.isShowingMenu = !this.isShowingMenu;
		}

		this.closeMenu = function () {
		    this.isShowingMenu = false;
		}
	}
})
.component('movieContent', {
	template:`
		<movies-hero events="$ctrl.events"></movies-hero>
	    <movies-list events="$ctrl.events"></movies-list>
	`,
	controller (snagfilmsService) {
		this.test = "testing"
		snagfilmsService.getFilms()
		.then((events)=>{
			this.events=events;
		})
	}
})
.component('moviesHero', {
	template:`
		<div class="hero-carousel">
			<ui-carousel 
				class="hero-carousel"
				slides="$ctrl.slides"
				dots="true"
				arrows="true"
				initial-slide="1"
				autoplay="true"
				autoplay-speed="4000"
				>

				<carousel-item class="carousel-item">
					<div class="hero-image-container">
						<img ng-src="{{item.images.image[0].src}}" alt="{{item.title}}">
						<a href="{{item.permaLink}}" class="hero-watch-button"></a>
					</div>
					<div class="hero-title">
						<div class="hero-details">
							<div class="hero-info">
								<h1 ng-show="item.title">{{item.title | limitTo: 50}}{{item.title.length > 50 ? '...' : ''}}</h1>
								<div class="hero-sub">
									<h2 ng-show="item.primaryCategory.title">{{item.primaryCategory.title}}|</h2>
									<h2 ng-show="item.geoRestrictions">{{item.geoRestrictions}}</h2>
									<h2 ng-show="item.parentalRating">| {{item.parentalRating}}</h2>
								</div>
							</div>
						</div>
						<div class="hero-button">
							<a ng-href="{{item.permaLink}}">Watch Now</a>
						</div>
					</div>
				</carousel-item>

				<carousel-prev>
					<button class="prev-button hero-slider-button"></button>
				</carousel-prev>

				<carousel-next>
					<button class="next-button hero-slider-button"></button>
				</carousel-next>

			</ui-carousel>
		</div>
	`,
	controller () {
		this.$onInit = function () {
			this.slides=[{}]
		}
		this.$onChanges = function (changes) {
			//Attach incoming event data to some slides for our carousel
			this.slides = changes.events.currentValue;
		}
	},
	bindings: {
		events:"<"
	}
})
.component('moviesList', {
	template:`
		<div class="event-container" ng-repeat="title in $ctrl.eventRows">
			<div class="events-title-container">
				<h1>{{title}}</h1>
			</div>
			<ui-carousel 
				class="events-carousel"
				slides="$ctrl.slides"
				slides-to-show="$ctrl.slidesToShow"
				slides-to-scroll="$ctrl.slidesToShow"
				arrows="true" 
				>

				<carousel-item class="carousel-item" >
					<a class="event-link-item" ng-href="{{item.permaLink}}">
						<div class="event-image-container">
							<img ng-src="{{item.images.image[0].src}}">
							<div class="watch-button"></div>
						</div>
						<div class="event-details-container">
							<span>{{item.title}}</span>
						</div>
					</a>
				</carousel-item>

				<carousel-prev>
					<button class="prev-button event-slider-button"></button>
				</carousel-prev>

				<carousel-next>
					<button class="next-button event-slider-button"></button>
				</carousel-next>


			</ui-carousel>
		</div>
	`,
	controller ($window) {
		this.$onInit = function () {
			var screenWidth = $window.innerWidth; //Grab screen width so we can do a simple mobile device check
			this.slides = [{}] //Start with an empty to slide for load;
			this.eventRows= ["Todays Live Events", "Tomorrows Live Events", "Events Coming Soon"] //Some mock rows
			screenWidth<600 ? this.slidesToShow=3 : this.slidesToShow=5; //Mobile check
		}
		this.$onChanges = function (changes) {
			//Attach incoming event data to some slides for our carousel
			this.slides = changes.events.currentValue;
		}
	},
	bindings: {
		events:"<"
	}
})
// navbar-top
// movies-hero
// movies-list
