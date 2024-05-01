// espruino tune

function play(song) {
  tune = song || tune;
  stop();
  interval = setInterval(step, speed);
}

first = 'gggg  gggg  AAAA  AAAA  gggAAAgggfffeeeeecccccc';
second = 'ffff  ffff  ffff  dddddd fffffff  fffffff     AAAA  gggg  ffff  eeee  ddddddd  ccccccc';
verse = first + ' ' + first + ' ' + second + '     ';
play(verse + verse);
