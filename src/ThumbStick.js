"use strict";

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
                hatBorderColor: '#7596bf'
            }, options);

            var initialTouchLocation = {
                x: -1,
                y: -1
            };

            var movementRange = 100;
            var canvas = null;
            var joystickContainer = null;
            var canvasPointerId = 0;

            var joystickPointerId = -1;
            var joystickContainer = null;


            function init(gamePageArea)
            {
                var rect = gamePageArea.getBoundingClientRect();
                showPosition(rect.left, rect.top);
            }


            function GetXY(maxMagnitude, movementRange)
            {
                switch (movementRange) {
                    case MovementRanges.CIRCULAR:
                        break;

                    case MovementRanges.CIRCULAR:
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

            function drawMovementLimit(joystickContainer, xpos, ypos, radius)
            {
                var cont = createNewCanvas(joystickContainer, radius * 2, radius * 2);
                moveCanvas(cont, xpos, ypos, radius);
                var canvasContext = cont.getContext("2d");
                drawCircle(canvasContext, radius);
            }

            function moveCanvas(elem, xpos, ypos, radius)
            {
                var left = (xpos - radius);
                elem.style.left = left + 'px';

                var top = (ypos - radius);
                elem.style.top = top + 'px';
            }

            function showPosition(xPos, yPos)
            {
                if(settings.xAxisLabel) settings.xAxisLabel.text(xPos);
                if(settings.yAxisLabel) settings.yAxisLabel.text(yPos);
            }
    
            function drawCircle(ctx, radius)
            {   
                var centerX = radius;
                var centerY = radius;
                var startAngle = 0; // Radians
                var endAngle = 2 * Math.PI; // Radians

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                ctx.stroke(); 
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

            init(this);

            $(this).on('pointerdown', function (e)
            {
                e.preventDefault();
                if(e.pointerType === 'touch' && joystickContainer == null)
                {
                    canvasPointerId = e.pointerId;
                    initialTouchLocation.x = e.clientX;
                    initialTouchLocation.y = e.clientY;
                    
                    joystickContainer = createJoystickContainer(this)
                    if(settings.showMovementLimit) drawMovementLimit(joystickContainer, e.clientX - settings.hatBorderWidth, e.clientY - settings.hatBorderWidth, settings.movementLimitRadius);

                    // Create hat
                    var canvasWidth = (settings.hatRadius * 2) + (settings.hatBorderWidth * 2);
                    var canvasHeight = canvasWidth;
                    canvas = createNewCanvas(joystickContainer, canvasWidth, canvasHeight);
                    moveCanvas(canvas, e.clientX - settings.hatBorderWidth, e.clientY - settings.hatBorderWidth, settings.hatRadius);
                    showPosition(e.clientX, e.clientY);
                    var canvasContext = canvas.getContext("2d");
                    drawFilledCircle(canvasContext, settings.hatRadius, settings.hatBorderWidth, settings.hatBorderColor, settings.hatFillColor);
                };
            });


            $(this).on('pointermove', function(e)
            {
                if (e.pointerId == canvasPointerId)
                {
                    moveCanvas(canvas, e.clientX - settings.hatBorderWidth, e.clientY - settings.hatBorderWidth, settings.hatRadius);
                    showPosition(e.clientX, e.clientY);
                }
            });

            $(this).on('pointerup', function(e)
            {
                if (e.pointerId == canvasPointerId)
                {
                    showPosition(-1, -1);
                    joystickContainer.remove();
                    joystickContainer = null;
                }
            });



        });
    };

}(jQuery));

    
    
const MovementRanges = {
    CIRCULAR: 'circular',
    SQUARE: 'square'
}




