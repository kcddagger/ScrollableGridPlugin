// Version 1.0
'use strict';

(function ($) {
    $.fn.Scrollable = function (options) {
        var defaults = {
            ScrollHeight: 500,
            BorderWidth: 1,
            arg: null,
            mpeBID: null
        };
        var options = $.extend(defaults, options);
        return this.each(function () {
            var grid = $(this).get(0);
            var gridId = grid.id;
            if ($(this).is(':visible')) {
                MakeScrollablePlugin(grid, options);
            }
        });
    };
})(jQuery);
function MakeScrollablePlugin(grid, options) {
    var ScrollHeight = options.ScrollHeight;
    var borderWidth = options.BorderWidth;
    var border = 0;
    if (isNumber(borderWidth)) {
        border = borderWidth * 2;
    }
    if (grid) {
        if (document.getElementById(grid.id + '_ScrollableDiv') == null) {
            var gridWidth = grid.offsetWidth;
            var totalWidth = 0;
            var gridHeight = grid.offsetHeight;
            var headerCellWidths = new Array();
            for (var i = 0; i < grid.getElementsByTagName("TH").length; i++) {
                headerCellWidths[i] = grid.getElementsByTagName("TH")[i].offsetWidth;
            }
            grid.parentNode.appendChild(document.createElement("div"));
            var parentDiv = grid.parentNode;
            var table = document.createElement("table");
            for (i = 0; i < grid.attributes.length; i++) {
                if (grid.attributes[i].specified && grid.attributes[i].name != "id") {
                    table.setAttribute(grid.attributes[i].name, grid.attributes[i].value);
                }
            }
            table.style.cssText = grid.style.cssText;
            table.style.width = gridWidth + "px";
            table.appendChild(document.createElement("tbody"));
            table.getElementsByTagName("tbody")[0].appendChild(grid.getElementsByTagName("TR")[0]);
            var cells = table.getElementsByTagName("TH");
            var gridRow = grid.getElementsByTagName("TR")[0];
            for (var i = 0; i < cells.length; i++) {
                var width;
                width = headerCellWidths[i];
                totalWidth += headerCellWidths[i];
                cells[i].style.width = parseInt(width - 3) + "px";
                if (grid.rows.length > 0 && grid.innerHTML.indexOf("No records found.") == -1) {
                    gridRow.getElementsByTagName("TD")[i].style.width = parseInt(width - 3) + "px";
                }
            }

            parentDiv.removeChild(grid);

            grid.style.tableLayout = "fixed";
            table.style.tableLayout = "fixed";

            var dummyHeader = document.createElement("div");

            dummyHeader.appendChild(table);

            parentDiv.appendChild(dummyHeader);

            var scrollableDiv = document.createElement("div");
            scrollableDiv.id = grid.id + '_ScrollableDiv';
            var $oldDiv = $('#' + grid.id + '_scrollable');
            if ($oldDiv.length > 0) {
                $oldDiv.removeClass();
                $oldDiv.removeAttr('style');
                $('#' + grid.id + '_loading').hide();
            }
            var scrollBar = true;

            scrollableDiv.appendChild(grid);
            parentDiv.appendChild(scrollableDiv);
            if (scrollableDiv.offsetHeight > ScrollHeight) {
                totalWidth = totalWidth + 17 + border;
                scrollBar = true;
            } else {
                totalWidth = totalWidth + border;
                scrollBar = false;
            }
            if (gridWidth < totalWidth) {
                gridWidth = totalWidth;
            }
            if (grid.offsetWidth > gridWidth) {
                gridWidth = grid.offsetWidth;
            }
            var tableDiv = parentDiv.parentElement.parentElement;
            if (tableDiv.children.length > 1) {
                var buttonDiv = tableDiv.children[1];
            }
            var lastDiff = -100;
            var currDiff = -100;
            while (true) {
                scrollableDiv.style.cssText = "overflow:auto;height:" + ScrollHeight + "px;width:" + gridWidth + "px;";
                dummyHeader.style.cssText = "width:" + gridWidth + "px; background-color: #0033FF; color: white;";
                parentDiv.style.cssText = "border-width: 1px; border-style: solid; border-color: #0033FF; width:" + gridWidth + "px;";
                if (buttonDiv) {
                    if (buttonDiv.className == 'DivButtonCenter') {
                        var tableWidth = tableDiv.offsetWidth;
                        if (tableWidth < gridWidth) {
                            buttonDiv.style.width = tableWidth + 'px';
                        } else {
                            buttonDiv.style.width = gridWidth + 'px';
                        }
                    }
                }
                if (scrollBar) {
                    if (scrollableDiv.offsetWidth >= scrollableDiv.scrollWidth + 17) {
                        break;
                    } else {
                        currDiff = scrollableDiv.offsetWidth - scrollableDiv.scrollWidth;
                        if (currDiff != lastDiff) {
                            gridWidth += 1;
                            lastDiff = currDiff;
                        } else {
                            break;
                        }
                    }
                } else {
                    if (scrollableDiv.offsetWidth >= scrollableDiv.scrollWidth) {
                        break;
                    } else {
                        currDiff = scrollableDiv.offsetWidth - scrollableDiv.scrollWidth;
                        if (currDiff != lastDiff) {
                            gridWidth += 1;
                            lastDiff = currDiff;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
}
function isNumber(o) {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

