$(document).ready(function() {
  $("#subtitle").hide();
  $("#title").css({ opacity: 0 });
  $("#subtitle").css({ opacity: 0 });

  $("#title").animate({ opacity: 1 }, 2000, function() {
    $("#subtitle").show(1000);
    $("#subtitle").animate({ opacity: 1 }, 2000);
  });
});
