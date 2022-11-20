// Start Crafty
window.onload = function () {

    // Variables
    var backgroundColor = "#dbdbdb";
    var paddleWidth = 100;
    var paddleHeight = 16;            // Asset size
    var ballRadius = 16;              // Asset size
    let nbr = 0;                      // For counting background tiles
    let players = 0;                  // For setting 1 or 2 players mode
    var menuTextColor = "#2F3943";
    var pointsPlayer = 0;
    var pointsComputer = 0;

    // Assets
    var assetsObj = {
      "audio": {
        "hit": ["sound/hit.mp3", "sound/hit.ogg"],
        "hit2": ["sound/hit2.mp3", "sound/hit2.ogg"],
        "lose": ["sound/lose_effect.mp3","sound/lose_effect.ogg"],
        "win": ["sound/win_effect.mp3", "sound/win_effect.ogg"],
        "bgaudio": "sound/Powerup.mp3"
      },
      "sprites": {
        "images/pong_sprites.png": {
          tile: 16,
          tileh: 16,
          map: {
            floor0: [0, 0, 1, 1],
            floor1: [0, 1, 1, 1],
            floor2: [1, 1, 1, 1],
            wall1: [6, 0, 1, 1],
            wall2: [7, 0, 1, 1],
            ball0: [2, 1, 1, 1],
            toppaddle: [0, 2, 4, 1],
            bottompaddle: [0, 3, 4, 1]
          }
        }
      }
    };

    // ---------------- Define Main Menu scene ----------------

    Crafty.defineScene("mainMenu", function() {

      // Create main menu text
      Crafty.e("menuText, 2D, Canvas, Text")
            .attr({            
              x: 160,
              y: 75,
              w: 100,
              h: 100
            })
            .text("MAIN MENU")
            .textAlign("center")
            .textFont({
              size: "40px",
              weight: "bold"
            })
            .textColor(menuTextColor);

      // Create win or lose text
      Crafty.e("statusText, 2D, Canvas, Text")
            .attr({            
              x: 160,
              y: 150,
              w: 300,
              h: 100
            })
            .text("Pong game")
            .textAlign("center")
            .textColor(menuTextColor)
            .textFont({
              size: "15px",
              weight: "bold"
            })
            // Reset text when game ends
            .bind("EnterFrame", function () {
              // If enemy wins
              if (pointsComputer == 10) {
                this.textColor("red");
                this.text("You lose!");
              }
              // If player wins
              else if (pointsPlayer == 10) {
                this.textColor("#2FB843");
                this.text("You win!");
              }

              // Reset points
              pointsPlayer = 0;
              pointsComputer = 0;
            });

      // Create controls texts
      Crafty.e("controlsText1, 2D, Canvas, Text")
            .attr({
              x: 160,
              y: 400,
              w: 100,
              h: 20
            })
            .text("Bottom player movement: left arrow and right arrow")
            .textAlign("center")
            .textFont({
              size: "12px"
            })
            .textColor(menuTextColor)
      Crafty.e("controlsText2, 2D, Canvas, Text")
            .attr({
              x: 160,
              y: 430,
              w: 100,
              h: 20
            })
            .text("Top player movement (2 player mode): A and D")
            .textAlign("center")
            .textFont({
              size: "12px"
            })
            .textColor(menuTextColor)

      // Create 1 player button
      var button1 = Crafty.e("oneplayer, 2D, Canvas, Color")
            .attr({
              x: 100,
              y: 250,
              w: 120,
              h: 40
            })
            .color("white");

      // Create 1 player text
      Crafty.e("oneplayertext, 2D, Canvas, Text, Mouse")
          .attr({
            x: 120,
            y: 260,
            w: 200,
            h: 40
          })
          .text("1 Player")
          .textAlign("left")
          .textFont({
            size: "20px",
            weight: "bold"
          })
          // Change color when hover over and out text
          .bind("MouseOver", function () {
            button1.color("grey");
          })
          .bind("MouseOut", function() {
            button1.color("white");
          })
          // Start the game against computer enemy
          .bind("MouseUp", function(e) {
            if(e.mouseButton == Crafty.mouseButtons.LEFT) {
              players = 1;
              Crafty.audio.play("bgaudio", -1, 0.3);
              Crafty.enterScene("theGame");
            }
      });

      // Create 2 players button
      var button2 = Crafty.e("twoplayer, 2D, Canvas, Color")
            .attr({
              x: 100,
              y: 300,
              w: 120,
              h: 40
            })
            .color("white");

      // Create 2 players text
      Crafty.e("twoplayertext, 2D, Canvas, Text, Mouse")
          .attr({
            x: 118,
            y: 310,
            w: 200,
            h: 40
          })
          .text("2 Players")
          .textAlign("left")
          .textFont({
            size: "20px",
            weight: "bold"
          })
          // Change color when hover over and out text
          .bind("MouseOver", function () {
            button2.color("grey");
          })
          .bind("MouseOut", function() {
            button2.color("white");
          })
          // Start the game against human enemy
          .bind("MouseUp", function(e) {
            if(e.mouseButton == Crafty.mouseButtons.LEFT) {
              players = 2;
              Crafty.audio.play("bgaudio", -1, 0.3);
              Crafty.enterScene("theGame");
            }
          });
    });

    // ---------------- Define The Game scene ----------------

    Crafty.defineScene("theGame", function() {

      // Create game background from tiles
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 30; j++) {
          // For setting different tiles
          if (nbr == 3) {
            nbr = 0;
          }
          // Create 1 tile
          Crafty.e("2D, Canvas, floor" + nbr)
          .attr({
            x: i * 16,
            y: j * 16,
            w: 16,
            h: 16
          });
          nbr++;
        }
      }

      // Create computer enemy paddle if needed
      if (players == 1) {
        // Create paddle
        Crafty.e("topPaddle, Canvas, 2D, toppaddle")
        .attr({
          x: 100,
          y: 10,
          w: paddleWidth,
          h: paddleHeight
        })
        .bind("EnterFrame", function () {
          // Paddle movement towards the ball
          var gameBall = Crafty("gameBall");
          if (gameBall.ySpeed < 0) {
            if (gameBall.x < this.x + paddleWidth / 2) {
              this.x--;
            } else {
              this.x++;
            }
          }
          // Prevent paddle movement outside of game area
          if (this.x <= 0) {
            this.x = 0;
          }
          if (this.x > 320 - paddleWidth) {
            this.x = 320 - paddleWidth;
          }
        });
      }

      // Create human enemy paddle if needed
      if (players == 2) {
        Crafty.e("topPaddle, Canvas, 2D, toppaddle, Multiway")
        .attr({
          x: 100,
          y: 10,
          w: paddleWidth,
          h: paddleHeight
        })
        .multiway(50, {
          A: 180,
          D: 0
        })
        .bind("EnterFrame", function () {
          // Prevent paddle movement outside of game area
          if (this.x <= 0) {
            this.x = 0;
          }
          if (this.x > 320 - paddleWidth) {
            this.x = 320 - paddleWidth;
          }
        });
      } 

      // Create players paddle
      Crafty.e("bottomPaddle, Canvas, 2D, bottompaddle, Multiway")
        .attr({
          x: 100,
          y: 460,
          w: paddleWidth,
          h: paddleHeight
        })
        .multiway(50, {
          LEFT_ARROW: 180,
          RIGHT_ARROW: 0
        })
        .bind("EnterFrame", function () {
          // Prevent paddle movement outside of game area
          if (this.x <= 0) {
            this.x = 0;
          }
          if (this.x > 320 - paddleWidth) {
            this.x = 320 - paddleWidth;
          }
        });

      // Create ball
      Crafty.e("gameBall, 2D, Canvas, ball0, Collision")
        .attr({
          x: 150,
          y: 240,
          w: ballRadius,
          h: ballRadius,
          xSpeed: 1,
          ySpeed: 3
        })
        .bind("EnterFrame", function () {
          // Ball movement
          this.x += this.xSpeed;
          this.y += this.ySpeed;
          if (this.x <= 0 || this.x >= 320 - ballRadius) {
            this.xSpeed *= -1;
          }
          // If the ball passes enemys paddle
          if (this.y < 0) {
            Crafty.audio.play("win");
            pointsPlayer++;
            // If player wins
            if (pointsPlayer == 10) {
              Crafty.audio.stop("bgaudio");
              Crafty.enterScene("mainMenu");
            }
            // Set ball to the center of arena
            this.x = 160;
            this.y = 240;
          }
          // If the ball passes players paddle
          if (this.y > 480) {
            Crafty.audio.play("lose");
            pointsComputer++;
            // If enemy wins
            if (pointsComputer == 10) {
              Crafty.audio.stop("bgaudio");
              Crafty.enterScene("mainMenu");
            }
            // Set ball to the center of arena
            this.x = 160;
            this.y = 240;
          }
        })
        // If ball hits enemys paddle
        .onHit("topPaddle", function () {
          Crafty.audio.play("hit");
          this.ySpeed *= -1;
          this.y = 10 + ballRadius;
        })
        // If ball hits players paddle
        .onHit("bottomPaddle", function () {
          Crafty.audio.play("hit2");
          this.ySpeed *= -1;
          this.y = 460 - ballRadius;
        });

      // Create score counter text
      Crafty.e("scoreText, 2D, Canvas, Text")
        .attr({
          x: 5,
          y: 30,
          w: 100,
          h: 100
        })
        .textColor("white")
        .textFont({
          size: "10px"
        })
        .bind("EnterFrame", function () {
          this.text("You: " + pointsPlayer + " Enemy: " + pointsComputer);
        });
    });
  
// ---------------- Download assets and start the game ----------------

    // preload assets
    Crafty.load(assetsObj, 
      function () {
        console.log("Assets downloaded");
        Crafty.init(320, 480, "MainMenu");
        Crafty.background(backgroundColor);
        Crafty.enterScene("mainMenu");
      },
  
      // progress
      function (e) { 
        console.log("Loading assets");
      },
  
      // uh oh, error loading
      function (e) { 
        console.log("Error when loading assets: " + e);
      }
    );
  };