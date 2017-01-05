$(function() {
  if($('#parselist').length){

    $('#resetBookings').on('click', function(){
      $.ajax({
        method: 'POST',
        url:'/resetBookings'
      });
    });

    $('.parse').on('click', function(){
      $.ajax({
         method: "POST",
         url: "/parse",
         data: {
            file: $(this).parent().attr('id')
         }
      });
    })
  
  }

  if($('#mapping').length){
   
   $('.bkng').each(function(){
    var rex = /Bancomat/;
    var text = $(this).find('.title').text()
    if(text.match(rex)){
       $(this).find('select').val('kasse');
    } else {
      $(this).find('select').val('lebensmittel');
    }
   });

  }
    
});