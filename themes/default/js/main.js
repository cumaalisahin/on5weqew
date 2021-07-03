$(function () {

    $(".openVideo").modalVideo({channel:'youtube', autoPlay:1 });
    

    var campaign = getUrlParameter("utm_campaign");
    var medium = getUrlParameter("utm_medium");
    var source = getUrlParameter("utm_source");
    var json = {utm_campaign: campaign, utm_medium: medium, utm_source: source};

    if (typeof campaign !== "undefined" && typeof medium !== "undefined" && typeof source !== "undefined") {
        $.cookie("ad_referer", JSON.stringify(json), {expires: 15});
    }

    $(".contactSaveBtn").click(function () {
        $.post(base_url("iletisim/save", true), $("form[name='contactForm']").serialize(), function (result) {
            if (result.success) {
                resultFormat("form[name='contactForm'] .result", "success", result.msg);
            } else {
                resultFormat("form[name='contactForm'] .result", result.type, result.msg);
            }
        }, 'json');
    });



    $(".pricing-btns button").on("click", function () {
        $(".pricing-btns button").removeClass("selected");
        $(this).addClass("selected");
        var ayYil = $(this).attr("data-text");
        $("h3[data-price-ay]").each(function () {
            var priceAy = $(this).attr("data-price-ay");
            var priceYil = $(this).attr("data-price-yil");
            if (ayYil === 'ay') {
                $(this).html(priceAy + "₺");
            } else if (ayYil === 'yil') {
                $(this).html(priceYil + "₺");
            }

            $(this).next().html(lang("Müşteri Temsilcisi başına<br/>Aylık Ücret") + "<br/>");
        });
    });

    $(".pricing-btns button").first().click();

    $("form[name='calculateCost'] select").on("change", function () {
        var agent = $("select[name='agent']").val();
        var dongu = $("select[name='dongu']").val();
        var paketAdi = $("select[name='paket']").val();
        var paketFiyatiAy = $("select[name='paket'] option:selected").attr("data-value-ay");
        var paketFiyatiAltiAy = $("select[name='paket'] option:selected").attr("data-value-altiay");
        var paketFiyatiYil = $("select[name='paket'] option:selected").attr("data-value-yil");

        var monthlyCost = paketFiyatiAy;
        var cost = agent * paketFiyatiAy * dongu;

        if (dongu == 6) {
            monthlyCost = paketFiyatiAltiAy;
            cost = agent * paketFiyatiAltiAy * dongu;
        } else if (dongu == 12) {
            monthlyCost = paketFiyatiYil;
            cost = agent * paketFiyatiYil * dongu;
        }

        if (agent < 10) {
            $(".calculated-price").text(Math.round(cost * 100) / 100 + "₺");
            $(".monthly-cost").text(Math.round(monthlyCost * 100) / 100 + "₺");
        } else {
            $(".calculated-price").text(lang("Teklif alınız. 🎉"));
            $(".monthly-cost").text(lang("Teklif alınız. 🎉"));
        }
    });

    $("select[name='agent']").change();


    var index = 0;
    setInterval(function () {
        index = index % 5 + 1;
        $(".panel-screen .point").removeClass("active");
        $(".panel-screen .point" + index).addClass("active").click();
        index++;
    }, 5000);

    $(".panel-screen .point").on("click", function () {
        var index = $(this).attr("data-index");
        var target = $(this).attr("data-target");
        $(".panel-features a.selected").removeClass("selected");
        $(".panel-features a[data-index='" + index + "']").addClass("selected");
        $(".panel-content-container>div").hide();
        $(target).show();
    });




    $('.code-box-copy').codeBoxCopy({
        tooltipText: 'Copied',
        tooltipShowTime: 1000,
        tooltipFadeInTime: 300,
        tooltipFadeOutTime: 300
    });


    $(".pf-product-image").jsProductFeature({
        pauseOnHover:true,
        points: [
            {x: '20%', y: '30%', name: 'live_visitor', title: lang('Anlık Ziyaretçi Takibi'), description :'Ziyaretçilerinizi canlı olarak izleyin. Hangi sayfalara ne kadar süreyle giriyorlar, hangi ülke ve şehirden bağlanıyorlar, daha önce kaç kez ziyaret etmişler gibi pek çok kritik bilgiyi görerek buna uygun iyileştirmeler yapın.' },
            {x: '50%', y: '50%', name: 'live_chat', title: lang('Sohbet Ekranı'), description:'Kolay anlaşılır sohbet ekranını kullanarak ziyaretçilerinize anında cevap verin. Tüm soru ve isteklere gerçek zamanlı dönüş yaparak mutlu müşteriler kazanın.'},
            {x: '40%', y: '90%', name: 'respond', title: lang('Gelişmiş Mesajlaşma'),description:'Hazır mesajlar tanımlayarak tek tıkla gönderin. Sürekli aynı mesajları yazma zahmetinden kurtulun. Dosya gönderme, ziyaretçi engelleme gibi gelişmiş özelliklerden faydalanın.'},
            {x: '90%', y: '20%', name: 'visitor_info', title: lang('Ziyaretçi Kaydetme'),description:'Ziyaretçiniz ile ilgili detaylı bilgileri görmenin yanı sıra bu kişiye ait isim, telefon, e-posta ve not kayıt edebilirsiniz. Aynı kişi tekrar geldiğinde sistem otomatik olarak bu bilgileri hatırlar. Bu sayede kişiye özel hizmet sunabilirsiniz.'},
        ]
    }); 

    var mainHeader = $('.cd-auto-hide-header'),
            secondaryNavigation = $('.cd-secondary-nav'),
            //this applies only if secondary nav is below intro section
            belowNavHeroContent = $('.sub-nav-hero'),
            headerHeight = mainHeader.height();

    if ($(window).scrollTop() < 100) {
        mainHeader.addClass("transparent");
    } else {
        mainHeader.removeClass("transparent");
    }

    //set scrolling variables
    var scrolling = false,
            previousTop = 0,
            currentTop = 0,
            scrollDelta = 10,
            scrollOffset = 150;

    mainHeader.on('click', '.nav-trigger', function (event) {
        // open primary navigation on mobile
        event.preventDefault();
        mainHeader.toggleClass('nav-open');
    });

    $(window).on('scroll', function () {
        if (!scrolling) {
            scrolling = true;
            (!window.requestAnimationFrame)
                    ? setTimeout(autoHideHeader, 250)
                    : requestAnimationFrame(autoHideHeader);
        }
    });

    $(window).on('resize', function () {
        headerHeight = mainHeader.height();
    });

    function autoHideHeader() {
        var currentTop = $(window).scrollTop();

        (belowNavHeroContent.length > 0)
                ? checkStickyNavigation(currentTop) // secondary navigation below intro
                : checkSimpleNavigation(currentTop);

        previousTop = currentTop;
        scrolling = false;
    }

    function checkSimpleNavigation(currentTop) {
        if (currentTop < 100) {
            mainHeader.addClass("transparent");
        } else {
            mainHeader.removeClass("transparent");
        }
        //there's no secondary nav or secondary nav is below primary nav
        if (previousTop - currentTop > scrollDelta) {
            //if scrolling up...
            mainHeader.removeClass('is-hidden');
        } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            //if scrolling down...
            mainHeader.addClass('is-hidden');
        }
    }

    function checkStickyNavigation(currentTop) {
        //secondary nav below intro section - sticky secondary nav
        var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();

        if (previousTop >= currentTop) {
            //if scrolling up... 
            if (currentTop < secondaryNavOffsetTop) {
                //secondary nav is not fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('fixed slide-up');
                belowNavHeroContent.removeClass('secondary-nav-fixed');
            } else if (previousTop - currentTop > scrollDelta) {
                //secondary nav is fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('slide-up').addClass('fixed');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }

        } else {
            //if scrolling down...	
            if (currentTop > secondaryNavOffsetTop + scrollOffset) {
                //hide primary nav
                mainHeader.addClass('is-hidden');
                secondaryNavigation.addClass('fixed slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            } else if (currentTop > secondaryNavOffsetTop) {
                //once the secondary nav is fixed, do not hide primary nav if you haven't scrolled more than scrollOffset 
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.addClass('fixed').removeClass('slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }

        }
    }
});


$(function () {
    $(document).ajaxError(function (evt, jqXHR, settings, err) {
        if (jqXHR.status === 0) {
            alert('Not connected.\nPlease verify your network connection.');
        } else if (jqXHR.status == 404) {
            alert('The requested page not found. [404]');
        } else if (jqXHR.status == 500) {
            alert('Internal Server Error [500].');
        } else if (err === 'parsererror') {
            alert('Requested JSON parse failed.');
        } else if (err === 'timeout') {
            alert('Time out error.');
        } else if (err === 'abort') {
            alert('Ajax request aborted.');
        } else {
            alert('Uncaught Error.\n' + jqXHR.responseText);
        }
    });
});


function base_url(url, lang) {
    if (lang) {
        return BASE_URL + LANGUAGE + "/" + url;
    } else {
        return BASE_URL + url;
    }
}

function lang(key) {
    if (key in la) {
        return la[key];
    }
    return key;
}


function redirect(url, delay) {
    window.setTimeout(function () {
        window.location = url;
    }, delay);
}


function resultFormat(el, type, msg) {
    type = type == "error" ? "danger" : type;
    var html = '<div class="alert alert-' + type + ' fade in block-inner">';
    html += '<button type="button" class="close" data-dismiss="alert">×</button>';
    switch (type) {
        case "success":
            html += '<i class="fa fa-check"></i> ';
            break;
        case "error":
            html += '<i class="fa fa-warning"></i> ';
            break;
        case "warning":
            html += '<i class="fa fa-warning"></i> ';
            break;
        case "info":
            html += '<i class="fa fa-info"></i> ';
            break;
    }
    html += msg;
    html += '</div>';
    $(el).html(html);
}


function isNumeric(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    else
        return true;
}


$.fn.serializeObject = function () {
    var obj = {};

    $.each(this.serializeArray(), function (i, o) {
        var n = o.name, v = o.value;
        obj[n] = obj[n] === undefined ? v : $.isArray(obj[n]) ? obj[n].concat(v) : [obj[n], v];
    });
    return obj;
};


function isEmail(value) {
    value = value.toLowerCase();
    //var reg=new RegExp(/^[a-z]{1}[\d\w\.-]+@[\d\w-]{3,}\.[\w]{2,3}(\.\w{2})?$/);
    var reg = new RegExp(/^[_a-z0-9-\+]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9]+)*(\.[a-z]{2,})$/);
    return reg.test(value);
}

function isNumeric(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    else
        return true;
}

/* Regular expression to validate email address */
/*---------------------------------------------------------------------*/
function validateEmail(emailValue) {
    var emailPattern = /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/;
    return emailPattern.test(emailValue);
}






window.onDestekClientReady = function () {
    // Butona tıklandığında sohbet penceresini açtırıyoruz   
    $(".start-chat-btn").on("click", function () {
        OnDestekClient.api.openWindow();
    });
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {
        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {},
                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling $.cookie().
                cookies = document.cookie ? document.cookie.split('; ') : [],
                i = 0,
                l = cookies.length;

        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                    name = decode(parts.shift()),
                    cookie = parts.join('=');

            if (key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {expires: -1}));
        return !$.cookie(key);
    };

}));

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


