# Slider

Used on https://www.buscaonibus.com.br/

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
        
        $('.line').lineSlider(defaults);
