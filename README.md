# RPS-Multiplayer

Requirements: "Create a multiplayer rock-paper-scissors game using a Firebase database. Only two players may play at once. Must keep score and have basic chat functionality."

My approach was largely dictated by the limitations of Firebase, and the difficulty of working with its randomly generated user keys without requiring user authentication. I had to account for players coming and going during all states of play, and how that may interfere with the application's functionality. Roughly 80% of the code is dedicated to monitoring user movement, rather than the gameplay.

Technologies used: HTML, CSS, JS, JQuery, Bootstrap, Firebase
