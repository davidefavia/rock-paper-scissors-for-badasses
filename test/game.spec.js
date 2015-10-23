beforeEach(module('app'));

describe('Game specs', function() {

  // p1: rock, p2: rock --> tie
  it('should tie', function() {
    inject(function(Game) {
      var r = Game.getResults('rock', 'rock');
      expect(r.player1).toBe('tie');
      expect(r.player2).toBe('tie');
    });
  });
  // p1: rock, p2: paper --> p2 wins!
  it('should win Player 2', function() {
    inject(function(Game) {
      var r = Game.getResults('rock', 'paper');
      expect(r.player1).toBe('loser');
      expect(r.player2).toBe('winner');
    });
  });
  // p1: rock, p2: scissors --> p1 wins!
  it('should win Player 1', function() {
    inject(function(Game) {
      var r = Game.getResults('rock', 'scissors');
      expect(r.player1).toBe('winner');
      expect(r.player2).toBe('loser');
    });
  });
  // p1: paper, p2: rock --> p1 wins!
  it('should win Player 1', function() {
    inject(function(Game) {
      var r = Game.getResults('paper', 'rock');
      expect(r.player1).toBe('winner');
      expect(r.player2).toBe('loser');
    });
  });
  // p1: paper, p2: paper --> tie
  it('should tie', function() {
    inject(function(Game) {
      var r = Game.getResults('paper', 'paper');
      expect(r.player1).toBe('tie');
      expect(r.player2).toBe('tie');
    });
  });
  // p1: paper, p2: scissors --> p2 wins
  it('should win Player 2', function() {
    inject(function(Game) {
      var r = Game.getResults('paper', 'scissors');
      expect(r.player1).toBe('loser');
      expect(r.player2).toBe('winner');
    });
  });
  // p1: scissors, p2: rock --> p2 wins!
  it('should win Player 2', function() {
    inject(function(Game) {
      var r = Game.getResults('scissors', 'rock');
      expect(r.player1).toBe('loser');
      expect(r.player2).toBe('winner');
    });
  });
  // p1: scissors, p2: paper --> p1 wins!
  it('should win Player 1', function() {
    inject(function(Game) {
      var r = Game.getResults('scissors', 'paper');
      expect(r.player1).toBe('winner');
      expect(r.player2).toBe('loser');
    });
  });
  // p1: scissors, p2: scissors --> tie
  it('should win Player 1', function() {
    inject(function(Game) {
      var r = Game.getResults('scissors', 'scissors');
      expect(r.player1).toBe('tie');
      expect(r.player2).toBe('tie');
    });
  });


});
