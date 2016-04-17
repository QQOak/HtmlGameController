"use strict";

(function ($) {

    $.fn.ThumbStick = function (options) {
        return this.each(function () {



            var settings = $.extend({
                gameController: null,
                stickRadius: 40,
                initialRadius: 40,
                maxRadius: 200,
                openDuration: 400,
                closeDuration: 100,
                outputLabel: null
            }, options);

            // We'll be need to reference "this" later
            var $this = this;
            
            // The stick follows the users thumbs; it graphically represents the position of the thumbsticks
            var stick = null;
            
            // The range is the graphical representation of the area that the stick moves within.
            var range = null;
            
            // The touch Id is the browser assigned Id for the touch event.
            // The touch event is assigned an Id based on touch order in the window/document.
            var touchId = null;
            
                        
            // Find the central point of this element.
            var centerPosition = getCenter(this);
            
            

            // Calculates and returns the Central coordinates for an element as a 
            function getCenter(elem) {
                var $elem = $(elem);
                var pos = $elem.offset();

                pos.left += ($elem.width() / 2);
                pos.top += ($elem.height() / 2);

                pos.left = Math.floor(pos.left);
                pos.top = Math.floor(pos.top);
                return pos;
            };





            // Calculate the minimum and maximum x and Y coordinates for the element
            // This does not account for the limits imposed by keeping the stick contrained with the element

            stick = createStick(this, centerPosition, settings.stickRadius);
            createRange(this, centerPosition, settings.maxRadius);

            




            $(this).bind('touchstart', function (e) {
                e.preventDefault();
                var touches = e.originalEvent.touches || e.originalEvent.changedTouches;

                // The highest index touch event appears to be the latest of the touch events
                var touch = touches[touches.length - 1];
                touchId = touch.identifier;
                
                var pos = getStickPosition(touch);
                moveStick(stick, pos.pageCoordinates);
                updatePositionLabel(pos);
            });


            $(this).bind('touchmove', function (e) {
                e.preventDefault();

                var touches = e.originalEvent.touches || e.originalEvent.changedTouches;
                var touchCount = touches.length;


                for (var i = 0; i <= touchCount - 1; i++) {
                    var touch = touches[i];
                    if (touch.identifier == touchId) {

                        var pos = getStickPosition(touch);
                        moveStick(stick, pos.pageCoordinates);
                        updatePositionLabel(pos);
                        break;

                    }
                }

            });




            $(this).bind('touchend', function (e) {
                e.preventDefault();
                
                moveStick(stick, { left: centerPosition.left - settings.stickRadius,
                    top: centerPosition.top - settings.stickRadius
                });

                var pos = getStickPosition({ pageX: centerPosition.left, pageY: centerPosition.top });
                updatePositionLabel(pos);
                touchId = null;

            });


            function writeToLog(message) {
                //var $log = $('#Log');
                //$('<div>', { innerText : message }).appendTo($log);
            }

            function createStick(container, center, radius) {

                var $container = $(container);

                // We're currently assuming that the thumbStick will go into the centre of the element.
                var left = center.left - radius;
                var top = center.top - radius;

                var _stick = $('<div>', {
                    id: container.id + '_Stick',
                    style: 'opacity: 0.25; background-color: #0099cc; border: 5px solid #0099cc; position: absolute; left: ' + left + 'px; top: ' + top + 'px; border-radius:' + (settings.stickRadius + 5) + 'px;',
                    width: (settings.stickRadius * 2) + 'px',
                    height: (settings.stickRadius * 2) + 'px'
                });

                _stick.appendTo($container);
                return _stick;
            };


            function destroyStick(container) {

            };

            function createRange(container, center, radius) {

                var $container = $(container);

                // We're currently assuming that the thumbStick will go into the centre of the element.
                var left = center.left - radius;
                var top = center.top - radius;

                $('<div>', {
                    id: container.id + '_Range',
                    style: 'opacity: 0.4; border: 3px solid #0099cc; position: absolute; left: ' + left + 'px; top: ' + top + 'px; border-radius:' + (radius+3) + 'px;',
                    width: (radius * 2) + 'px',
                    height: (radius * 2) + 'px'
                }).appendTo($container);

                updatePositionLabel({
                    axes: { xAxis: 0, yAxis: 0 },
                    vector: { direction: 0, magnitude: 0 },
                    pageCoordinates: { left: 0, top: 0 }
                });

            };


            function destroyRange() {
            };


            function updatePositionLabel(pos)
            {
                settings.outputLabel.html('\
                    <div>xAxis: ' + pos.axes.xAxis + '</div>\
                    <div>yAxis: ' + pos.axes.yAxis + '</div>\
                    <div>Direction: ' + pos.vector.direction + '</div>\
                    <div>Magnitude: ' + pos.vector.magnitude + '</div>\
                    <div>Left: ' + pos.pageCoordinates.left + '</div>\
                    <div>Top: ' + pos.pageCoordinates.top + '</div>');

                //settings.gameController.setValue($this.id, 'direction', pos.vector.direction);
                //settings.gameController.setValue($this.id, 'magnitude', pos.vector.magnitude);

                updateServer($this.id, pos.axes.xAxis, pos.axes.yAxis, pos.vector.direction, pos.vector.magnitude)

            }

            function updateServer(id, xAxis, yAxis, direction, magnitude) 
            {
                settings.gameController.setThumbStick(id, xAxis, yAxis, direction, magnitude);
                //settings.gameController.updateServer();
                settings.gameController.setUpdatePending();
            }





            // Paramters:
            // touch: accepts the touch event that indicates the requested location of the joystick.

            // Returns an object with the following:
            // axes: the X/Y coordinate values relative to the centre (+32768 to 32768) as xAxis and yAxis
            // vector: returns the  direction in degrees (0-359) as direction, and the magnitude (0 to +32768) of the joystick as magnitude
            // pageCoordinates: returns the top left position of the joystick as it should be rendered on the page.

            function getStickPosition(touch) {


                // Limit the movement of our thumbstick so that it stays within the range.
                var movementRadius = (settings.maxRadius - settings.stickRadius);

                

                // Convert this to scale to -32768 to +32768
                // 32768 was chosen as that's the hid value for the Physical xbox controller in windows.  It may be part of the specification
                // but as this has been written to provide an alternate method of input for that directlym i'm sticking with it.

                var xAxis = convertRange((touch.pageX - centerPosition.left),0-movementRadius, movementRadius, -32768, +32768);
                var yAxis = convertRange((0 - (touch.pageY - centerPosition.top)), 0 - movementRadius, movementRadius, -32768, +32768);



                // Convert the magnitude to 0 to 32768
                var vectorValue = { direction: Math.round(convertCoordinatestoDirection(xAxis, yAxis)), magnitude: Math.round(convertCoordianesToMagnitude(xAxis, yAxis)) };



                if (xAxis > 32768) { xAxis = 32768 };
                if (xAxis < -32768) { xAxis = -32768 };
                if (yAxis > 32768) { yAxis = 32768 };
                if (yAxis < -32768) { yAxis = -32768 };


                var axesValue = {
                    xAxis: Math.round(xAxis),
                    yAxis: Math.round(yAxis),
                };
                





                // Page coordinates
                var coords = getXY(vectorValue)

                /*
                var pageCoordinatesValue = {
                    left: touch.pageX - settings.stickRadius,
                    top: touch.pageY - settings.stickRadius
                };
                */
                var pageCoordinatesValue = {
                    left: Math.round(coords.xAxis+(centerPosition.left-settings.maxRadius)),
                    top: Math.round(coords.yAxis + (centerPosition.top-settings.maxRadius))
                };


                var retVal = {
                    axes: axesValue,
                    vector: vectorValue,
                    pageCoordinates: pageCoordinatesValue
                };

                return retVal;
            }





            function convertCoordinatestoDirection(xAxis, yAxis) {
                // 0 is considered the origin point
                // The range is an integer xAxis and yAxis can deviate from 0

                var radians = Math.atan2(xAxis, yAxis);
                var orientation = (radians * (180 / Math.PI));

                orientation = 0 - orientation;

                // make sure any 360+ angles are pushed back down into range.
                var direction = (360 - orientation) % 360;

                return direction;

            }


            function convertCoordianesToMagnitude(xAxis, yAxis) {

                var MaxRange = 32768;
                var DeadzoneTolerance = 4000;
                var OuterDeadzone = 350;

                var magnitude = Math.sqrt(Math.pow(xAxis, 2) + Math.pow(yAxis, 2));

                if (magnitude < DeadzoneTolerance)
                {
                    magnitude = 0;
                }
                else
                {
                    // Scale so deadzone is removed, and max value is MaxRange
                    magnitude = ((magnitude - DeadzoneTolerance) / (32768 - DeadzoneTolerance)) * (MaxRange + OuterDeadzone);
                    if (magnitude > MaxRange)
                    {
                        magnitude = MaxRange;
                    }
                }

                return magnitude;


            }


            function getXY(vector)
            {
                var radians = DegreesToRadians(vector.direction);

                // Scale the magnitude
                var maxrange = (settings.maxRadius-settings.stickRadius)-2;
                var magnitude = (vector.magnitude / 32768) * (maxrange);


                // Opposite Side
                var sin = Math.sin(radians);



                //double opposite = sin * magnitude;
                var xAxisval = maxrange + (sin * magnitude);

                // Adjacent Side
                var cos = Math.cos(radians);
                //double adjacent = cos * magnitude;
                var yAxisval = maxrange - (cos * magnitude);

                return { xAxis: xAxisval, yAxis: yAxisval };
            }


            function DegreesToRadians(degrees)
            {
                return degrees * (Math.PI / 180.0);
            }

            function convertRange(value, oldRangeMin, oldRangeMax, newRangeMin, NewRangeMax) {
                // Credit to:
                return ((value - oldRangeMin) / (oldRangeMax - oldRangeMin)) * (NewRangeMax - newRangeMin) + newRangeMin
            }

            function moveStick(elem, axes) {
                elem.css({ left: axes.left, top: axes.top });
            }



        });
    };

}(jQuery));
