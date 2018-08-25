var Nightmare = require('nightmare'),
  vo = require('vo'),
  nightmare = Nightmare({
        show: false,
       webPreferences: {
                webaudio: false,
                images: false,
                plugins: false,
                webgl: false
        }

  });

var run = function*(json) {
  //declare the result and wait for Nightmare's queue defined by the following chain of actions to complete
  var result = yield nightmare
  .useragent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36")
  .goto("https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1507048151&rver=6.7.6643.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f&lc=1036&id=292841&mkt=fr-fr")
  .type('input[name="loginfmt"]', json['from'])
  .type('input[name="passwd"]', json['password'])
  .click('input[type="submit"]')
  .wait(1000)
  .click('input[type="submit"]')
  .wait(10000)
  .click('button[autoid="_fce_1"]')
  .wait(3000)
  .type('input[autoid="_fp_5"]', json['email'])
  .type('input[autoid="_mcp_c"]', json['subjet'])
  .evaluate(function (json) {
      $("div._mcp_32").html(json['body'])
		return $( 'button[autoid="_mcp_g"]' ).click();
  }, json)
  .wait(1000);

  //queue and end the Nightmare instance along with the Electron instance it wraps
  yield nightmare.end();

  //return the HREF
  return result;
};

var b = new Buffer(process.argv[2], 'base64')
var s = b.toString();

var s = JSON.parse(s)


//use `vo` to execute the generator function, allowing parameters to be passed to the generator
vo(run)(s, function(err, result) {
  if (err) {
    console.error('an error occurred: ' + err);
  }
  console.log(result);
});
