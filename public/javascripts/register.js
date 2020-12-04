$(document).ready(function() {
  var formValid = true;

  /** Check password strength
    * Criteria:
    * - at least one uppercase
    * - at least one lowercase
    * - at least one number
    * - at least one special character
    * - at least 8 characters long
    */
  $(document).on("change", "#password", function() {
    var passwordCriteria = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const password = $(this).val();
    if(!passwordCriteria.test(password)) {
      $("#insecurePassword").show();
      formValid = false;
    }
    else {
      $("#insecurePassword").hide();
      formValid = true;
    }
  });

  $("#btnSubmit").click(function(e) {
    console.log('bnasdfkhjbakjbsf');
    if(!formValid){
      e.preventDefault();
    }
  })
});
