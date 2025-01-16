document.addEventListener("DOMContentLoaded", () => {
  // Get the preloader element
  const preloader = document.querySelector(".preloader");

  // Set a timeout for the duration of the animation (e.g., 2.7s + buffer time of 0.3s)
  setTimeout(() => {
    // Add the 'hidden' class to trigger the fade-out effect
    preloader.classList.add("hidden");

    // After the fade-out transition, hide the preloader and show the next div
    setTimeout(() => {
      // Hide the preloader completely by setting display to 'none'
      preloader.style.display = "none";

      // Show the next div (replace '.next-div' with the actual class or id of the next content div)
      const nextDiv = document.querySelector(".next-div");
      if (nextDiv) {
        nextDiv.style.display = "block";
      }
    }, 500); // This timeout matches the fade-out transition time (500ms)
  }, 4000); // Timeout time should match the total animation duration (2.7s + 0.3s buffer)
});

$(function () {
  /*
   **********************************************************
   ***    First some setup:                               ***
   ***    Create the answers that the users will drag     ***
   ***    to the appropriate categories.                  ***
   ***    No need to change the "order"                   ***
   ***    element as it is just a placeholder - order     ***
   ***    is randomized later.                            ***
   **********************************************************
   */
  var answers = [
    {
      text: "be honest",
      order: "1",
    },
    {
      text: "makes perfect",
      order: "2",
    },
    {
      text: "we become experts",
      order: "3",
    },
  ];

  //   {
  //     "text":   "Asparagus",
  //     "order":  "5"
  //   }, {
  //     "text":   "Corn",
  //     "order":  "6"
  //   }, {
  //     "text":   "Windows",
  //     "order":  "7"
  //   }, {
  //     "text":   "Linux",
  //     "order":  "8"
  //   }, {
  //     "text":   "Android",
  //     "order":  "9"
  // }];

  /*
   **********************************************************
   ***    Now create the three categories to which the    ***
   ***    user will drag their answers                    ***
   **********************************************************
   */
  var subcontainers = [
    {
      text: "When the same tasks over and over again, ______",
      id: "fruits",
    },
    {
      text: "Have a positive mindset and ______",
      id: "vegetables",
    },
    {
      text: "Practice ______",
      id: "neverpresent",
    },
  ];

  /*
   **********************************************************
   ***    Now define which answers belong in which        ***
   ***    categories. The numbers here (i.e. the 3 in     ***
   ***    answer3, etc) are derived from the 'order'      ***
   ***    element of the answers[] array.                 ***
   **********************************************************
   */
  var fruits_correct = new Array("answer3");
  var veggies_correct = new Array("answer1");
  var os_correct = new Array("answer2");

  /*
   **********************************************************
   ***    NOTE!!! The names of the *_correct arrays and   ***
   ***    the subcontainer ids also have to be changed    ***
   ***    down at the bottom of the score_game()          ***
   ***    function. If anyone wants to help me            ***
   ***    abstract that so they only need to be set       ***
   ***    once, here at the top of the document, that     ***
   ***    would be great.                                 ***
   **********************************************************
   */

  reset_game(); // this initializes the game

  $("#game_container_23 #button_container_23 #reset_button_23").click(function () {
    reset_game();
  });

  $("#game_container_23 #button_container_23 #check_button_23").click(function () {
    $("#game_container_23 .qanswer")
      .promise()
      .done(function () {
        // promise().done() waits for any animations to complete before firing the function
        score_game(); // this is necessary because any divs that have not yet finished the "drop" animation will not be scored
      });
  });

  $("#game_container_23 #ok_button_23").click(function () {
    $("#game_container_23 #message_23")
      .animate(
        {
          width: "0",
          height: "0",
          padding: "0",
          opacity: 0,
        },
        1000
      )
      .hide(1000);
  });

  function reset_game() {
    // empty the divs
    $("#game_container_23 #draggable_container_23").html("").removeClass();
    $("#game_container_23 #droppable_container_23").html("");

    // enable the "check" button
    $("#game_container_23 #check_button_23").removeAttr("disabled");

    // hide the incomplete message_23 and the game score if they are showing
    $("#game_container_23 #message_23").hide();
    $("#game_container_23 #score_container").hide();

    // now place the answer containers on the page and make them accept the dragged answers from above
    for (var j = 0; j < 3; j++) {
      $("<div><strong>" + subcontainers[j].text + "</strong></div>")
        .attr("class", "subcontainer")
        .attr("id", subcontainers[j].id)
        .appendTo("#game_container_23 #droppable_container_23")
        .sortable({
          containment: "#game_container_23",
          cursor: "move",
          items: "div",
          revert: 250,
          connectWith: "#game_container_23 .subcontainer",
          receive: function (event, ui) {
            if (ui.item.parents("#game_container_23 .subcontainer")) {
              ui.item.removeClass("dragthis").addClass("dropped");
            } else {
              ui.item.removeClass("dropped").addClass("dragthis");
            }
          },
        })
        .disableSelection();
    }

    // randomize the order of the answer divs
    answers.sort(function () {
      return Math.round(Math.random()) - 0.5;
    });

    // place them on the page and make them sortable
    for (var i = 0; i < answers.length; i++) {
      $("<div>" + answers[i].text + "</div>")
        .attr("id", "answer" + answers[i].order)
        .attr("class", "dragthis qanswer")
        .appendTo("#game_container_23 #draggable_container_23")
        .disableSelection();
    }
    $("#game_container_23 #draggable_container_23")
      .sortable({
        connectWith: "#game_container_23 .subcontainer",
        containment: "#game_container_23",
        cursor: "move",
        items: "div",
        revert: 250,
      })
      .disableSelection();
  }

  function score_game() {
    // check to see if they are finished
    // do this by making sure that #draggable_container_23 is empty
    if (!$("#game_container_23 #draggable_container_23").is(":empty")) {
      // it's not empty! it would be madness to try to calculate this score.

      // fill the message_23 div with text accordingly
      $("#game_container_23 #message_23 #text").html(
        "The game is not complete! Please drag all the answers"
      );

      // now we'll animate it growing and appearing. neato
      $("#game_container_23 #message_23")
        .show()
        .css({
          top: $("#game_container_23 #droppable_container_23").position().top - 50,
          left: $("#game_container_23 #droppable_container_23").position().left + 100,
        })
        .animate(
          {
            width: "450px",
            height: "80px",
            padding: "20px",
            opacity: 1,
          },
          500
        );

      // you don't get a score yet. stop here.
      return;
    }

    // if we got this far, it means each draggable has been dragged to one of the containers.

    // make the items no longer sortable by disabling them
    $("#game_container_23 .subcontainer").each(function (index) {
      $(this).sortable("option", "disabled", true);
    });

    // also disable the "check" button
    $("#game_container_23 #button_container_23 #check_button_23").attr(
      "disabled",
      "disabled"
    );

    // go through each and see if it's in the right place
    $correctcounter = 0; // keep track of how many are right
    $("#game_container_23 .dropped").each(function (index) {
      $thisid = $(this).attr("id"); // shortcuts
      $parentid = $(this).parent().attr("id");
      $(this).css("cursor", "default"); // UI helper to help the user know the elements are no longer draggable
      if (
        // big long if statement to see if the element is in the right place
        ($.inArray($thisid, fruits_correct) > -1 && $parentid == "fruits") ||
        ($.inArray($thisid, veggies_correct) > -1 &&
          $parentid == "vegetables") ||
        ($.inArray($thisid, os_correct) > -1 && $parentid == "neverpresent")
      ) {
        $(this).addClass("correct", 800).removeClass("dropped", 800); // it's in the right place - make it all green and happy
        $correctcounter++; // +1 to the counter of correct answers
      } else {
        $(this).addClass("incorrect", 800).removeClass("dropped", 800); // it's in the wrong place - make it all red and sad
      }
    });

    // tell the user their score, we'll use the heretofore hidden #score_container div for that.
    $("#game_container_23 #score_container #score_text").html(
      'You got <span class="score">' +
        $correctcounter +
        "</span> out of 3 correct!"
    );
    $("#game_container_23 #score_container").slideDown(500);
  }
});
