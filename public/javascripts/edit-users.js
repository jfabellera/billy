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
        window.location.replace('/users');
      });
    }
  });

  $(document).on("click", "#btnRefresh", function() {
    window.location.replace('/users');
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

  $(document).on("click", ".bi-trash", function() {
    if(!$(this).parents().eq(3).hasClass("bg-danger")) {
      $(this).parents().eq(3).addClass("bg-danger");
      $(this).parent().find(".bi-arrow-clockwise").show();
      $(this).hide();
      $(this).parents().eq(3).find("input, select").each(function(index) {
        $(this).val($(this).attr("default"));
        $(this).prop("disabled", true);
      });
    }
  });

  $(document).on("click", ".bi-arrow-clockwise", function() {
    $(this).parents().eq(3).find("input, select").each(function(index) {
      $(this).val($(this).attr("default"));
      $(this).prop("disabled", false);
    });
    $(this).parents().eq(3).removeClass("bg-warning bg-danger");
    $(this).hide();
    $(this).parent().find(".bi-trash").show();
  });

  $(document).on("change", "td input, td select", function() {
    var row = $(this).parents().eq(1);
    if($(row).find("input").attr("default") != $(row).find("input").val() ||
    $(row).find("select").attr("default") != $(row).find("select").val()) {
      row.addClass("bg-warning");
      row.find(".bi-trash").hide();
      row.find(".bi-arrow-clockwise").show();
    } else {
      row.removeClass("bg-warning");
      row.find(".bi-trash").show();
      row.find(".bi-arrow-clockwise").hide();
    }
  });
});
