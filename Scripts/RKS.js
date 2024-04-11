$(document).ready(function () {
    $("#menuNav").load("/Structure/navBar.html");
    $("#footer").load("/Structure/footer.html");
    $("#header").load("/Structure/header.html");

    $('[data-toggle="tooltip"]').tooltip();
    //Open an accordion pane like a anchor link
    $(window.location.hash).addClass("in");
});

