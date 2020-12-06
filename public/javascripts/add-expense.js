$(document).ready(function () {

    var today = new Date();
    today.setHours(today.getHours() - 6);
    $('#date').val(today.toISOString().substr(0, 10))

    $("#search").on("keypress", function(e) {
      if(e.which == 13) {
        var searchQuery = "search=" + $(this).val();
        window.location.replace('/expenses?' + searchQuery);
      }
     });

    $(document).on("change", "#table_length", function() {
      var settings = {};
      settings.num_results = $(this).val();
      $.ajax({
          type: "POST",
          url: "/expenses?_method=GET",
          contentType: "application/json",
          data: JSON.stringify(settings),
          success: function(result){
              window.location.replace(window.location.href);
          }
      });
    });

    $(document).on("change", "#month", function() {
      var settings = {};
      settings.month = $(this).val();
      $.ajax({
          type: "POST",
          url: "/expenses?_method=GET",
          contentType: "application/json",
          data: JSON.stringify(settings),
          success: function(result){
              window.location.replace(window.location.href);
          }
      });
    });

    $(document).on("click", "#add-btn", function() {
        var expense = {};

        expense.title = $('#title').val();
        expense.category = $('#category option:selected').text();
        expense.date = $('#date').val();
        expense.amount = $('#amount').val();

        $.ajax({
            type: "POST",
            url: "/expenses",
            contentType: "application/json",
            data: JSON.stringify(expense),
            success: function(result){
                window.location.replace('/expenses');
            }
        });
    });

    $(document).on("click", "tr .bi-trash", function() {
        $("#deleteModal").modal('show');
        $("#btnDelete").attr('expense_id', $(this).parents().eq(2).attr('id'));
    });

    $(document).on("click", "#btnDelete", function() {
      if($(this).attr('expense_id')) {
        $("#deleteModal").modal('hide');
        var url = '/expenses/' + $(this).attr('expense_id') + '?_method=DELETE';
        $.ajax({
            type: "POST",
            url: url,
            success: function(result){
                window.location.replace(window.location.href);
            }
        });
      }
    });

    $(document).on("click", "tr .bi-pencil", function() {
        $(this).hide();
        $(this).parent().find(".bi-check2").show();
        console.log($(this).parents().eq(2));
        $(this).parents().eq(2).find(".title, .amount, .date, .category").prop("disabled", false);
    });

    $(document).on("click", "tr .bi-check2", function() {
        $(this).hide();
        $(this).parent().find(".bi-pencil").show();
        $(this).parents().eq(2).find(".title, .amount, .date, .category").prop("disabled", true);

        var url = '/expenses/' + $(this).parents().eq(2).attr('id') + '?_method=PUT';
        var expense = {};

        expense.title = $(this).parents().eq(2).find(".title").val();
        expense.category = $(this).parents().eq(2).find(".category option:selected").text();
        expense.date =  $(this).parents().eq(2).find(".date").val();
        expense.amount =  $(this).parents().eq(2).find(".amount").val();

        console.log(expense);
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(expense),
            success: function(result){
                window.location.replace(window.location.href);
            }
        });
    });


});
