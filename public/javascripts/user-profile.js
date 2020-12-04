$(document).ready(function() {
  // for when page is reloaded on an error
  if($("#newPassword").val())
    $("#oldPassword").attr("required", true);

  $(document).on("change", "#newPassword", function() {
    if($(this).val())
      $("#oldPassword").attr("required", true);
  });
});
