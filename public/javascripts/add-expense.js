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
              window.location.replace('/expenses');
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
    })
});

function deleteExpense(e){
    var url = '/expenses/' + $(e.target).attr('id');

    $.ajax({
        type: "DELETE",
        url: url,
        success: function(result){
            window.location.replace(window.location.href);
        }
    })
}
