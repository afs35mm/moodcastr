
// SC.initialize({
//   client_id: '7f13df00670119af313716b04857e078'
// });

var WJ = {};
WJ.config = {
	'baseUrl' : 'http://api.wunderground.com/api/',
	'apiKey' : 'c7625f0e37eefd36'
}

WJ.App = (function(){
	
	i = 0;
	colorStart = ['#4484d3', '#777fea', '#6478ba', '#A0AFDC', '#82CAFF'];
	hasBeenSearched = false;
	var	fieldValue,
		intervalToClear,
		condition,
		tempFeel,
		trackNumber;

	function init(){
		bindDOMEvents();
		intervalToClear = setInterval(function foo(){
			BGcycle(colorStart);
			return foo;
		}(),3000);
		//console.log(feels.conditions[3]);
	};

	function BGcycle(arr){
		$('body').animate({ backgroundColor: arr[i] },3000 );
		//console.log(i);
		 i === (arr.length - 1) ? i=0 : i++;
	};

	function changeBG(objName){
		$('body').animate( { backgroundColor: objName },3000 );
	}
	
	function bindDOMEvents (){
		$('#search_btn').on('click', search);
		$('#location').keypress(function(e){
			if (e.which === 13){
				$('#search_btn').trigger('click');
			}
		});
		$('#location').val('enter a zip');
		$('#location').focus(function(){
			fieldValue = $(this).val()
			$(this).val('');
		});
		$('#location').blur(function(){
			if( $(this).val() === ''){
				$(this).val(fieldValue);
			}else{

			}
		});
		$('#next').on('click',function(){
			playSomeSound(conditions[tempFeel]['genre'],conditions[tempFeel]['trackCount']);
		})
	};

	function search (){
		$('#SC_controls').show();
		$('#load').toggle();
		$('#target').empty();
		fieldValue = $("#location").val(); 
		lookup(fieldValue);
	};

	function animateSearchBox(){
		clearInterval(intervalToClear);
		$('#search-wrapper').animate({ paddingTop: '40px'});
	};

	function calculateCondition(temp){
		if(temp < 0){
			console.log('its fucking artic!');
			tempFeel = 'belowThirtyTwo';
		}
		else if( temp >= 0 && temp < 32)
		{
			console.log('its freezing, literally!');
			tempFeel = 'belowThirtyTwo';
		}
		else if(temp >= 32 && temp < 40)
		{
			console.log('its not too bad out, kinda nippley tho');
			tempFeel = 'between32and40';
		}
		else if(temp >= 40 && temp < 50)
		{
			console.log('Pretty beautiful');
			tempFeel = 'between40and50';
		}
		else if(temp >= 50 && temp < 65)
		{
			console.log('Pretty beautiful');
			tempFeel = 'between50and65';
		}
		else if(temp >= 65 && temp < 78)
		{
			console.log('hawt');
			tempFeel = 'between65and78';
		}
		else if(temp >= 78 && temp < 90)
		{
			console.log('hawt');
			tempFeel = 'between78and90';
		}
		else if(temp >= 90)
		{
			console.log('HOT DAMN');
			tempFeel = 'above90';
		}
		else
		{
			console.log('not sure of the weather... yet');
			tempFeel = 'defaultcondition';
		}
	};

	function lookup (loc){
		var
		location,
		temp_f,
		weather,
		observation_location,
		wind,
		precip,
		genreType,
		conditionExpression;

		$.ajax({ 
			url : WJ.config.baseUrl + WJ.config.apiKey + "/geolookup/conditions/q/" + loc + ".json", 
			dataType : "jsonp", 

			success : function(data) { 
				console.log(data)
				$('#load').toggle();
				$('#weather').empty().hide();
				$('#error').empty().hide();
					if( data.response.error != undefined ){	
						$('#error').append(data.response.error.description).fadeIn();
					}else if (data.response.results != undefined){
						$('#error').append('Too many locations, be more specific!').fadeIn();
					}else
					{
						if( !hasBeenSearched ){
							animateSearchBox();
							hasBeenSearched = true;
						}
						//clearInterval(intervalToClear);
						location = data['location']['city']; 
						temp_f = data['current_observation']['temp_f']; 
						weather = data['current_observation']['weather']; 
						observation_location = data['current_observation']['observation_location']; 
						wind = data['current_observation']['wind_string']; 
						precip = data['current_observation']['precip_today_in']; 
						
						calculateCondition(temp_f);
						//console.log(precip);
						playSomeSound(conditions[tempFeel]['genre'],conditions[tempFeel]['trackCount']);		
						changeBG(conditions[tempFeel]['bg']);
						$('#next').delay(3000).fadeIn('slow');
						soundsLike = conditions[tempFeel]['blurb'];
						$('#weather').append("It's looking  " + weather.toLowerCase()  + " in " + location + " and about " + temp_f + " degrees. " + soundsLike).fadeIn();
						
					}
			}
		});
	};

	function playSomeSound(genre, trackNum){
        SC.get('/tracks', {
            genres: genre,
            bpm:{}
        }, function(tracks){
            //console.log(tracks[random].uri);
            SC.oEmbed(tracks[trackNum].uri, {auto_play:true},document.getElementById('target'));
            //console.log('trackNum is : ' + trackNum);
        });
        conditions[tempFeel]['trackCount']++;
        console.log('GENRE IS: ' + conditions[tempFeel]['genre'] + 'AND TRACK COUNT IS '+ conditions[tempFeel]['trackCount']);
    };

	return{
		init: init
	};

}());

$(document).ready(function(){
	WJ.App.init();
	SC.initialize({
        client_id: '7f13df00670119af313716b04857e078'
    });
});


var conditions =	
{
	'defaultcondition' : { 
		'bg': '#FF4D4D', 
		'genre' : 'country',
		'blurb' : ' Here\'s some country. Becuase I really have no idea what else to play...',
		'trackCount': 0
	},
	'belowThirtyTwo' : { 
		'bg': '#9fb9d4', 
		'genre' : 'indie folk',
		'blurb' : 'Relax with some indie folk because it\'s absolutely fridgid out there!',
		'trackCount': 0
	},	
	'between32and40' : { 
		'bg': '#79a9da', 
		'genre' : 'electronic',
		'blurb' : ' Here\'s an electronic jam in the hope that the mercury rises sometime soon...',
		'trackCount': 0
	},
	'between40and50' : { 
		'bg': '#4e83b9', 
		'genre' : 'trance',
		'blurb' : 'Here\'s some trance to help muddle through your day until you have to do it all again tomorrow.',
		'trackCount': 0
	},
	'between50and65' : { 
		'bg': '#4867ed', 
		'genre' : 'pop',
		'blurb' : ' It\'s pretty average out there. Here\'s some mediocore music to go along with the extraordinarily average temperature, because we both know it could be better out.',
		'trackCount': 0
	},
	'between65and78' : { 
		'bg': '#2c61d8', 
		'genre' : 'indie',
		'blurb' : ' Could it be cooler out? I didn\'t think so. Here\'s some hipster indie music.',
		'trackCount': 0
	},
	'between78and90' : { 
		'bg': '#2ecfec', 
		'genre' : 'hip hop',
		'blurb' : 'It\'s gorgeous out there! So put the top down, grab a cold one, and enjoy the ride.',
		'trackCount': 0
	},
	'above90' : { 
		'bg': '#fdadad', 
		'genre' : 'salsa',
		'blurb' : 'You could use some salsa to match the heat because it\'s blazing out there.',
		'trackCount': 0
	}
}