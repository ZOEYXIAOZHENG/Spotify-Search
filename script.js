(function () {
    var nextUrl = "";

    $("#submit-btn").on("click", function () {
        var userInput = $("input[name=user-input]").val();
        var albumOrArtist = $("select").val();

        $.ajax({
            url: "https://spicedify.herokuapp.com/spotify",
            method: "GET",
            data: {
                query: userInput,
                type: albumOrArtist,
            },
            success: function (responseData) {
                responseData = responseData.artists || responseData.albums;

                console.log("responseData:", responseData);

                var results = "";

                for (var i = 0; i < responseData.items.length; i++) {
                    // to set the image, first assume there is no image

                    var imgUrl = "";
                    // in case spotify gives me an actual image, I want to reassign value
                    if (responseData.items[i].images.length > 0) {
                        imgUrl = responseData.items[i].images[0].url;
                    }

                    console.log(responseData.items[i].external_urls.spotify);

                    results +=
                        "<div class='result-item'><img src='" +
                        imgUrl +
                        "'/><a class='result-text' href=" +
                        responseData.items[i].external_urls.spotify +
                        ">" +
                        responseData.items[i].name +
                        "</a></div>";
                }

                if (responseData.items.length == 0) {
                    results = "There is no result for your search.";
                }

                $("#results-container").html(results);

                // ----------if want to load more results, add "MORE" button--------

                nextUrl =
                    responseData.next &&
                    responseData.next.replace(
                        "https://api.spotify.com/v1/search",
                        "https://spicedify.herokuapp.com/spotify"
                    );
                // if nextUrl is null, dun show "MORE" button.
                if (nextUrl) {
                    if (location.search.indexOf("scroll=infinite") > -1) {
                        checkScrollPosition();
                    } else {
                        $(".moreButton").addClass("on");
                    }
                }
            },
        });
    }); // closes submit btn event listener

    $(".moreButton").on("click", function () {
        $.ajax({
            url: nextUrl,
            method: "GET",
            success: function (responseData) {
                responseData = responseData.artists || responseData.albums;
                console.log("responseData:", responseData);

                var results = "";
                for (var i = 0; i < responseData.items.length; i++) {
                    var imgUrl = "";
                    // in case spotify gives me an actual image, I want to reassign value
                    if (responseData.items[i].images.length > 0) {
                        imgUrl = responseData.items[i].images[0].url;
                    }

                    results +=
                        "<div class='result-item'><img src='" +
                        imgUrl +
                        "'/><a class='result-text' href=" +
                        responseData.items[i].external_urls.spotify +
                        ">" +
                        responseData.items[i].name +
                        "</a></div>";
                }

                $("#results-container").append(results);

                nextUrl =
                    responseData.next &&
                    responseData.next.replace(
                        "https://api.spotify.com/v1/search",
                        "https://spicedify.herokuapp.com/spotify"
                    );
                if (responseData.items.length < 20) {
                    $(".moreButton").removeClass("on");
                }
            },
        });
    });

    // ===================== infinite scroll =========================

    function checkScrollPosition() {
        var reachBottom =
            $(document).scrollTop() + $(window).height() >=
            $(document).height() - 400;
        console.log(reachBottom);
        if (reachBottom) {
            $.ajax({
                url: nextUrl,
                method: "GET",
                success: function (responseData) {
                    responseData = responseData.artists || responseData.albums;
                    console.log("responseData:", responseData);

                    var results = "";
                    for (var i = 0; i < responseData.items.length; i++) {
                        // to set the image,assume there is no image
                        var imgUrl = "";
                        // in case spotify gives me an actual image, I want to reassign value
                        if (responseData.items[i].images.length > 0) {
                            imgUrl = responseData.items[i].images[0].url;
                        }

                        results +=
                            "<div class='result-item'><img src='" +
                            imgUrl +
                            "'/><div class='result-text'>" +
                            responseData.items[i].name +
                            "</div></div>";
                    }

                    $("#results-container").append(results);

                    nextUrl =
                        responseData.next &&
                        responseData.next.replace(
                            "https://api.spotify.com/v1/search",
                            "https://spicedify.herokuapp.com/spotify"
                        );
                    if (nextUrl) {
                        if (location.search.indexOf("scroll=infinite") > -1) {
                            setTimeout(checkScrollPosition, 500);
                        } else {
                            $(".moreButton").addClass("on");
                        }
                    }
                },
            });
        } else {
            setTimeout(checkScrollPosition, 500);
        }
    }
})(); // closes the IIFE

//================================Second Version==================================
// (function () {
//     var nextUrl;

//     $("#submit-btn, #more").on("click", function (e) {
//         var url, data;
//         if (e.target.id == "submit-btn") {
//             url = "https://spicedify.herokuapp.com/spotify";
//             data = {
//                 query: $("input[name=user-input]").val(),
//                 type: $("select").val(),
//             };
//         } else {
//             url = nextUrl;
//         }

//         $.ajax({
//             url: url,
//             method: "GET",
//             data: data,
//             success: function (responseData) {
//                 responseData = responseData.artists || responseData.albums;

//                 results = getResultsHtml(responseData.items);

//                 setNextUrl(responseData.next);

//                 results +=
//                 "<div class='result-item'><img src='" +
//                 imgUrl +
//                 "'/><div class='result-text'>" +
//                 responseData.items[i].name +
//                 "</div></div>";
//         }

//                 if (e.target.id == "submit-btn") {
//                     $("#results-container").html(results);
//                 } else {
//                     $("#results-container").append(results);
//                 }
//             },

//     });

//     function getResultsHtml(items) {
//         var results = "";
//         for (var i = 0; i < items.length; i++) {
//             var imgUrl = "default.jpg";
//             if (items[i].images.length > 0) {
//                 imgUrl = items[i].images[0].url;
//             }

//         return results;
//     }

//     function setNextUrl(next) {
//         nextUrl =
//             next &&
//             next.replace(
//                 "https://api.spotify.com/v1/search",
//                 "https://spicedify.herokuapp.com/spotify"
//             );
//         return nextUrl;
//     }
// })
// })();

// $(window).height(); => window.innerHeight()in vanilla JS
// $(document).scrollTop(); => window.pageYOffset() in vanilla
// $(document).height() => document.body.
