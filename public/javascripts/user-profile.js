$(document).ready(function() {
  $(document).on("change", "#newPassword", function() {
    if($(this).val())
      $("#oldPassword").attr("required", true);
  });
});
