$(document).ready(function() {
  $('#sacrttime').hide();
  $('#spinner').show();
	navigator.geolocation.getCurrentPosition(init, error);
});
function error(msg) {
	//console.log(msg);
}
function init(a) {
	myCommute.lat = a.coords.latitude;
  myCommute.lng = a.coords.longitude;
  myCommute.getNearestStation();
}
var meta = [];
var myCommute = {
	lat:"",
	lng:"",
	R: 6371, // Earth's radius in km
	mi: 0.621371192, // 1 km in mile
	closeststation:"",
	distancetocloseststation:0,
	UP:[],
	DN:[],
  epochTime:[],
	routes:[],
  distances:[],
  names:[],
	STATIONS : {
		blueline : {
			watt : { name: "Watt Ave & I-80", lat: 38.644922, lng: -121.384812, up: 2, dn: 11, r: 533 },
			marc : { name: "Auburn Blvd & Marconi Ave", lat: 38.621087, lng: -121.425055, up: 3, dn: 10, r: 533 },
			ardn : { name: "Arden Way & Del Paso Blvd", lat: 38.606316, lng: -121.457376, up: 4, dn: 9, r: 533 },
			rose : { name: "St Rose of Lima Park", lat: 38.579960, lng: -121.498007, up: 5, dn: 8, r: 533 },
			ond8 : { name: "8th St & O St ", lat: 38.575579, lng: -121.498680, up: 6, dn: 7, r: 533 },
			one6 : { name: "16th St", lat: 38.569773, lng: -121.489018, up: 7, dn: 6, r: 533 },
			city : { name: "City College", lat: 38.550966, lng: -121.488002, up: 8, dn: 5, r: 533 },
			frut : { name: "Fruitridge Rd", lat: 38.525188, lng: -121.479969, up: 9, dn: 4, r: 533 },
			flrn : { name: "Florin Rd", lat: 38.497317, lng: -121.471467, up: 10, dn: 3, r: 533 },
			mead : { name: "Meadowview Rd", lat: 38.482687, lng: -121.466981, up: 11, dn: 2, r: 533 }
		},
  // Up = To Folsom
  // Dn = To Sacramento Valley Station
		goldline : {
			sact : { name: "Sacramento Valley Station", lat: 38.584323, lng: -121.499307, up: 1, dn: 14, r: 507 },
			ond8 : { name: "8th St & O St", lat: 38.575579, lng: -121.498680, up: 3, dn: 12, r: 507 },
			one6 : { name: "16th St", lat: 38.569773, lng: -121.489018, up: 5, dn: 10, r: 507 },
			two9 : { name: "29th St", lat: 38.564317, lng: -121.470550, up: 6, dn: 9, r: 507 },
			six5 : { name: "University Ave & 65th St", lat: 38.552300, lng: -121.426566, up: 8, dn: 7, r: 507 },
			mnlv : { name: "Watt Ave & Manlove Rd", lat: 38.554066, lng: -121.372654, up: 10, dn: 5, r: 507 },
			mthr : { name: "Mather Field Rd", lat: 38.584973, lng: -121.310611, up: 11, dn: 4, r: 507 },
			snrs : { name: "Sunrise Blvd", lat: 38.606965, lng: -121.266108, up: 12, dn: 3, r: 507 },
			hazl : { name: "Hazel Ave", lat: 38.630621, lng: -121.211678, up: 13, dn: 2, r: 507 },
			flsm : { name: "Folsom Blvd & Iron Point Rd", lat: 38.644967, lng: -121.189683, up: 14, dn: 1, r: 507 }
		}
	},
	// Functions
	getNearestStation: function(){
		var d, elat=0, elng=0, ename, s, e;
    $.each(myCommute.STATIONS, function(i,e){
      $.each(e, function(n, t){
        elat = t.lat;
        elng = t.lng;
        ename = t.name;
        d = myCommute.getDistance(elat, elng); // distance to station from current location
        myCommute.distances.push(d);
        myCommute.names.push(ename);
      });
    });
    //console.log(myCommute.distances);
    s = myCommute.distances.min().toFixed(2);
    //alert(s);
    myCommute.distancetocloseststation = (s * myCommute.mi).toFixed(2);
    e = myCommute.distances.indexOf((s.toString()));
    //alert(e);
    myCommute.closeststation = myCommute.names[e]; // use that index to get the name of the station
    //console.log(myCommute.closeststation, myCommute.distancetocloseststation);
    myCommute.getTrainArrivalTime();    
  },
	getTrainArrivalTime: function(){
		var eup, edn, er, up=[], dn=[], r=[], t=[];
    myCommute.UP = [];
    myCommute.DN = [];
    myCommute.epochTime = [];
    myCommute.routes = [];
		$.each(myCommute.STATIONS, function(i, e){
			$.each(e, function(n, x){
				if (x.name === myCommute.closeststation) {
					eup = x.up;
					edn = x.dn;
					er = x.r;
					//console.log(er);
					up.push(eup); //yql td column -> to downtown
					dn.push(edn); //yql td column -> from downtown
					r.push(er); //route number
          myCommute.routes = r;
				}
			});
		});
		//console.log(myCommute.routes);
		switch(new Date().getUTCDay()){
			case 0: // Sunday
				t = [6, 5]; break;
			case 6: // Saturday
				t = [4, 3]; break;
			default: // Weekday
				t = [2, 1]; break;
		}
		if (r.length > 1) {
			yql1="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.sacrt.com%2Fschedules%2Fcurrent%2Froutes%2FR" + r[0] + ".htm%22%20and%20xpath%3D'%2F%2Ftable%5B" + t[0] + "%5D%2Ftr%2Ftd%5B" + up[0] + "%5D%2Fp'&format=json&callback=?";
			yql2="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.sacrt.com%2Fschedules%2Fcurrent%2Froutes%2FR" + r[0] + ".htm%22%20and%20xpath%3D'%2F%2Ftable%5B" + t[1] + "%5D%2Ftr%2Ftd%5B" + dn[0] + "%5D%2Fp'&format=json&callback=?";
			yql3="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.sacrt.com%2Fschedules%2Fcurrent%2Froutes%2FR" + r[1] + ".htm%22%20and%20xpath%3D'%2F%2Ftable%5B" + t[0] + "%5D%2Ftr%2Ftd%5B" + up[1] + "%5D%2Fp'&format=json&callback=?";
			yql4="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.sacrt.com%2Fschedules%2Fcurrent%2Froutes%2FR" + r[1] + ".htm%22%20and%20xpath%3D'%2F%2Ftable%5B" + t[1] + "%5D%2Ftr%2Ftd%5B" + dn[1] + "%5D%2Fp'&format=json&callback=?";
			//execute yqls
			myCommute.execYQL(yql1, function(){
				var t1 = "";
				t1 += this;
				myCommute.UP.push(t1)
				//console.log(myCommute.UP);
				myCommute.execYQL(yql2, function(){
					var t2 = "";
					t2 += this;
					myCommute.DN.push(t2)
					//console.log(myCommute.DN);
					myCommute.execYQL(yql3, function(){
						var t3 = "";
						t3 += this;
						myCommute.UP.push(t3)
						//console.log(myCommute.UP);
						myCommute.execYQL(yql4, function(){
							var t4 = "";
							t4 += this;
							myCommute.DN.push(t4)
              myCommute.render();
							//console.log(myCommute.DN);
						});
					});
				});
			});
		} else {
			yql1="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.sacrt.com%2Fschedules%2Fcurrent%2Froutes%2FR" + 507 +".htm%22%20and%20xpath%3D'%2F%2Ftable%5B" + t[0] + "%5D%2Ftr%2Ftd%5B" + up[0] + "%5D%2Fp'&format=json&callback=?";
			yql2="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.sacrt.com%2Fschedules%2Fcurrent%2Froutes%2FR" + 507 +".htm%22%20and%20xpath%3D'%2F%2Ftable%5B" + t[1] + "%5D%2Ftr%2Ftd%5B" + dn[0] + "%5D%2Fp'&format=json&callback=?";
			//execute yqls
			myCommute.execYQL(yql1, function(){
        //alert("yql1");
				var t1 = "";
				t1 += this;
				myCommute.UP.push(t1)
				//console.log(myCommute.UP);
				myCommute.execYQL(yql2, function(){
          //alert("yql2");
					var t2 = "";
					t2 += this;
					myCommute.DN.push(t2)
					//console.log(myCommute.DN);
					myCommute.render();
				});
			});
		} // end r.length if-else
	},
	render: function() {
   //alert("meta");
    meta = [];
    var r, route, from, to, time;
    //console.log(myCommute.UP,myCommute.DN,myCommute.routes,myCommute.epochTime,myCommute.closeststation);
    $('.station').remove();
    $('.stub-top').append('<p class="station allcaps league">'+myCommute.closeststation+'</p>');
    $.each(myCommute.UP, function(i,v){
      r = myCommute.routes[i];
      t = myCommute.epochTime[2*i];
      route = r===533 ? 'blue' : 'gold';
      to = r===533 ? 'Meadowview Rd' : 'Folsom';
      time = myCommute.getCount(t);
      eta = ((t.toLocaleTimeString()).slice(0,5)).slice(-1) === ":" ? (t.toLocaleTimeString()).slice(0,4) + ' ' + (t.toLocaleTimeString()).slice(-2) : (t.toLocaleTimeString()).slice(0,5) + ' ' + (t.toLocaleTimeString()).slice(-2)
      meta.push({route:route,to:to,eta:eta,mins:time.min,secs:time.sec,index:(2*i)});
    });
    $.each(myCommute.DN, function(x,y){
      r = myCommute.routes[x];
      t = myCommute.epochTime[2*x+1];
      route = r===533 ? 'blue' : 'gold';
      to = r===533 ? 'Watt Ave & I-80' : 'Sacramento';
      time = myCommute.getCount(t);
      eta = ((t.toLocaleTimeString()).slice(0,5)).slice(-1) === ":" ? (t.toLocaleTimeString()).slice(0,4) + ' ' + (t.toLocaleTimeString()).slice(-2) : (t.toLocaleTimeString()).slice(0,5) + ' ' + (t.toLocaleTimeString()).slice(-2);
      meta.push({route:route,to:to,eta:eta,mins:time.min,secs:time.sec,index:(2*x+1)});
    });
    //console.log(meta);
    //Render using jsRender
    $('#stublist').empty().remove();
    $('.schedule').find('.twelve').append('<div id="stublist"></div>');
    $('#spinner').fadeOut('fast', function(){
      $('#stublist').html(
        $('#stubs').render(meta)
      );
      $('#sacrttime').fadeIn('slow');
    });
    myCommute.updateTime();
	},
  updateTime: function() {
    var min, sec, m, s;
    var refresh = setInterval(function(){
      $('.stub-bottom').find('ul').each(function(index){
        z = index;
        min = z===0 ? $('.min').html().slice(0,2) : $('.min'+z).html().slice(0,2);
        sec = z===0 ? $('.sec').html().slice(0,2) : $('.sec'+z).html().slice(0,2);
        if (sec==0 && min==0) {
          clearInterval(refresh);
          myCommute.UP = [];
          myCommute.DN = [];
          myCommute.epochTime = [];
          myCommute.routes = [];
          //console.log(myCommute.UP,myCommute.DN,myCommute.epochTime,myCommute.routes)
          $('#stublist').empty().remove();
          myCommute.getTrainArrivalTime();
        } else {
          if (sec == 0) {--min; sec=60;}
          --sec;
          min == 1 ? m="Minute" : m="Minutes";
          sec == 1 ? s="Second" : s="Seconds";
          z===0 ? $('.min').html(min + " <span>" + m + "</span>") : $('.min'+z).html(min + " <span>" + m + "</span>");
          z===0 ? $('.sec').html(sec + " <span>" + s + "</span>") : $('.sec'+z).html(sec + " <span>" + s + "</span>");
        }
      });
    },1000);
  },
	// Helper Functions
	execYQL: function(yql, cb){
		var now = new Date(), t=0, d, c, r;
		$.getJSON(yql, function(cbfunc){
			$(cbfunc.query.results.p).each(function(i,e){
        d = myCommute.getArrivalTime(e);
        if (d > now) {
          if(t===0) {t=1;r=c;myCommute.epochTime.push(d);if(cb && typeof(cb)=="function"){cb.call(r);}}
        }
			});
		});
	},
	getDistance: function(elat, elng) {
		var dlat=0, dlng=0, mlat=0, rlat=0, a=0, c=0, distance=0;
		dlat = (elat - myCommute.lat).toRad();
		dlng = (elng - myCommute.lng).toRad();
		mlat = myCommute.lat.toRad();
		rlat = elat.toRad();
		// FORMULA SOURCE: http://www.movable-type.co.uk/scripts/latlong.html
		a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.sin(dlng/2) * Math.sin(dlng/2) * Math.cos(mlat) * Math.cos(rlat);
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		distance = (myCommute.R * c).toFixed(2);
		return distance;
	},
	getArrivalTime: function(c){
    var ap, ch, cm, h, m, n=new Date(), d;
		ap=c.substr(-1);
		ch=c.split(":")[0];
		cm=c.split(":")[1].substr(0,2);
		if (ap==='p') {h=parseInt(ch)+12} else {h=parseInt(ch)}
		if (h==24) {h=0}
		m=parseInt(cm);
		d=new Date(n.getFullYear(),n.getMonth(),n.getDate(),h,m,0);
		return d;
	},
  getCount: function(c){
    var now=new Date(),diff,mins,secs;
    diff = c - now;
    delete now;
    diff = Math.floor(diff/1000);
    mins = Math.floor(diff/60);
    mins < 10 ? '0' + mins : mins;
    secs = Math.floor(diff%60);
    secs < 10 ? '0' + secs : secs;
    return {min:mins, sec:secs};
  }
};
if (typeof(Number.prototype.toRad) === "undefined") {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
}
if (typeof(Array.prototype.min) === "undefined") {
  Array.prototype.min = function() {
    return Math.min.apply(Math, this);
  }
}