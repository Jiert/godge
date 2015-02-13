
window.app = (function(){


var player,
    platforms,
    cursors,
    houses,
    timer,
    background1,
    background2,
    enemies,

    stars,
    score = 0,
    scoreText,
    
    game = new Phaser.Game(
      800, 
      600, 
      // 480,
      // 320,
      Phaser.AUTO, 
      '', 
      { 
        preload: preload, 
        create: create, 
        update: update 
      }
    );

function preload() {
    //  This sets a limit on the up-scale
    game.scale.maxWidth = 800;
    game.scale.maxHeight = 600;

    // This does something weird on desktop
    // game.scale.forceLandscape = true;

    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();



  game.load.image('background', 'assets/background.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('ball', 'assets/ball.png');
  game.load.image('house', 'assets/house.png');
  game.load.image('enemey', 'assets/enemey.png');
  game.load.spritesheet('dude', 'assets/dude2.png', 112, 150);
}


function create() {

  // We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // A simple background for our game
  background1 = game.add.sprite(0, 0, 'background');
  background2 = game.add.sprite(1744, 0, 'background');

  // The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 33, 'ground');

  // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 1);

  // This stops it from falling away when you jump on it
  ground.body.immovable = true;


  enemies = game.add.group();
  enemies.enableBody = true;

  for (var j = 0; j < 12; j++ ){
    var enemy = enemies.create(j * 70, game.world.height - 550, 'enemy');
  }



  // Village
  houses = game.add.group();
  houses.enableBody = true;

  for (var j = 0; j < 12; j++ ){
    var house = houses.create(j * 70, game.world.height - 83, 'house');
  }

  // Now let's create two ledges
  // var ledge = platforms.create(400, 400, 'ground');
  // ledge.body.immovable = true;

  // ledge = platforms.create(-150, 250, 'ground');
  // ledge.body.immovable = true;

  // The player and its settings
  player = game.add.sprite(112, game.world.height - 300, 'dude');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 5200;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  // player.animations.add('left', [0, 1, 2, 3], 10, true);
  // player.animations.add('right', [5, 6, 7, 8], 10, true);
  player.animations.add('left',  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 30, true);
  player.animations.add('right', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 30, true);

  // Trying to randomly generate balls
  // game.time.events.loop(Phaser.Timer.SECOND * 2, createBall, this);
  game.time.events.loop(Phaser.Timer.SECOND * Math.random(), createBall, this);

  timer = game.time.create(false);
  timer.start();

  //  Finally some stars to collect
  balls = game.add.group();

  // //  We will enable physics for any star that is created in this group
  balls.enableBody = true;

  // //  Here we'll create 12 of them evenly spaced apart
  // for (var i = 0; i < 12; i++) {
  //   //  Create a star inside of the 'stars' group
  //   var ball = balls.create(i * 70, 0, 'ball');

  //   //  Let gravity do its thing
  //   ball.body.gravity.y = 300;

  //   //  This just gives each star a slightly random bounce value
  //   ball.body.bounce.y = 0.7 + Math.random() * 0.2;
  // }

    // The score
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  // Our controls.
  cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {

  // console.log('update')
  // debugger;

  //  Collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(balls, platforms);
  // game.physics.arcade.collide(balls, player);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  game.physics.arcade.overlap(player, balls, collectStar, null, this);


  // When balls hit village, kill both
  game.physics.arcade.overlap(houses, balls, collectHouse, null, this);


  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    //  Move to the left  
    // player.body.velocity.x = -150;
    player.body.velocity.x = -500;

    player.animations.play('left');
  }
  else if (cursors.right.isDown) {
    //  Move to the right
    // player.body.velocity.x = 150;


    if (player.position.x >= 600 && background1.position.x >= - 944){

      // debugger;

      moveBackground(background1);
      player.animations.play('right');

    }
    else {
      player.body.velocity.x = 500;
      player.animations.play('right');
    }


  }
  else {
    //  Stand still
    player.animations.stop();

    player.frame = 12;
  }
  
  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -1500;
  }

  // debugger;

  // moveBackground(background1);
  // moveBackground(background2);
}

function moveBackground(background){
  if (background.x > 1744) {
    background.x = -1744;
    background.x -= 7;
  } else {}
    background.x -=7;
}

function createBall(){

  //   Experimenting with getting enemies to create the ball
  //   //  Create a star inside of the 'stars' group
  //   var ball = balls.create(i * 70, 0, 'ball');

  //   //  Let gravity do its thing
  //   ball.body.gravity.y = 300;

  //   //  This just gives each star a slightly random bounce value
  //   ball.body.bounce.y = 0.7 + Math.random() * 0.2;




  // var ball = balls.create(game.world.randomX, 0, 'ball');
  
  // ball.body.gravity.y = 300;
  // ball.body.bounce.y = 0.7 + Math.random() * 0.2;

}

function collectHouse(house, ball){
  ball.kill();
  house.kill();

}

function collectStar (player, star) {
    
  // Removes the star from the screen
  star.kill();

  //  Add and update the score
  score += 10;
  scoreText.text = 'Score: ' + score;

}

return {
  game: game,
  player: player
};

})();