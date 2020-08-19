"use strict";

const MovementRangeShapes = {
    CIRCLE: 'circle',
    SQUARE: 'square'
};

(function ($) {

    $.fn.ThumbStick = function (options) {
        return this.each(function () {
    
            var settings = $.extend(true, {}, $.fn.ThumbStick.defaults, options);

            var initialTouchLocation = {
                x: -1,
                y: -1
            };

            var joystickContainer = null;
            var canvas = null;
            var pointerId = 0;

            var joystickPointerId = -1;
            var joystickContainer = null;

            function getTouchLocation(e)
            {
                return {
                    x: e.clientX,
                    y: e.clientY
                }
            }

            function GetXY(maxMagnitude, movementRangeShape)
            {
                switch (movementRangeShape) {
                    case MovementRangeShapes.CIRCLE:
                        break;

                    case MovementRangeShapes.SQUARE:
                        break;
                }
            }

            function createJoystickContainer(parentElement)
            {
                var newJoystickContainer = document.createElement("div");
                parentElement.append(newJoystickContainer);
                return newJoystickContainer;
            }

            function createNewCanvas(parentElement, width, height)
            {
                var newCanvas = document.createElement("canvas");
                parentElement.append(newCanvas);

                newCanvas.style.position = 'absolute';
                newCanvas.style.display = 'block';
                newCanvas.width = width;
                newCanvas.height = height;

                return newCanvas;
            }

            function drawMovementLimit(joystickContainer, touchLocation)
            {
                switch(settings.movementRangeShape)
                {
                    case (MovementRangeShapes.CIRCLE):
                        drawCircularMovementLimit(joystickContainer, touchLocation);
                        break;

                    case (MovementRangeShapes.SQUARE):
                        drawSquareMovementLimit(joystickContainer, touchLocation);
                        break;
                }

            }

            function drawCircularMovementLimit(joystickContainer, touchLocation)
            {
                var canvasWidth = (settings.movementLimitRadius * 2) + (settings.movementLimitBorderWidth * 2);
                var canvasHeight = canvasWidth;
                var cont = createNewCanvas(joystickContainer, canvasWidth, canvasHeight);
                moveCanvasByCenter(cont, touchLocation);
                var canvasContext = cont.getContext("2d");
                drawFilledCircle(canvasContext, settings.movementLimitRadius, settings.movementLimitBorderWidth, settings.movementLimitBorderColor, settings.movementLimitFillColor);
            }

            function drawSquareMovementLimit(joystickContainer, touchLocation)
            {
                var canvasWidth = (settings.movementLimitRadius * 2) + (settings.movementLimitBorderWidth * 2);
                var canvasHeight = canvasWidth;
                var cont = createNewCanvas(joystickContainer, canvasWidth, canvasHeight);
                moveCanvasByCenter(cont, touchLocation);
                var ctx = cont.getContext("2d");

                ctx.beginPath();
                ctx.rect(0, 0, canvasWidth, canvasHeight);
                ctx.fillStyle = settings.movementLimitFillColor;
                ctx.fill();
                ctx.lineWidth = settings.movementLimitBorderWidth;
                ctx.strokeStyle = settings.movementLimitBorderColor;
                ctx.stroke(); 
            }

            function drawHat(parent, touchLocation)
            {
                var canvasWidth = (settings.hatRadius * 2) + (settings.hatBorderWidth * 2);
                var canvasHeight = canvasWidth;
                canvas = createNewCanvas(joystickContainer, canvasWidth, canvasHeight);

                moveCanvasByCenter(canvas, touchLocation);
                var canvasContext = canvas.getContext("2d");
                drawFilledCircle(canvasContext, settings.hatRadius, settings.hatBorderWidth, settings.hatBorderColor, settings.hatFillColor);
            }

            function moveCanvasByCenter(elem, touchLocation)
            {
                var rect = elem.getBoundingClientRect();
                elem.style.left = touchLocation.x - (rect.width / 2) + 'px';
                elem.style.top = touchLocation.y - (rect.height / 2) + 'px';
            }

            function drawFilledCircle(ctx, radius, borderWidth, borderColor, fillColor)
            {   
                var centerX = radius + borderWidth;
                var centerY = radius + borderWidth;
                var startAngle = 0; // Radians
                var endAngle = 2 * Math.PI; // Radians

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                ctx.fillStyle = fillColor;
                ctx.fill();
                ctx.lineWidth = borderWidth;
                ctx.strokeStyle = borderColor;
                ctx.stroke(); 
            }

            function drawCircle(ctx, radius)
            {   
                drawFilledCircle(ctx, radius, 1, 'black', 'rgba(0, 0, 0, 0');
            }

            function limitRange(val, abs)
            {
                return val < 0-abs ? 0-abs : (val > abs ? abs : val);
            }

            function limitMagnitude(val, max)
            {
                return val < max ? val : max;
            }

            function getHatDeflection(initialTouchLocation, currentTouchLocation) 
            {
                var x = currentTouchLocation.x - initialTouchLocation.x;
                var y = currentTouchLocation.y - initialTouchLocation.y;

                switch(settings.movementRangeShape)
                {
                    case(MovementRangeShapes.SQUARE):
                        x = limitRange(x, settings.movementLimitRadius);
                        y = limitRange(y, settings.movementLimitRadius);
                        break;

                    case(MovementRangeShapes.CIRCLE):
                        var theta = Math.atan2(y, x);
                        var magnitude = Math.hypot(Math.abs(x), Math.abs(y));
                        magnitude = limitMagnitude(magnitude, settings.movementLimitRadius);

                        x = Math.cos(theta) * magnitude;
                        y = Math.sin(theta) * magnitude;
                        break;
                }

                return { x: x, y: y };
            }

            function getNewHatPosition(initialHatPosition, deflection)
            {
                var x = initialTouchLocation.x + deflection.x;
                var y = initialTouchLocation.y + deflection.y;

                return { x: x, y: y };
            }

            $(this).on('pointerdown', function (e)
            {
                e.preventDefault();
                if(e.pointerType === 'touch' && joystickContainer == null)
                {
                    this.pointerId = e.pointerId;
                    var touchLocation = getTouchLocation(e);
                    initialTouchLocation = touchLocation;
                    
                    joystickContainer = createJoystickContainer(this);

                    if(settings.showMovementLimit) drawMovementLimit(joystickContainer, touchLocation);
                    drawHat(joystickContainer, touchLocation);

                    var zeroInitialDeflection = {x: 0, y: 0};
                    settings.onStart.call();
                };
            });

            function InvertAxis(val)
            {
                return -val;
            }

            function scaleToRange(value, sourceRange, targetRange)
            {
                var scaleFactor = (value - sourceRange.min) / (sourceRange.max - sourceRange.min);
                return scaleFactor * ( targetRange.max - targetRange.min) + targetRange.min;
            }

            function convertHatmovementToOutputValues(movementAmount, sourceRange, targetRange)
            {
                var x = scaleToRange(movementAmount.x, sourceRange, targetRange);
                var y = scaleToRange(InvertAxis(movementAmount.y), sourceRange, targetRange);
                return { x:x, y:y };
            }

            $(this).on('pointermove', function(e)
            {
                if (e.pointerId == this.pointerId)
                {
                    var touchLocation = getTouchLocation(e);
                    var movementAmount = getHatDeflection(initialTouchLocation, touchLocation);
                    var newHatPosition = getNewHatPosition(initialTouchLocation, movementAmount);
                    
                    moveCanvasByCenter(canvas, newHatPosition);

                    var sourceRange = { min: -settings.movementLimitRadius, max: settings.movementLimitRadius };
                    var values = convertHatmovementToOutputValues(movementAmount, sourceRange, settings.outputRange);
                    settings.onMove.call(values);
                }
            });

            $(this).on('pointerup', function(e)
            {
                if (e.pointerId == this.pointerId)
                {
                    joystickContainer.remove();
                    joystickContainer = null;
                    settings.onEnd.call();
                }
            });



        });
    };

    $.fn.ThumbStick.defaults = {
        hatRadius: 50,
        hatFillColor: '#7596bf',
        hatBorderWidth: 7,
        hatBorderColor: '#7596bf',
        showMovementLimit: true,
        movementRangeShape: MovementRangeShapes.CIRCLE,
        movementLimitRadius: 100,
        movementLimitBorderWidth: 2,
        movementLimitBorderColor: '#333333',
        movementLimitFillColor: 'rgba(0, 0, 0, 0)',
        outputRange: { min: -1, max: 1 },
        onTouchStart: function() {},
        onMove : function() {},
        onTouchEnd : function() {}
    };

}(jQuery));


