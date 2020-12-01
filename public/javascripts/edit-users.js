$(document).ready(function() {
  var editMode = false;
  var user_id = $("#user_id").text();
  $("#user_id").remove();

  $(document).on("click", "#btnEdit", function() {
    editMode = !editMode;

    $("td input, td select").prop("disabled", !editMode);
    $("tr#"+user_id+" td select").prop("disabled", true);
    if(editMode) {
      $("#btnSave, #btnNew").css({ visibility: "visible" });
      $("#btnSave, #btnNew").animate({ opacity: "1" }, 200);
    } else {
      $("#btnSave, #btnNew").animate({ opacity: "0" }, 200, function() {
        $("#btnSave, #btnNew").css({ visibility: "hidden" });
      });
    }
  });

  $(document).on("mouseenter", "tr", function() {
    if(editMode && user_id != $(this).attr('id')) {
      $(this).find('a').css({ visibility: "visible" });
    }
  });

  $(document).on("mouseleave", "tr", function() {
    if(editMode) {
        $(this).find('a').css({ visibility: "hidden" });
    }
  });

  $(document).on("click", "#btnSave", function() {
    var formData = [];
    $("tbody tr").each(function(index) {
      var object = {};
      object._id = $(this).attr('id');
      object.username = $(this).find("input").val();
      object.account_type = $(this).find("select").val();
      object.disabled = $(this).hasClass('bg-danger');
      if(object._id)
        formData.push(object);
    });

    $.ajax({
      type: "POST",
      url: "/users?_method=PUT",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function(result) {
        window.location.replace(result.redirect);
      }
    });

  });

  $(document).on("click", "td div a", function() {
    console.log("delete!");
    $(this).parents().eq(2).addClass("bg-danger");
  });
});
