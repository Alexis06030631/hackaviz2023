(function ($) {
    $.fn.storymap = function(options) {

        let defaults = {
            selector: '[data-place]',
            breakpointPos: '33.333%',
            createMap: function () {
                // create a map in the "map" div, set the view to a given place and zoom
                map = L.map('map').setView([46.227638, 2.213749], 6);

                // add an OpenStreetMap tile layer
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: 'Made with ❤️ by Alexis',
                }).addTo(map);


                change_steps('intro')
                return map;
            }
        };
        var settings = $.extend(defaults, options);

        function getDistanceToTop(elem, top) {
            var docViewTop = $(window).scrollTop();

            var elemTop = $(elem).offset().top;

            var dist = elemTop - docViewTop;

            var d1 = top - dist;

            if (d1 < 0) {
                return $(window).height();
            }
            return d1;

        }

        function highlightTopPara(paragraphs, top) {

            var distances = _.map(paragraphs, function (element) {
                var dist = getDistanceToTop(element, top);
                return {el: $(element), distance: dist};
            });

            var closest = _.min(distances, function (dist) {
                return dist.distance;
            });

            _.each(paragraphs, function (element) {
                var paragraph = $(element);
                if (paragraph[0] !== closest.el[0]) {
                    paragraph.trigger('notviewing');
                }
            });

            if (!closest.el.hasClass('viewing')) {
                closest.el.trigger('viewing');
            }
        }

        function watchHighlight(element, searchfor, top) {
            var paragraphs = element.find(searchfor);
            highlightTopPara(paragraphs, top);
            $(window).scroll(function () {
                highlightTopPara(paragraphs, top);
            });
        }

        const makeStoryMap = function (element, markers) {

            // Create a div to show the current breakpoint position (for change the map)
            const topElem = $('<div class="breakpoint-current"></div>').css('top', settings.breakpointPos);
            $('body').append(topElem);

            // Get the current top position of the breakpoint
            const top = topElem.offset().top - $(window).scrollTop();


            const searchfor = settings.selector;

            // Find all the paragraphs with the data-place attribute
            const paragraphs = element.find(searchfor);

            paragraphs.on('viewing', function () {
                $(this).addClass('viewing');
            });
            paragraphs.on('notviewing', function () {
                $(this).removeClass('viewing');
            });

            watchHighlight(element, searchfor, top);

            // Create the map and get the initial point and zoom
            const map = settings.createMap();
            window.data.initPoint = map.getCenter();
            window.data.initZoom = map.getZoom();


            // Create a feature group to add the markers
            window.data.fg = L.featureGroup().addTo(map);

            function showMapView(key) {

                // Clear the map of all layers and GeoJSON
                window.data.fg.clearLayers();
                map.eachLayer(function (layer) {
                    if (layer instanceof L.GeoJSON) {
                        map.removeLayer(layer);
                    }
                })
                change_steps(key)
            }

            paragraphs.on('viewing', function () {
                showMapView($(this).data('place'));
            });
        };

        makeStoryMap(this, settings.markers);

        return this;
    }

}(jQuery));