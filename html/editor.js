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

		document.execCommand("defaultParagraphSeparator", false, "p");

        this.bindEvents();

    }

    /* Core functions */

    apply_bold() {
        document.execCommand('bold', false, false);
    }

	apply_italic() {
		document.execCommand('italic', false, false);
	}

	apply_underline() {
		document.execCommand('underline', false, false);
	}

	apply_header(header = 'p') {
		document.execCommand('formatBlock', false, header);
	}

	apply_alignment(alignment = 'Full') {
		document.execCommand('justify' + alignment, false, false);
	}

    /* End of core functions */

    bindEvents() {

		var that = this;

        if (!this.el) return;

        this.el.addEventListener('mouseup', this.onTextSelected, false);
        this.el.addEventListener('keydown', this.onTextSelected, false);

		$(document).on('click', '.editor-align-left', function() {
			that.apply_alignment('Left');
		});

		$(document).on('click', '.editor-align-center', function() {
			that.apply_alignment('Center');
		});

		$(document).on('click', '.editor-align-right', function() {
			that.apply_alignment('Right');
		});

		$(document).on('click', '.editor-align-justify', function() {
			that.apply_alignment('Full');
		});

		$(document).on('click', 'button[class^=editor-format-]', function(){

			var $btn = $(this);

			$btn.attr('class').split(/\s+/).forEach(function(el, i) {
				if($btn.attr('class').split(/\s+/)[i].indexOf('editor-format-') != -1) {
					that.apply_header($btn.attr('class').split(/\s+/)[i].replace('editor-format-', ''));
				}
			});

			$btn.siblings('button[class^=editor-format-]').removeClass('selected');
			$btn.addClass('selected');

		});

		$(document).on('focus', '.editor-container .page', function(e) {

			// if($(this).html().trim() == '') {
			// 	$(this).append('<p></p>');
			// 	$(this).find('p').focus();
			// }

		});

        $(window).on('keypress', function(e) {

            if (e.ctrlKey || e.metaKey) {

				e.preventDefault();

				console.log('DON JUANITO');
				console.log(e.which);
				console.log(String.fromCharCode(e.which).toLowerCase());

				// console.log('kasdmlaksdmlasmd');
                //
                // switch (String.fromCharCode(e.which).toLowerCase()) {
                //     case 'b':
				// 		console.log(this);
				// 		this.apply_bold();
                //         break;
				// 	case 'i':
				// 		this.apply_italic();
				// 		break;
				// 	case 'u':
				// 		this.apply_underline();
				// 		break;
                // }
                //
				// console.log(this);
                //
				switch (e.which - 16) {
					case 1:
					case 2:
					case 3:
						that.apply_header('h' + (e.which - 16));
						break;
					case 0:
						that.apply_header();
						break;
				}

            }

        });

    }

    onTextSelected(e) {

        if ((e.type == 'keydown' && e.shiftKey && e.which >= 37 && e.which <= 40) || e.type == 'mouseup' || e === 'ctrla') {

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

        } else{

			$('.selection-toolbox').css({
				top: '-1000px'
			});

		}

    }

}

/*

var r = window.getSelection().getRangeAt(0).getBoundingClientRect();
*/
