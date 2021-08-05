

  $(document).ready(function(){

    $('.a-1').waypoint(function(direction){
        $('.a-1').addClass('animate__animated animate__fadeInDown')
    },
    {
        offset: '500px'
    })
    $(function() {

      $("#newModalForm").validate({
        rules: {
          username: {
            required: true,
            minlength: 8
          },
          action: "required"
        },
        messages: {
          username: {
            required: "Please enter some data",
            minlength: "Your data must be at least 8 characters"
          },
          action: "Please provide some data"
        }
      });
    });
});