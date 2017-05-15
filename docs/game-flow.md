# Game process flow

The messages sent from the moment the lobby host clicks "Start game" to the
moment the game ends by the host clicking "End game" or when the game time runs
out.

Includes sending the scores.

|Actor          |Message            |Direction          |Comments                           |
|---------------|-------------------|-------------------|-----------------------------------|
|host           |`lobby:start`      |Client → Server    |                                   |
|all            |`lobby:standby`    |Server → Client    |                                   |
|all            |`game:join`        |Client → Server    |                                   |
|all            |`game:start`       |Server → Client    | Sent on start time, **volatile**  |
|all            |`game:info`        |Server → Client    | Automatically sent                |
|tagging player |`game:tag`         |Client → Server    |                                   |
|tagged player  |`game:tagged`      |Server → Client    | **volatile**                      |
|tagging player |`game:target`      |Server → Client    | Contains `target` from info       |
|tagged player  |`game:revive`      |Server → Client    | **volatile**                      |
|host           |`game:complete`    |Client → Server    |                                   |
|all            |`game:end`         |Server → Client    | **volatile**                      |
|all            |`game:results`     |Server → Client    | Contains game results             |
