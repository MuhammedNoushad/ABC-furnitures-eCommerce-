document.addEventListener("DOMContentLoaded", function () {
    // Activate the main image carousel
    $("#productCarousel").carousel();

    // Activate the thumbnail carousel
    $("#product_details_slider").carousel();

    // Enable thumbnail carousel control
    $(".thumbnail-control-prev").click(function () {
      $("#product_details_slider").carousel("prev");
    });

    $(".thumbnail-control-next").click(function () {
      $("#product_details_slider").carousel("next");
    });

    // Sync the main carousel with the thumbnail carousel
    $("#productCarousel").on("slide.bs.carousel", function (event) {
      var index = event.to;
      $("#product_details_slider").carousel(index);
    });
  });