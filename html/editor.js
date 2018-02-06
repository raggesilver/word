'use strict';

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

class Editor {

    constructor(element = document.getElementsByClassName('editor-container')[0] || null) {

        this.el = element;
        window.currentSelectedText = '';
        window.lastSelectedText = '';
        this.bindEvents();

    }

    /* Core functions */

    apply_bold() {
        document.execCommand('bold', false, false);
    }

    /* End of core functions */

    bindEvents() {

        if (!this.el) return;

        this.el.addEventListener('mouseup', this.onTextSelected, false);
        this.el.addEventListener('keydown', this.onTextSelected, false);

        window.addEventListener('keypress', function(e) {

            if (e.ctrlKey || e.metaKey) {

                switch (String.fromCharCode(e.which).toLowerCase()) {
                    case 'b':

                        break;
                    default:

                }

            }

        }, false);

    }

    onTextSelected(e) {

        if ((e.type == 'keydown' && e.shiftKey && e.which >= 37 && e.which <= 40) || e.type == 'mouseup') {

            window.lastSelectedText = window.currentSelectedText;
            window.currentSelectedText = getSelectedText();

            console.log(window.lastSelectedText);
            console.log(window.currentSelectedText);

            var $box = $('.selection-toolbox');

            if (window.currentSelectedText !== '' && window.currentSelectedText !== window.lastSelectedText) {

                var r = window.getSelection().getRangeAt(0).getBoundingClientRect();

                console.log(r);
                console.log($box.position());

                var left = (r.left - ($box.width() / 2) + (r.width / 2));
                if (left < 10) left = 10;

                $box.css({
                    left: left + 'px',
                    // left: (((r.left + (r.width / 2)) - ($box.width() / 2)) > 20 ? ((r.left + (r.width / 2)) - ($box.width() / 2)) : 20) + 'px',
                    top: (r.top - $box.height() - 30) + 'px'
                });

            } else {

                if (window.currentSelectedText == window.lastSelectedText) window.currentSelectedText = '';
                $box.css({
                    top: '-1000px'
                });

            }

        }

    }

}

/*

var r = window.getSelection().getRangeAt(0).getBoundingClientRect();
*/