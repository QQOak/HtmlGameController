"use strict";

const MovementRangeShapes = {
    CIRCLE: 'circle',
    SQUARE: 'square'
};

(function ($) {
    
    $.fn.ThumbStick = function (options) {
        return this.each(function () {
    
            var settings = $.extend({
                xAxisLabel: null,
                yAxisLabel: null,
                showMovementLimit: true,
                movementLimitRadius: 100,
                hatRadius: 50,
                hatFillColor: '#7596bf',
                hatBorderWidth: 7,
                hatBorderColor: '#7596bf',
            }, options);

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

            function init(gamePageArea)
            {
                var rect = gamePageArea.getBoundingClientRect();
                showPosition(rect.left, rect.top);
            }


            function GetXY(maxMagnitude, movementRangeShape)
            {
                switch (movementRangeShapoe) {
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

            function drawMovementLimit(joystickContainer, touchLocation, radius)
            {
                var cont = createNewCanvas(joystickContainer, radius * 2, radius * 2);
                moveCanvasByCenter(cont, touchLocation, radius);
                var canvasContext = cont.getContext("2d");
                drawCircle(canvasContext, radius);
            }

            function moveCanvasByCenter(elem, touchLocation)
            {
                var rect = elem.getBoundingClientRect();
                elem.style.left = touchLocation.x - (rect.width / 2) + 'px';
                elem.style.top = touchLocation.y - (rect.height / 2) + 'px';
            }

            function showPosition(xPos, yPos)
            {
                if(settings.xAxisLabel) settings.xAxisLabel.text(xPos);
                if(settings.yAxisLabel) settings.yAxisLabel.text(yPos);
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

            //init(this);


            function createHat(parent, touchLocation)
            {
                var canvasWidth = (settings.hatRadius * 2) + (settings.hatBorderWidth * 2);
                var canvasHeight = canvasWidth;
                canvas = createNewCanvas(joystickContainer, canvasWidth, canvasHeight);

                moveCanvasByCenter(canvas, touchLocation);
                var canvasContext = canvas.getContext("2d");
                drawFilledCircle(canvasContext, settings.hatRadius, settings.hatBorderWidth, settings.hatBorderColor, settings.hatFillColor);
            }

            $(this).on('pointerdown', function (e)
            {
                e.preventDefault();
                if(e.pointerType === 'touch' && joystickContainer == null)
                {
                    this.pointerId = e.pointerId;
                    var touchLocation = getTouchLocation(e);
                    initialTouchLocation = touchLocation;
                    
                    joystickContainer = createJoystickContainer(this)

                    if(settings.showMovementLimit) drawMovementLimit(joystickContainer, touchLocation, settings.movementLimitRadius);

                    createHat(joystickContainer, touchLocation);
                };
            });


            $(this).on('pointermove', function(e)
            {
                if (e.pointerId == this.pointerId)
                {
                    var touchLocation = getTouchLocation(e);
                    moveCanvasByCenter(canvas, touchLocation);
                    showPosition(e.clientX, e.clientY);
                }
            });

            $(this).on('pointerup', function(e)
            {
                if (e.pointerId == this.pointerId)
                {
                    showPosition(-1, -1);
                    joystickContainer.remove();
                    joystickContainer = null;
                }
            });



        });
    };

}(jQuery));


