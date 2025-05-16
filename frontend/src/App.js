import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import './UnlimitedMode.css';

// Landing component for the homepage
function Landing() {
  const [hoveredZone, setHoveredZone] = useState(null);
  const navigate = useNavigate();
  
  const startGame = (mode) => {
    navigate(`/${mode}`);
  };
  
  return (
    <>
      <div className="header-content">
        <h1>&nbsp;<span className="special-i">S</span>ong<span className="special-i">S</span>ense<span className="special-i">i</span></h1>
        <p className="tagline">
          <span className="song">Song</span>, <span className="sense">Sense</span> & <span className="instinct">Instinct</span>
        </p>
      </div>
      
      <div className="landing-container">
        <div 
          className={`hover-zone left-zone ${hoveredZone === 'left' ? 'active' : ''} ${hoveredZone === 'right' ? 'blurred' : ''}`}
          onMouseEnter={() => setHoveredZone('left')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => startGame('unlimited')}
        >
          <div className="zone-content">
            <h2>Unlimited</h2>
            {hoveredZone === 'left' && (
              <div className="zone-description">
                <p>Play as many songs as you want with no limits. Choose any year and test your music knowledge at your own pace.</p>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className={`hover-zone right-zone ${hoveredZone === 'right' ? 'active' : ''} ${hoveredZone === 'left' ? 'blurred' : ''}`}
          onMouseEnter={() => setHoveredZone('right')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => startGame('daily')}
        >
          <div className="zone-content">
            <h2>Daily</h2>
            {hoveredZone === 'right' && (
              <div className="zone-description">
                <p>One new song challenge every day. Compare your score with friends and track your daily streak.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Unlimited Mode Component with Difficulty Selection
function UnlimitedMode() {
  const navigate = useNavigate();
  const [year, setYear] = useState('');
  const [difficulty, setDifficulty] = useState('medium'); // Default difficulty
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streak, setStreak] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [guessInput, setGuessInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [slideDirection, setSlideDirection] = useState('');
  const [allTitles, setAllTitles] = useState([]);
  const [randStart, setRandStart] = useState(0)
  const [playerReady, setPlayerReady] = useState(false);

  
  const MAX_GUESSES = 5;
  const PLAY_TIME = 4800;
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch song suggestions based on input
  useEffect(() => {
    const delayDoubounce = setTimeout(() => {
      if (guessInput.length > 2) {
        fetchSongSuggestions(guessInput);
      } else {
        setSuggestions([]);
      }
    },50);
    return () => clearTimeout(delayDoubounce);
  }, [guessInput]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  const playerRef = useRef(null);
  const youtubeTimerRef = useRef(null);
  const youtubeContainerRef = useRef(null);

  const loadYouTubeVideo = (videoId) => {
    // Clean up existing player if it exists
    if (playerRef.current?.destroy) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    
    // Create a fresh container for the YouTube player
    if (youtubeContainerRef.current) {
      youtubeContainerRef.current.innerHTML = '<div id="youtube-player"></div>';
    }
    
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0', // hide video
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            console.log("YouTube player ready");
            setPlayerReady(true);
          },
          onError: (e) => {
            console.error("YouTube error:", e);
            setError("Could not load YouTube video.");
          }
        }
      });
    } else {
      console.error("YouTube API not loaded yet");
    }
  };

  useEffect(() => {
    if (songData?.youtubeId) {
      loadYouTubeVideo(songData.youtubeId);
    }
  }, [songData]);

  const fetchSongSuggestions = async (input) => {
    // In a real implementation, this would be an API call
    // For demonstration, we'll create mock suggestions
    if (songData) {
      try {
        // Simulate API delay
        
        let all_songs = allTitles
        
        const correctTitle = songData.title.toLowerCase();
        const inputLower = input.toLowerCase();

        const filtered = all_songs
          .filter(title => title.toLowerCase().includes(inputLower))
          .slice(0, 5);

        if (
          correctTitle.toLowerCase().includes(inputLower) &&
          input.length >= correctTitle.length/2 &&
          !filtered.includes(correctTitle)
        ) {
          filtered[Math.floor(Math.random() * filtered.length)] = songData.title;
        }
        
        setSuggestions(filtered);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }
  };

  const handleYearSubmit = async (e) => {
    e.preventDefault();
    
    if (!year || isNaN(parseInt(year)) || parseInt(year) < 1980 || parseInt(year) > 2025) {
      setError('Please enter a valid year between 1980 and 2025');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/get_random_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: year, difficulty: difficulty}),
      });

      if (!response.ok) {
        // Try to get a more specific error message from the API
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch song');
      }
      
      const data = await response.json();
      setSongData(data);
      setGuesses([]);
      setGameStatus('playing');

      const suggestionResponse = await fetch('http://localhost:5000/api/get_song_suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, difficulty }),
      });

      const suggestionData = await suggestionResponse.json();
      setAllTitles(suggestionData.all || []);

    } catch (err) {
      // Display more specific error message if available
      setError(`Error: ${err.message || 'Failed to fetch song. Please try again.'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playFor5Seconds = () => {
    if (!playerRef.current) return;

    try {
      playerRef.current.seekTo(randStart);
      playerRef.current.playVideo();
      
      const checkPlaying = setInterval(() => {
        setIsPlaying(true);
        if (playerRef.current && playerRef.current.getPlayerState && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
          clearInterval(checkPlaying);

          // Now start the 5-second timer only when audio actually starts
          youtubeTimerRef.current = setTimeout(() => {
            if (playerRef.current && playerRef.current.pauseVideo) {
              playerRef.current.pauseVideo();
            }
            setIsPlaying(false);
          }, PLAY_TIME);
        }
      }, 100);

      // Safety timeout to clear the interval if player doesn't start
      setTimeout(() => {
        clearInterval(checkPlaying);
        if (isPlaying) setIsPlaying(false);
      }, PLAY_TIME);
    } catch (err) {
      console.error("Error playing YouTube video:", err);
      setIsPlaying(false);
    }
  };

  // Clean up everything related to YouTube player and timers
  const cleanupYouTubePlayer = () => {
    if (youtubeTimerRef.current) {
      clearTimeout(youtubeTimerRef.current);
      youtubeTimerRef.current = null;
    }
    
    if (playerRef.current?.destroy) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        console.error("Error destroying YouTube player:", err);
      }
      playerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupYouTubePlayer();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    
    if (!guessInput.trim() || guesses.includes(guessInput.trim())) return;
    
    const newGuesses = [...guesses, guessInput.trim()];
    setGuesses(newGuesses);
    setGuessInput('');
    setSuggestions([]);
    
    // Check if the guess is correct
    if (songData && guessInput.trim().toLowerCase() === songData.title.toLowerCase()) {
      setGameStatus('won');
      setStreak(streak + 1);
      setRoundsPlayed(roundsPlayed + 1);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost');
      setStreak(0);
      setRoundsPlayed(roundsPlayed + 1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setGuessInput(suggestion);
    setSuggestions([]);
    // Focus back on input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const nextSong = () => {
    setSlideDirection('slide-left');
    setIsPlaying(false);
    setPlayerReady(false);

    // Clean up the YouTube player
    cleanupYouTubePlayer();
    
    // Wait for animation before resetting state
    setTimeout(() => {
      // Reset game state
      setGuesses([]);
      setGameStatus('playing');
      setSlideDirection('');
      
      // Reuse the existing year and difficulty to fetch a new song
      handleFetchNewSong();
    }, 500);
  };
  
  // Function to fetch a new song using existing year and difficulty
  const handleFetchNewSong = async () => {
    if (!year) {
      setError('Please select a year first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/get_random_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: year, difficulty: difficulty}),
      });

      if (!response.ok) {
        // Try to get a more specific error message from the API
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch song');
      }
      
      const data = await response.json();
      setSongData(data);
      setRandStart(Math.floor(Math.random() * 31) + 10);
    } catch (err) {
      // Only set songData to null if we fail to fetch a new song
      setSongData(null);
      setError(`Error: ${err.message || 'Failed to fetch song. Please try again.'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    // Make sure to clean up before navigation
    cleanupYouTubePlayer();
    navigate('/');
  };

  // Get the color for a guess based on correctness
  const getGuessColor = (guess) => {
    if (!songData) return 'bg-gray-700';
    
    const correctTitle = songData.title.toLowerCase();
    const guessLower = guess.toLowerCase();
    
    if (guessLower === correctTitle) return 'bg-green-600';
    
    // Partial match logic
    const correctWords = correctTitle.split(' ');
    const guessWords = guessLower.split(' ');
    
    const hasCommonWords = guessWords.some(word => 
      correctWords.some(correctWord => correctWord === word && word.length > 2)
    );
    
    return hasCommonWords ? 'bg-yellow-600' : 'bg-red-600';
  };

  return (
    <div className={`game-container ${slideDirection}`}>
      <div className="game-header">
        <h1><span className="special-i">S</span>ong<span className="special-i">S</span>ense<span className="special-i">i</span></h1>
        <h5>Unlimited Mode</h5>
        
        {songData && (
          <div className="stats-bar">
            <div className="streak">
              <span>Streak:</span> {streak}
            </div>
            <div className="rounds">
              <span>Rounds:</span> {roundsPlayed}
            </div>
            <div className="guesses-left">
              <span>Guesses:</span> {MAX_GUESSES - guesses.length}/{MAX_GUESSES}
            </div>
          </div>
        )}
      </div>

      {songData ? (
        <div className={`game-area ${slideDirection}`}>
          <h2>Guess the Song!</h2>
          
          <div className="difficulty-display">
            <p>Difficulty: <span className={`difficulty-badge ${songData.difficulty}`}>{songData.difficulty}</span></p>
          </div>
          
          <div ref={youtubeContainerRef} className="youtube-container">
            <div id="youtube-player" style={{ display: 'none' }}></div>
          </div>
          
          <div className="song-player">
            {songData && (
              <audio 
                ref={audioRef}
                src={songData.youtubeId} 
                onError={() => setError("Error loading audio. Please try another song.")}
                className="hidden-audio"
              />
            )}
            <div className="audio-controls">
              <button 
                className="play-button" 
                onClick={playFor5Seconds}
                disabled={!playerReady || isPlaying || gameStatus !== 'playing'}
              >
                {isPlaying ? 'Playing...' : 'Play 5-Second Clip'}
              </button>
              {isPlaying && (
                <div className="progress-bar">
                  <div className="progress"></div>
                </div>
              )}
            </div>
          </div>
          
          {gameStatus === 'playing' ? (
            <div className="guess-area">
              <form onSubmit={handleGuessSubmit} className="guess-form">
                <input
                  ref={inputRef}
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="Enter your guess"
                  className="guess-input"
                  autoComplete="off"
                  disabled={gameStatus !== 'playing'}
                />
                <button 
                  type="submit" 
                  className="guess-button"
                  disabled={!guessInput.trim()}
                >
                  Guess
                </button>
                
                {suggestions.length > 0 && (
                  <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="suggestion"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="result-area">
              <div className={`result-message ${gameStatus === 'won' ? 'won' : 'lost'}`}>
                {gameStatus === 'won' ? (
                  <h5>You got it right!</h5>
                ) : (
                  <h5>Better luck next time!</h5>
                )}
                <div className="song-details">
                  <p className="song-title">{songData.title}</p>
                  <p className="song-movie">From: {songData.movie}</p>
                  <p className="song-difficulty">Difficulty: <span className={`difficulty-badge ${songData.difficulty}`}>{songData.difficulty}</span></p>
                </div>
              </div>
              
              <button onClick={nextSong} className="next-button">
                Next Song
              </button>
            </div>
          )}
          
          <div className="guesses-list">
            {guesses.map((guess, index) => (
              <div 
                key={index} 
                className={`guess-item ${getGuessColor(guess)}`}
              >
                <span>{guess}</span>
                <span className="guess-number">#{index + 1}</span>
              </div>
            ))}
          </div>
          
          {gameStatus === 'playing' && (
            <div className="guesses-left-indicator">
              <div className="guess-dots">
                {Array.from({ length: MAX_GUESSES }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`guess-dot ${index < guesses.length ? 'used' : ''}`}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="year-selection">
          <form onSubmit={handleYearSubmit}>
            <label htmlFor="yearInput">
              Enter a year (songs will be from before this year):
            </label>
            <input
              id="yearInput"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1980"
              max="2025"
              required
            />
            
            <div className="difficulty-selection">
              <label>Select difficulty level:</label>
              <div className="difficulty-options">
                <div 
                  className={`difficulty-option easy ${difficulty === 'easy' ? 'selected' : ''}`} 
                  onClick={() => setDifficulty('easy')}
                >
                  Easy
                </div>
                <div 
                  className={`difficulty-option medium ${difficulty === 'medium' ? 'selected' : ''}`} 
                  onClick={() => setDifficulty('medium')}
                >
                  Medium
                </div>
                <div 
                  className={`difficulty-option hard ${difficulty === 'hard' ? 'selected' : ''}`} 
                  onClick={() => setDifficulty('hard')}
                >
                  Hard
                </div>
                <div 
                  className={`difficulty-option extreme ${difficulty === 'extreme' ? 'selected' : ''}`} 
                  onClick={() => setDifficulty('extreme')}
                >
                  Extreme
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'START'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
      
      <button className="back-button" onClick={goBack}>
        Back to Home
      </button>
    </div>
  );
}

// Daily Challenge Component (simplified for now)
function DailyChallenge() {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate('/');
  };
  
  return (
    <div className="game-container">
      <div className="game-header">
        <h1>&nbsp;<span className="special-i">S</span>ong<span className="special-i">S</span>ense<span className="special-i">i</span></h1>
        <h5>Daily Challenge</h5>
      </div>
      
      <div className="game-area">
        <h2>Today's Challenge</h2>
        <p>The daily challenge will be implemented soon!</p>
        <p>Check back tomorrow for a new song challenge.</p>
      </div>
      
      <button className="back-button" onClick={goBack}>
        Back to Home
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/unlimited" element={<UnlimitedMode />} />
            <Route path="/daily" element={<DailyChallenge />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;