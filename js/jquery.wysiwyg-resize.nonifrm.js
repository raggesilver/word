/* 
* WYSIWYG Resize (http://editorboost.net/WYSIWYGResize)
* Copyright 2012 Editorboost. All rights reserved. 
*
* Webkitresize commercial licenses may be obtained at http://editorboost.net/home/licenses.
* If you do not own a commercial license, this file shall be governed by the
* GNU General Public License (GPL) version 3. For GPL requirements, please
* review: http://www.gnu.org/copyleft/gpl.html
*
* Version date: March 19 2013
* REQUIRES: jquery 1.7.1+
*/

; (function ($) {
    $.fn.wysiwygResize = function (options) {
        return this.each(function () {
            var settings = $.extend({
                selector: "div, span"
            }, options);

            var lastCrc;
            var elementResizeinProgress = false;
            var currentElement;

            var methods = {
                getNextHighestZindex: function (obj){  
                   var highestIndex = 0;  
                   var currentIndex = 0;  
                   var elArray = Array();  
                   if(obj){ elArray = obj.getElementsByTagName('*'); }else{ elArray = document.getElementsByTagName('*'); }  
                   for(var i=0; i < elArray.length; i++){  
                      if (elArray[i].currentStyle){  
                         currentIndex = parseFloat(elArray[i].currentStyle['zIndex']);  
                      }else if(window.getComputedStyle){  
                         currentIndex = parseFloat(document.defaultView.getComputedStyle(elArray[i],null).getPropertyValue('z-index'));  
                      }  
                      if(!isNaN(currentIndex) && currentIndex > highestIndex){ highestIndex = currentIndex; }  
                   }  
                   return(highestIndex+1);  
                },

                removeResizeElements: function (context) {
                    $(".wysiwygResize-selector").remove();
                    $(".wysiwygResize-region").remove();
                },

                drawResizeElements: function(context, element, elementHeight, elementWidth, elementPosition){
                    context.$docBody.append("<span class='wysiwygResize-selector' style='z-index:" + methods.getNextHighestZindex(context.container) + ";margin:10px;position:absolute;top:" + (elementPosition.top + elementHeight - 10) + "px;left:" + (elementPosition.left + elementWidth - 10) + "px;border:solid 2px red;width:6px;height:6px;cursor:se-resize;background-color:red;opacity: 0.60;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=60)\";filter: alpha(opacity=60);-moz-opacity: 0.6;'></span>");

                    context.$docBody.append("<span class='wysiwygResize-region wysiwygResize-region-top-right' style='position:absolute;top:" + elementPosition.top + "px;left:" + elementPosition.left + "px;border:dashed 1px grey;background-color: #EBEBE9;width:" + elementWidth + "px;height:0px;'></span>");
                    context.$docBody.append("<span class='wysiwygResize-region wysiwygResize-region-top-down' style='position:absolute;top:" + elementPosition.top + "px;left:" + elementPosition.left + "px;border:dashed 1px grey;background-color: #EBEBE9;width:0px;height:" + elementHeight + "px;'></span>");

                    context.$docBody.append("<span class='wysiwygResize-region wysiwygResize-region-right-down' style='position:absolute;top:" + elementPosition.top + "px;left:" + (elementPosition.left + elementWidth) + "px;border:dashed 1px grey;background-color: #EBEBE9;width:0px;height:" + elementHeight + "px;'></span>");
                    context.$docBody.append("<span class='wysiwygResize-region wysiwygResize-region-down-left' style='position:absolute;top:" + (elementPosition.top + elementHeight) + "px;left:" + elementPosition.left + "px;border:dashed 1px grey;background-color: #EBEBE9;width:" + elementWidth + "px;height:0px;'></span>");                    
                },

                elementClick: function (context, element) {
                    if ($.browser.msie && !$(element).is("td") && $(element).attr("style") && ($(element).attr("style").toLowerCase().indexOf("height") != -1 || $(element).attr("style").toLowerCase().indexOf("width") != -1)) {
                        return;
                    }
                    if (settings.beforeElementSelect) {
                        settings.beforeElementSelect(element);
                    }

                    methods.removeResizeElements();
                    currentElement = element;

                    var elementHeight = $(element).outerHeight();
                    var elementWidth = $(element).outerWidth();
                    var elementPosition = $(element).offset();

                    methods.drawResizeElements(context, element, elementHeight, elementWidth, elementPosition);

                    var dragStop = function () {
                        if (elementResizeinProgress) {
                            $(currentElement)
                                .css("width", $(".wysiwygResize-region-top-right").width() + "px")
                                .css('height', $(".wysiwygResize-region-top-down").height() + "px");
                            methods.refresh(context);
                            var ce = currentElement;
                            $container.trigger('webkitresize-updatecrc', [methods.crc(context.$container.html())]);                            
                            elementResizeinProgress = false;
                            methods.reset(context);
                            methods.elementClick(context, ce);

                            if (settings.afterResize) {
                                settings.afterResize(currentElement);
                            }
                        }
                    };

                    var windowMouseMove = function (e) {
                        if (elementResizeinProgress) {                                                    
                            var resWidth = elementWidth;
                            var resHeight = elementHeight;

                            resHeight = e.pageY - elementPosition.top;
                            resWidth = e.pageX - elementPosition.left;

                            if (resHeight < 1) {
                                resHeight = 1;
                            }
                            if (resWidth < 1) {
                                resWidth = 1;
                            }

                            $(".wysiwygResize-selector").focus().css("top", (elementPosition.top + resHeight - 10) + 'px').css("left", (elementPosition.left + resWidth - 10) + "px");
                            $(".wysiwygResize-region-top-right").css("width", resWidth + "px");
                            $(".wysiwygResize-region-top-down").css("height", resHeight + "px");

                            $(".wysiwygResize-region-right-down").css("left", (elementPosition.left + resWidth) + "px").css("height", resHeight + "px");
                            $(".wysiwygResize-region-down-left").css("top", (elementPosition.top + resHeight) + "px").css("width", resWidth + "px");
                        }

                        return false;
                    };

                    $(".wysiwygResize-selector").mousedown(function (e) {
                        if (settings.beforeResizeStart) {
                            settings.beforeResizeStart(currentElement);
                        }
                        elementResizeinProgress = true;
                        return false;
                    });

                    $(window.document).mouseup(function () {
                        if (elementResizeinProgress) {
                            dragStop();
                        }
                    });

                    $(window.document).mousemove(function (e) {
                        windowMouseMove(e);
                    });

                    if (settings.afterElementSelect) {
                        settings.afterElementSelect(currentElement);
                    }
                },

                rebind: function (context) {
                    context.$container.find(settings.selector).each(function (i, v) {
                        $(v).unbind('click');
                        $(v).click(function (e) {
                            if (e.target == v) {
                                methods.elementClick(context, v);
                            }
                        });
                    });
                },

                refresh: function (context) {
                    methods.rebind(context);

                    methods.removeResizeElements();

                    if (!currentElement) {
                        if (settings.afterRefresh) {
                            settings.afterRefresh(null);
                        }
                        return;
                    }

                    var element = currentElement;

                    var elementHeight = $(element).outerHeight();
                    var elementWidth = $(element).outerWidth();
                    var elementPosition = $(element).offset();

                    methods.drawResizeElements(context, element, elementHeight, elementWidth, elementPosition);

                    lastCrc = methods.crc(context.$container.html());

                    if (settings.afterRefresh) {
                        settings.afterRefresh(currentElement);
                    }
                },

                reset: function (context) {
                    if(currentElement!=null){
                        currentElement = null;
                        elementResizeinProgress = false;
                        methods.removeResizeElements();

                        if (settings.afterReset) {
                            settings.afterReset();
                        }
                    }

                    methods.rebind(context);
                },

                crc: function (str) {
                    var hash = 0;
                    if (str == null || str.length == 0) return hash;
                    for (i = 0; i < str.length; i++) {
                        char = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    return hash;
                }
            };

            var container = this;
            var $docBody = $("body");
            var $container = $(container);

            lastCrc = methods.crc($container.html());

            var context = {
                container: container,
                $container: $container,
                $docBody: $docBody
            };

            if(container.addEventListener){
                container.addEventListener('scroll', function () {
                    methods.reset(context);
                }, false);
            }
            else if(container.attachEvent){
                container.attachEvent('onscroll', function () {
                    methods.reset(context);
                });
            }

            $(document).mouseup(function (e) {
                if(!elementResizeinProgress){
                    var x = (e.x) ? e.x : e.clientX;
                    var y = (e.y) ? e.y : e.clientY;
                    var mouseUpElement = document.elementFromPoint(x, y);
                    if (mouseUpElement) {
                        var matchingElement;                   
                        var $select = context.$container.find(settings.selector);
                        var $parentsSelect = $(mouseUpElement).parents();
                        for (var psi = 0; psi < $parentsSelect.length; psi++) {
                            for (var i = 0; i < $select.length; i++) {
                                if($select[i] == $parentsSelect[psi]){
                                    matchingElement = $select[i]; 
                                    break;
                                }
                            }
                            if(matchingElement){
                                break;
                            }
                        } 
                        if (!matchingElement) {
                            methods.reset(context);
                        }
                        else{                            
                            methods.elementClick(context, matchingElement);
                        }
                    }
                }
            });

            $(document).keyup(function (e) {
                if (e.keyCode == 27) {
                    methods.reset(context);
                }
            });

            if(!container.crcChecker){
                container.crcChecker = setInterval(function () {
                                            var currentCrc = methods.crc($container.html());
                                            if(lastCrc != currentCrc){
                                                $container.trigger('webkitresize-crcchanged', [currentCrc]);
                                            }
                                        }, 1000);
            }

            $(window).resize(function(){
                methods.reset(context);
            });

            $container.bind('webkitresize-crcchanged', function (event, crc) {
                lastCrc = crc;
                methods.reset(context);
            });

            $container.bind('webkitresize-updatecrc', function (event, crc) {
                lastCrc = crc;
            });

            methods.refresh(context);

        });
    };
})(jQuery);