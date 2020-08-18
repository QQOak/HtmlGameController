"use strict";

(function ($) {
    
    $.fn.ThumbStick = function (options) {
        return this.each(function () {
    
            var settings = $.extend({
                xAxisLabel: null,
                yAxisLabel: null
            }, options);


            var buttonRadius = 50;
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


            function createNewCanvas(parentElement, pointerId)
            {
                var newCanvas = document.createElement("canvas");
                parentElement.append(newCanvas);

                newCanvas.id = "canvas" + pointerId;
                newCanvas.style.position = 'absolute';
                newCanvas.style.display = 'block';

                return newCanvas;
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

            function createJoystickContainer(parentElement)
            {
                var newJoystickContainer = document.createElement("div");
                parentElement.append(newJoystickContainer);
                return newJoystickContainer;
            }

            function createJoystick(parentElemment)
            {
            }

            init(this);


            $(this).on('pointerdown', function (e)
            {
                e.preventDefault();
                if(e.pointerType === 'touch' && canvas == null)
                {
                    
                    canvasPointerId = e.pointerId;
                    joystickContainer = createJoystickContainer(this)
                    canvas = createNewCanvas(joystickContainer, e.pointerId);

                    moveCanvas(canvas, e.clientX, e.clientY, buttonRadius);
                    showPosition(e.clientX, e.clientY);

                    var canvasContext = canvas.getContext("2d");
                    drawCircle(canvasContext, buttonRadius);
                };
            });


            $(this).on('pointermove', function(e)
            {
                if (e.pointerId == canvasPointerId)
                {
                    moveCanvas(canvas, e.clientX, e.clientY, buttonRadius);
                    showPosition(e.clientX, e.clientY);
                }
            });

            $(this).on('pointerup', function(e)
            {
                $('#PointerId2').text(e.pointerId);
                if (e.pointerId == canvasPointerId)
                {
                    showPosition(-1, -1);
                    canvas.remove();
                    canvas = null;
                }
            });



        });
    };

}(jQuery));

    
    
const MovementRanges = {
    CIRCULAR: 'circular',
    SQUARE: 'square'
}




