var countries = ['Aruba', 'Andorra', 'Afghanistan', 'Angola', 'Albania','United Arab Emirates', 'Argentina', 'Armenia', 'American Samoa', 'Antigua and Barbuda', 'Australia', 'Austria', 'Azerbaijan', 'Burundi', 'Belgium', 'Benin', 'Burkina Faso', 'Bangladesh', 'Bulgaria', 'Bahrain', 'Bahamas', 'Bosnia and Herzegovina', 'Belarus', 'Belize', 'Bermuda', 'Bolivia', 'Brazil', 'Barbados', 'Brunei Darussalam', 'Bhutan', 'Botswana', 'Central African Republic', 'Canada', 'Switzerland','Chile', 'China', "Côte d'Ivoire", 'Cameroon', 'Congo', 'Colombia', 'Comoros', 'Cabo Verde', 'Costa Rica', 'Cuba', 'Curacao', 'Cayman Islands', 'Cyprus', 'Czech Republic', 'Germany', 'Djibouti', 'Dominica', 'Denmark', 'Dominican Republic', 'Algeria', 'Ecuador', 'Egypt', 'Eritrea', 'Spain', 'Estonia', 'Ethiopia', 'Finland', 'Fiji', 'France', 'Gabon', 'United Kingdom', 'Georgia', 'Ghana', 'Guinea', 'Gambia', 'Guinea-Bissau', 'Equatorial Guinea', 'Greece', 'Grenada', 'Greenland', 'Guatemala', 'Guam', 'Guyana','Honduras', 'Croatia', 'Haiti', 'Hungary', 'Indonesia', 'Isle of Man', 'India', 'Ireland', 'Iran, Islamic Republic of', 'Iraq', 'Iceland', 'Israel', 'Italy', 'Jamaica', 'Jordan', 'Japan', 'Kazakhstan', 'Kenya', 'Kyrgyzstan', 'Cambodia', 'Kiribati', 'St. Kitts and Nevis', "Korea, Democratic People's Republic of", 'Kosovo', 'Kuwait', "Lao People's Democratic Republic", 'Lebanon', 'Liberia', 'Libya', 'Saint Lucia', 'Liechtenstein', 'Sri Lanka', 'Lesotho', 'Lithuania', 'Luxembourg', 'Latvia', 'Macao', 'Saint Martin (French part)', 'Morocco', 'Monaco', 'Moldova', 'Madagascar', 'Maldives', 'Mexico', 'Marshall Islands', 'Macedonia, the Former Yugoslav Republic of', 'Mali', 'Malta', 'Myanmar', 'Montenegro', 'Mongolia', 'Northern Mariana Islands', 'Mozambique', 'Mauritania', 'Mauritius', 'Malawi', 'Malaysia', 'Namibia', 'New Caledonia', 'Niger', 'Nigeria', 'Nicaragua', 'Netherlands', 'Norway', 'Nepal', 'New Zealand', 'Oman', 'Pakistan', 'Panama', 'Peru', 'Philippines', 'Palau', 'Papua New Guinea', 'Poland', 'Puerto Rico', 'Portugal', 'Paraguay', 'French Polynesia', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'Saudi Arabia', 'Sudan', 'Senegal', 'Singapore', 'Solomon Islands', 'Sierra Leone', 'El Salvador', 'San Marino', 'Somalia', 'Serbia', 'South Sudan','Sao Tome and Principe', 'Suriname', 'Slovak Republic', 'Slovenia', 'Sweden', 'Swaziland', 'Sint Maarten (Dutch part)', 'Seychelles', 'Syrian Arab Republic', 'Turks and Caicos Islands', 'Chad', 'Togo', 'Thailand', 'Tajikistan', 'Turkmenistan', 'Timor-Leste', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Tuvalu', 'Tanzania', 'Uganda', 'Ukraine', 'Uruguay', 'United States', 'Uzbekistan', 'Saint Vincent and the Grenadines', 'Venezuela, Bolivarian Republic of', 'Virgin Islands (U.S.)', 'Vietnam', 'Vanuatu','Samoa', 'Yemen', 'South Africa', 'Congo, the Democratic Republic of the', 'Zambia', 'Zimbabwe']


//Taken from http://twitter.github.io/typeahead.js/examples/
var substringMatcher = function(strs) {
      return function findMatches(q, cb) {
          var matches, substrRegex;

          // an array that will be populated with substring matches
          matches = [];

          // regex used to determine if a string contains the substring `q`
          substrRegex = new RegExp(q, 'i');

          // iterate through the pool of strings and for any string that
          // contains the substring `q`, add it to the `matches` array
          $.each(strs, function(i, str) {
              if (substrRegex.test(str)) {
                  // the typeahead jQuery plugin expects suggestions to a
                  // JavaScript object, refer to typeahead docs for more info
                  matches.push({ value: str });
              }
          });

          cb(matches);
      };
};



$(document).ready( function(){


      var country1;
      var country2;
      var country1Code;
      var country2Code;
      var countryCodeUrl = "http://opendata.socrata.com/resource/s8we-gpvp.json?";


      $('.typeahead').typeahead({
          hint: false,
          highlight: true,
          minLength: 3
      },
      {
          name: 'countries',
          displayKey: 'value',
          source: substringMatcher(countries)
      });
      // Default jsonp settings
      //This fixes the issue with the World bank API not preserving the case of the callback
      //Taken from  http://stackoverflow.com/questions/22186703/modifying-jquery-jsonp-callback-function
      (function() {
          var myajax_nonce = jQuery.now();
          jQuery.ajaxSetup({
              jsonp: "callback",
              jsonpCallback: function() {
                  var callback = ( jQuery.expando.toLowerCase() + "_" + ( myajax_nonce++ ) );
                  this[ callback ] = true;
                  return callback;
              }
          });
      })();

       function getCountryCode(countryName){
          //$.ajaxSetup();
          return $.getJSON(countryCodeUrl, {name: countryName});
      }


      function getInternetStats(data, textStatus, jqXHR){
        //ajaxSetup();
        var internetUrl = "http://api.worldbank.org/countries/"+data[0].code+"/indicators/IT.NET.USER.P2?format=jsonP&prefix=?&date=2005:2013";
        return $.getJSON(internetUrl);
      }

      function getMobilephonesStats(data, textStatus, jqXHR){
        //ajaxSetup();
        var cellPhoneUrl = "http://api.worldbank.org/countries/"+data[0].code+"/indicators/IT.CEL.SETS.P2?format=jsonP&prefix=?&date=2005:2013";
        return $.getJSON(cellPhoneUrl);
      }


      $('#country_form').on('submit', function(event){
        var country1CellArr = [];
        var country2CellArr = [];
        var country1InternetArr = [];
        var country2InternetArr = [];

        event.preventDefault();

        country1 = $('#country1').val();
        country2 = $('#country2').val();

         $.when(

            getCountryCode(country1).then(getInternetStats),
            getCountryCode(country1).then(getMobilephonesStats),
            getCountryCode(country2).then(getInternetStats),
            getCountryCode(country2).then(getMobilephonesStats)


        ).then(function(country1InternetData, country1MobileData,country2InternetData, country2MobileData){


          console.log('TEST Internet');
          var c1InternetData = country1InternetData[0][1];
          var c2InternetData = country2InternetData[0][1];

          for(var i=0; i < c1InternetData.length; i++){
            country1InternetArr.push(new Array(Number(c1InternetData[i].date), Number(c1InternetData[i].value)));
          }

          for(var i=0; i < c2InternetData.length; i++){
            country2InternetArr.push(new Array(Number(c2InternetData[i].date), Number(c2InternetData[i].value)));
          }

          /*$.each(, function(data){
            console.log(data);
          });*/

          console.log('TEST Mobile');

          var c1CellData = country1MobileData[0][1];
          var c2CellData = country2MobileData[0][1];


          for(var i=0; i < c1CellData.length; i++){
            country1CellArr.push(new Array(Number(c1CellData[i].date), Number(c1CellData[i].value)));
          }

          for(var i=0; i < c2CellData.length; i++){
            country2CellArr.push(new Array(Number(c2CellData[i].date), Number(c2CellData[i].value)));
          }

          console.log(country2CellArr);

           $(".chartHeader").css("display","block");

           $(".chartContent").css("display","block");



          $.plot($("#netChart"), [{data:country1InternetArr,color:"#4BB827", label:country1},
            {data:country2InternetArr, color:"#D87F1B",label:country2}], {points:{show:true}, lines:{show:true}});

          $.plot($("#cellChart"), [{data:country1CellArr,color:"#4BB827", label:country1},
            {data:country2CellArr, color:"#D87F1B", label:country2}], {points:{show:true}, lines:{show:true}});




        });


      });


})
