;(function ($) {
    'use strict';

    /**
     * Shopware Lightbox Plugin.
     *
     * This plugin is based on the modal plugin.
     * It opens images in a modal window and sets the width and height
     * of the modal box automatically to the image size. If the image
     * size is bigger than the window size, the modal will be set to
     * 90% of the window size so there is little margin between the modal
     * and the window edge. It calculates always the correct aspect.
     *
     * Usage:
     * $.lightbox.open('http://url.to.my.image.de');
     *
     */
    $.lightbox = {

        modal: false,

        open: function(imageURL) {
            var me = this, size;

            me.image =  new Image();
            me.content = me.createContent(imageURL);

            me.image.onload = function() {
                size = me.getOptimizedSize(me.image.width, me.image.height);

                me.modal = $.modal.open(me.content, {
                    'width': size.width,
                    'height': size.height
                });

                $(window).on('resize.lightbox', function() {
                    me.setSize(me.image.width, me.image.height);
                });

                $.subscribe('plugin/modal/onClose', function() {
                    $(window).off('resize.lightbox');
                });
            };

            me.image.src = imageURL;
        },

        createContent: function(imageURL) {
            return $('<div>', {
                'class': 'lightbox--container',
                'html':  $('<img>', {
                    'src': imageURL,
                    'class': 'lightbox--image'
                })
            });
        },

        setSize: function(width, height) {
            var me = this,
                size = me.getOptimizedSize(width, height);

            if (!me.modal) {
                return;
            }

            me.modal.setWidth(size.width);
            me.modal.setHeight(size.height);
        },

        getOptimizedSize: function(width, height) {
            var aspect = width / height,
                maxWidth = Math.round(window.innerWidth * 0.9),
                maxHeight = Math.round(window.innerHeight * 0.9);

            if (width > maxWidth) {
                width = maxWidth;
                height = Math.round(width / aspect);
            }

            if (height > maxHeight) {
                height = maxHeight;
                width = Math.round(height * aspect);
            }

            return {
                'width': width,
                'height': height
            }
        }
    }
})(jQuery);