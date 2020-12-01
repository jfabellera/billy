$(document).ready(function() {
  var editMode = false;
  $(document).on("click", "#btnEdit", function() {
    editMode = !editMode;

    $("td input, td select").prop("disabled", !editMode);
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
    if(editMode) {

    }
  });

  $(document).on("mouseleave", "tr", function() {
    if(editMode) {

    }
  });

  $(document).on("click", "#btnSave", function() {
    var formData = [];
    $("tbody tr").each(function(index) {
      var object = {};
      object._id = $(this).attr('id');
      object.username = $(this).find("input").val();
      object.account_type = $(this).find("select").val();
      if(object._id)
      formData.push(object);
    });

    $.ajax({
      type: "POST",
      url: "/users?_method=PUT",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function(result) {

      }
    });


  });
});
