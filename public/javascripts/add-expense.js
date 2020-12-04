$(document).ready(function() {
    $(document).on("click", "#add-expense", function() {
        $("#add-expense-form").submit();
        console.log("added");
      });
});