$.fn.jsProductFeature = function (options) {
    /* default settings */
    var defaults = {
        pauseOnHover: true
    };

    var self = this;
    var settings = $.extend(defaults, options);
    var pointCount = settings.points.length;
    var paused = false;

    /* Wrap Product Image */
    self.wrap("<div class='pf-product-container'></div>")


    var container = self.parent();
    container.after("<div class='pf-mobile-container'></div>");
    var mobileContainer = container.next();
    $.each(settings.points, function (i, v) {

        //For Desktop
        var html = '<a href="javascript:void(0)" class="pf-point" style="left:' + v.x + ';top:' + v.y + '" data-point-index="' + i + '">';
        html += '<span>' + i + '</span>';
        html += '<div class="pf-point-box">';
        html += '<h2 class="pf-point-title">' + v.title + '</h2>';
        html += '<div class="pf-point-desc">' + v.description + '</div>';
        html += '</div>';
        html += '</a>';
        container.append(html);

        //For Mobile
        var html = '<div class="pf-tab" data-point-index="' + i + '">';
        html += '<span>' + i + '</span>';
        html += '<h2 class="pf-point-title">' + v.title + '</h2>';
        html += '<div class="pf-point-desc">' + v.description + '</div>';
        html += '</div>';
        mobileContainer.append(html);

    });

    /* Select first point */
    container.find(".pf-point").first().addClass("selected");
    mobileContainer.find(".pf-tab").first().addClass("active");


    index = 0;

    var timer = setInterval(function () {
        if (!paused) {
            index = (index >= pointCount) ? 0 : index;
            container.find(".pf-point").removeClass("selected");
            container.find(".pf-point[data-point-index='" + index + "']").addClass("selected");
            mobileContainer.find(".pf-tab").removeClass("active");
            mobileContainer.find(".pf-tab[data-point-index='" + index + "']").addClass("active");
            index++;
        }
    }, 5000);

    container.on("mouseenter", function () {
        if (settings.pauseOnHover) {
            paused = true;
        }
    }).on("mouseleave", function () {
        paused = false
    });

    container.find(".pf-point").on("click", function (result) {
        container.find(".pf-point").removeClass("selected");
        $(this).addClass("selected");
        var i = $(this).attr("data-point-index");
        mobileContainer.find(".pf-tab").removeClass("active");
        mobileContainer.find(".pf-tab[data-point-index='" + i + "']").addClass("active");
    });

};