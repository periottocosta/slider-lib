(function( $ ){

    function slider(element, options){
        
        let instanceUid = 0;
        let defaults = {
            swipe: false, //define if swipe functions will work
            arrows: false, //define if slider will have arrows
            autoplay: true, //if true, will play slider
            prevArrow: null, //Jquery element
            nextArrow: null, //Jquery element
            responsive: null, //breakpoints
            indicators: false, //define if dots indicators will be show
            pauseOnHover: false, //will pause slider on hover event
            currentSlide: null,
            autoplaySpeed: null, //slider speed
            sliderTransform: 0, //value to use in css
            sliderItemWidth: 0,
            slideItensToShow: 1,
            currentIndicator: null,
            sliderItemCounter: 0, //total of slider itens
        };

        $.extend(defaults, options);
        $.extend(this, defaults);

        this.$slider = $(element);
        this.autoPlay = $.proxy(this.autoPlay, this);
        this.swipeEvent = $.proxy(this.swipeEvent, this);
        this.autoPlayTimer = null;
        this.autoPlayClear = $.proxy(this.autoPlayClear, this);
        this.setItensWidth = $.proxy(this.setItensWidth, this);
        this.moveSliderLeft = $.proxy(this.moveSliderLeft, this);
        this.moveSliderRight = $.proxy(this.moveSliderRight, this);
        this.initializeEvents = $.proxy(this.initializeEvents, this);
    }

    slider.prototype.init = function(){

        this.buildArrows();
        this.setItensWidth();
        this.buildIndexPosition();
        this.buildIndicators();
        this.buildItens();
        this.initializeEvents();

        $( window ).resize(()=>{
            this.setItensWidth();
            this.initializeEvents();
        });
    }

    slider.prototype.buildItens = function(){

        this.currentSlide = this.$slider.find(`.carousel-inner .carousel-item:first`);
        this.currentSlide.addClass('current');

        let index = parseInt( this.currentSlide.attr('data-index') );
        
        this.$slider.itens
            .slice(index, index + this.slideItensToShow)
            .addClass('active');

        let lastItem = this.$slider.find(`.carousel-inner .carousel-item:last`);
        lastItem.css('margin-left', `-${this.sliderItemWidth}px`);

        this.$slider.find('.carousel-inner').prepend( lastItem );

        this.updatePosition();
    }

    slider.prototype.buildIndicators = function(){

        if( this.indicators ){

            let i = 0;
            let aux = this.sliderItemCounter;
            let stringAux = '';

            while (i < aux ){

                let currentFlag = '';

                if(i == 0){
                    currentFlag = 'class="current"';
                }

                stringAux += `<li ${currentFlag} data-index="${i}"><span tabindex="-1">${i}</span></li>`;
                i++;
            }

            this.$slider.append('<ol class="carousel-indicators">'+ stringAux + '</ol>');
            this.currentIndicator = this.$slider.find('.carousel-indicators li.current');
        }
    }

    slider.prototype.buildIndexPosition = function(){
        this.$slider.itens = this.$slider.find('.carousel-item:not(.clone)');
        this.sliderItemCounter = this.$slider.itens.length;

        this.$slider.itens.each(function(index, el){
            $( el ).attr('data-index', index);
            $( el ).attr('data-position', index);
        });
    }

    slider.prototype.updatePosition = function(){
        this.$slider.itens = this.$slider.find('.carousel-item:not(.clone)');
        this.sliderItemCounter = this.$slider.itens.length;

        this.$slider.itens.each(function(index, el){
            $( el ).attr('data-position', index);
        });
    }
    
    slider.prototype.initializeEvents = function(){

        if( this.arrows ){
            this.prevArrow.off();
            this.nextArrow.off();

            this.prevArrow.on('click', (e)=>{
                e.preventDefault();

                this.moveSliderLeft();
            });

            this.nextArrow.on('click', (e)=>{
                e.preventDefault();
                
                this.moveSliderRight();
            });
        }
    }

    slider.prototype.moveSliderRight = function(){

        let next = this.currentSlide.next();
        let nextIndicator;
        
        if(this.indicators){
            nextIndicator = this.currentIndicator.next();
            
            if(nextIndicator.length == 0){
               nextIndicator = this.$slider.find('.carousel-indicators li:first');
            }
        }
        this.moveSlider(next, nextIndicator);
    }

    slider.prototype.moveSliderLeft = function(){

        let prev = this.currentSlide.prev();
        let prevIndicator;
        
        if(this.indicators){
            prevIndicator = this.currentIndicator.prev();
            
            if(prevIndicator.length == 0){
               prevIndicator = this.$slider.find('.carousel-indicators li:last');
            }
        }
        this.moveSlider(prev, prevIndicator, 'previous');
    }
    
    slider.prototype.moveSlider = function(nextItem, nextIndicator, moveTo = 'next'){

        switch (moveTo) {
            case 'previous':

                let last = this.$slider.find(`.carousel-inner .carousel-item:last`);
                last.css('margin-left', `-${this.sliderItemWidth}px`);

                this.$slider.find('.carousel-inner').prepend(last);

                nextItem.css('margin-left', `0`);

                break;
            case 'next':
                
                this.currentSlide.css('margin-left', `-${this.sliderItemWidth}px`);
                this.$slider.find('.carousel-inner').append( this.currentSlide.prev().css('margin-left', '0') );

                break;
            default:
                return;
        }

        this.updatePosition();

        this.$slider.itens.removeClass('active current');
        this.$slider.find('.carousel-indicators li').removeClass('current');
        
        nextItem.addClass(' current');
        this.currentSlide = nextItem;
        
        if(this.indicators){
            nextIndicator.addClass('current');
            this.currentIndicator = nextIndicator
        }

        this.$slider.itens.slice(1, this.slideItensToShow+1).addClass('active');
    }

    slider.prototype.setItensWidth = function(){

        let i = 0;
        let windowWidth = $('html, body').width();
        let isBreakpoint = true;
        let containerWidth = this.$slider.outerWidth();

        while (isBreakpoint){

            let minWidth = this.responsive[i].minWidth || 0;
            let maxWidth = this.responsive[i].maxWidth || 1000000;

            if((maxWidth >= windowWidth) && (windowWidth >= minWidth)){
                
                isBreakpoint = false;
                this.slideItensToShow = this.responsive[i].slidesToShow;
            }

            i++;
        }

        this.sliderItemWidth = (containerWidth / this.slideItensToShow)
        this.$slider.find(`.carousel-inner .carousel-item`).css('width', `${this.sliderItemWidth}px` );
    }

    slider.prototype.buildArrows = function(){
        if( (this.arrows) && (this.prevArrow == null || this.nextArrow == null) ){

            this.$slider.append('<a id="carousel-control-prev" class="carousel-control carousel-control-prev"><span class="fa fa-angle-left fa-2x"></span></a><a id="carousel-control-next" class="carousel-control carousel-control-next"><span class="fa fa-angle-right fa-2x"></span></a>');
            
            this.prevArrow = $('#carousel-control-prev');
            this.nextArrow = $('#carousel-control-next');
        }
    }

    /*-----------------------------------------------*/
    $.fn.lineSlider = function(){

        let opt = arguments[0];
        let args = Array.prototype.slice.call(arguments, 1);
        let l = this.length;
        let i, ret;

        for (i = 0; i < l; i++){
            if(typeof opt == 'object' || typeof opt == 'undefined'){

                this[i].slider = new slider(this[i], opt);
                this[i].slider.init();
            }
        }

        return this;
    }
})( jQuery );