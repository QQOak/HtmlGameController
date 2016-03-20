"use strict";

(function ($) {

    $.fn.GameController = function (options) {

        // Credit:
        // http://stackoverflow.com/questions/18185956/calling-a-function-inside-a-jquery-plugin-from-outside

        //settings parameter will our private parameter to our function
        //'myplugin', using jQuery.extend append 'options' to our settings
        var settings = jQuery.extend({
            id: 'gameController1',
            outputLabel: null,
        }, options);

        //Define a reference to our function myplugin which it's 
        //part of jQuery namespace functions, so we can use later
        //within inside functions
        var $jquery = this;

        // Keep track of if we're currently awaiting a response from the server following an ajax Request
        var currentAction = false;
        var values = new Array();


        var controllerValues = new Object();
        controllerValues.id = settings.id;
        //controllerValues.timestamp = Date();

        controllerValues.thumbstickValues = new Array();
        controllerValues.digitalButtonValues = new Array();


        //Define an output object that will work as a reference
        //for our function
        var output = {


            'setValueByObject': function (obj) {
                return output;
            },


            'displayOnPage': function(msg) {
               //settings.outputLabel.html(msg);
            },


            //
            'setThumbStick': function (id, xAxis, yAxis, direction, magnitude) {

                for (var i = 1; i <= controllerValues.thumbstickValues.length; i++) {

                    // Find and remove an item with this ID
                    if (controllerValues.thumbstickValues[i - 1].id == id) {
                        controllerValues.thumbstickValues.splice(i - 1, 1);
                        break;
                    }
                }

                controllerValues.thumbstickValues[controllerValues.thumbstickValues.length] = {
                    id: id,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    direction: direction,
                    magnitude: magnitude
                }

                return output;
            },


            'setDigitalButton': function (id, state) {

                return output;
            },


            //Setup our plugin functions as an object elements
            /*
            'setValue': function (elementId, attrib, value) {

                for (var i=1; i <= values.length; i++)
                {
                    // see if the we already have an element with this name and 
                    if ((values[i-1].elementId == elementId)
                        && (values[i-1].attribute == attrib))
                    {
                        //alert('removing:' + elementId + ':' + attrib)
                        values.splice(i - 1, 1);
                    }
                }

                // now add
                //alert('adding');
                values[values.length] = {
                    elementId: elementId,
                    attribute: attrib,
                    value: value
                }

                var msg = '';
                for (var i = 0; i < values.length; i++)
                {
                    var obj = values[i]
                    msg += '<div style="padding: 20px;">';
                    msg += '<div>ElementId: ' + obj.elementId + '</div>';
                    msg += '<div>Attribute: ' + obj.attribute + '</div>';
                    msg += '<div>Value: ' + obj.value + '</div>';
                    msg += '</div>';
                }

                output.displayOnPage(msg);



                // Enable chaining
                return output;
            },
            */

            'CsDate': function (csDate) {
                return new Date(parseInt(csDate.substr(6)));
            },


            'updateServer': function () {

                if (!currentAction) {
                    output.UpdateServer2(JSON.stringify(controllerValues));
                };
            },

            'UpdateServer2': function (JSONData) {

                
                currentAction = true;

                // Display What We're sending to the server
                //alert(JSON.stringify(controllerValues));

                $.ajax({
                    type: 'POST',
                    url: 'Gamepad.ashx',
                    contentType: "Application/json; charset=utf-8",
                    dataType: "json",
                    data: JSONData,
                    success: function (data) {

                        //settings.outputLabel.html("<div>timestamp: " + output.CsDate(data.timestamp) + "</div><div>id: " + data.id + "</div>");
                        settings.outputLabel.html("<div>"+JSON.stringify(data)+"</div>");
                        currentAction = false;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('Failed\n\n' + textStatus + '\n\n' + errorThrown);
                    }
                });


                return output;
            },

        };

        //And the final critical step, return our object output to the plugin
        return output;

    };
    //Pass the jQuery class so we can use it inside our plugin 'class'

})(jQuery);
