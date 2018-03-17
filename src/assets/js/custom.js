$('.form-control').on('keyup', function() {
	if($(this).val().length==0){
	  $(this).parents('.form-group').removeClass('add-label');
	}
	else{
	$(this).parents('.form-group').addClass('add-label');
	}
});

$('#btn-copy').click(function(){
  var copyText = document.getElementById("copy-text");
  copyText.select();
  document.execCommand("Copy");
  $('#btn-copy').html('<i class="far fa-copy"></i> Copy to clipboard');
});

$(document).on('click', '.sing-up-link', function(){
    $('#register-form').modal('toggle');
    $('#login-form').modal('toggle');
});

$(document).on('click', '.sing-in-link', function(){
    $('#login-form').modal('toggle');
    $('#register-form').modal('toggle');
});

$(document).on('click', '.forgot-link', function(){
    $('#login-form').modal('toggle');
    $('#forgot-form').modal('toggle');
});

setTimeout(function(){
	$('.sparkliness1').sparkline('html', { lineWidth:2,disableInteraction:true,spotColor:false,minSpotColor:false,maxSpotColor:false,width:125,lineColor:'#F7931A',height:22,fillColor:'rgba(255, 255, 255, 0.0)'});
}, 3000);

function getData(page)
{
	var sortOrder=$('#sortOrder').val();
	var sortField=$('#sortField').val();
	$('.loadMore').hide();
	$('.spinner').removeClass('hide');


	var data=new FormData();
	data.append('page',page);
	data.append('sortOrder',sortOrder);
	data.append('sortField',sortField);

	$.ajax({
		type: "POST",
		url: "https://crypto.nexthon.com/coins-list-post",
		data: data,
		cache: false,
		processData: false,
		contentType: false,
		success: function(result)
		{
			var responseData=$.parseJSON(result);
			var response=responseData['response'];
			if(response == 0)
			{
				alert('InValid Access occured');
			}
			else if(response == 1)
			{
				var result=responseData['responseHtml'];
				var responsiveView=$(result).filter('#responsiveView').html();
				var mainView=$(result).filter('#mainView').html();

				mainView=$(mainView).filter('tbody').html();
				var tbody=$(responsiveView).filter('tbody').html();

				$('.responsiveViewAppend').append(tbody);
				$('.mainViewAppend').append(mainView);
				var a='.sparkliness1'+responseData['data'];
				$('.loadMore').val(responseData['data']);
				$(a).sparkline('html', { lineWidth:1,disableInteraction:true,spotColor:false,minSpotColor:false,maxSpotColor:false,width:125,lineColor:'#507ee3',height:22,fillColor:'#ccddff'});
			}
			$('.loadMore').show();
			$('.spinner').addClass('hide');
		}
	});
}