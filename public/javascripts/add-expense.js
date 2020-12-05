$(document).ready(function () {
    $('#expenses-table').DataTable({"ordering": false});
    $('.dataTables_length').addClass('bs-select');

    var today = new Date();
    today.setHours(today.getHours() - 6);
    $('#date').val(today.toISOString().substr(0, 10))

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
            window.location.replace('/expenses');
        }
    })
}
