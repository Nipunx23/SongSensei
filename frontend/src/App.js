import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
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

function useUserSession() {
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    // Check for existing userId in localStorage
    let id = localStorage.getItem('songsensei_user_id');
    
    // If no userId exists, create a new one
    if (!id) {
      id = uuidv4();
      localStorage.setItem('songsensei_user_id', id);
    }
    
    setUserId(id);
  }, []);
  
  return userId;
}

const FALLBACK_SONGS = [
  {
    "title": "Pehla Nasha",
    "movie": "Jo Jeeta Wohi Sikandar",
    "year": 1992,
    "youtubeId": "ZYotlBxpM3Q",
    "difficulty": "easy"
  },
  {
    "title": "Tujhe Dekha To",
    "movie": "Dilwale Dulhania Le Jayenge",
    "year": 1995,
    "youtubeId": "vCTW2GfcepQ",
    "difficulty": "easy"
  },
  {
    "title": "Chaiyya Chaiyya",
    "movie": "Dil Se",
    "year": 1998,
    "youtubeId": "K-pX4qwtAxA",
    "difficulty": "easy"
  },
  {
    "title": "Kajra Re",
    "movie": "Bunty Aur Babli",
    "year": 2005,
    "youtubeId": "4dsFQFCvVGU",
    "difficulty": "easy"
  },
  {
    "title": "Tumse Milke Dil Ka",
    "movie": "Main Hoon Na",
    "year": 2004,
    "youtubeId": "mXkbWKr5ovU",
    "difficulty": "easy"
  },
  {
    "title": "Raabta",
    "movie": "Agent Vinod",
    "year": 2012,
    "youtubeId": "zlt38OOqwDc",
    "difficulty": "medium"
  },
  {
    "title": "Kabira",
    "movie": "Yeh Jawaani Hai Deewani",
    "year": 2013,
    "youtubeId": "jHNNMj5bNQw",
    "difficulty": "medium"
  },
  {
    "title": "Tum Hi Ho",
    "movie": "Aashiqui 2",
    "year": 2013,
    "youtubeId": "Umqb9KENgmk",
    "difficulty": "medium"
  },
  {
    "title": "Ghungroo",
    "movie": "War",
    "year": 2019,
    "youtubeId": "qFkNATtc3mc",
    "difficulty": "medium"
  },
  {
    "title": "Chaleya",
    "movie": "Jawan",
    "year": 2023,
    "youtubeId": "VAdGW7QDJiU",
    "difficulty": "medium"
  },
  {
    "title": "Besharam Rang",
    "movie": "Pathaan",
    "year": 2022,
    "youtubeId": "huxhqphtDrM",
    "difficulty": "hard"
  },
  {
    "title": "Jhoome Jo Pathaan",
    "movie": "Pathaan",
    "year": 2023,
    "youtubeId": "YxWlaYCA8MU",
    "difficulty": "hard"
  },
  {
    "title": "Tere Vaaste",
    "movie": "Zara Hatke Zara Bachke",
    "year": 2023,
    "youtubeId": "g5WZLO8BAC8",
    "difficulty": "hard"
  },
  {
    "title": "Phir Aur Kya Chahiye",
    "movie": "Zara Hatke Zara Bachke",
    "year": 2023,
    "youtubeId": "8sLS2knUa6Y",
    "difficulty": "hard"
  },
  {
    "title": "Arjan Vailly",
    "movie": "Animal",
    "year": 2023,
    "youtubeId": "zqGW6x_5N0k",
    "difficulty": "hard"
  },
  {
    "title": "Mein Parwaana",
    "movie": "Pippa",
    "year": 2023,
    "youtubeId": "BDKjWnPZYPQ",
    "difficulty": "extreme"
  },
  {
    "title": "Zinda Banda",
    "movie": "Jawan",
    "year": 2023,
    "youtubeId": "stjZKBhQ3lg",
    "difficulty": "extreme"
  },
  {
    "title": "Chaleya (Arabic Version)",
    "movie": "Jawan",
    "year": 2023,
    "youtubeId": "WDqeSZNXQOI",
    "difficulty": "extreme"
  },
  {
    "title": "Aararaari Raaro",
    "movie": "Jawan",
    "year": 2023,
    "youtubeId": "cTtUOtiVUXQ",
    "difficulty": "extreme"
  }
];


// This function selects a random song from our fallback list
const getRandomFallbackSong = () => {
  const randomIndex = Math.floor(Math.random() * FALLBACK_SONGS.length);
  return FALLBACK_SONGS[randomIndex];
};

function UnlimitedMode() {
  const navigate = useNavigate();
  const userId = useUserSession(); // Add user session
  const [difficulty, setDifficulty] = useState('medium');
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streak, setStreak] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [score, setScore] = useState(0); // Add score counter
  const [guessInput, setGuessInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [slideDirection, setSlideDirection] = useState('');
  const [allTitles, setAllTitles] = useState([]);
  const [randStart, setRandStart] = useState(Math.floor(Math.random() * 31) + 10);
  const [playerReady, setPlayerReady] = useState(false);
  const [genre, setGenre] = useState('all'); // 'all', 'bollywood', 'hiphop'
  // Add state for progressive timer
  const [playTime, setPlayTime] = useState(500); // Start with 0.5 seconds (in milliseconds)
  
  const MAX_GUESSES = 5;
  // Remove fixed PLAY_TIME constant and use state instead
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const backgroundPlayerRef = useRef(null);

  // Function to generate random year from 1931 to 2021 with step size 10
  const getRandomYear = () => {
    const years = [];
    for (let year = 1981; year <= new Date().getFullYear(); year += 10) {
      years.push(year);
    }
    return years[Math.floor(Math.random() * years.length)];
  };

  // Fetch song suggestions based on input
  useEffect(() => {
    const delayDoubounce = setTimeout(() => {
      if (guessInput.length > 2) {
        fetchSongSuggestions(guessInput);
      } else {
        setSuggestions([]);
      }
    }, 50);
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
    console.log("Loading YouTube video:", videoId);
    
    if (!youtubeContainerRef.current) {
      console.warn("YouTube container not mounted yet. Skipping video load.");
      return;
    }

    // Clean up any existing player first
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch (err) {
        console.error("Error destroying previous player:", err);
      }
      playerRef.current = null;
    }

    // Clear any existing timers
    if (youtubeTimerRef.current) {
      clearTimeout(youtubeTimerRef.current);
      youtubeTimerRef.current = null;
    }

    // Create unique player ID with timestamp
    const uniquePlayerId = `youtube-player-${userId}-${Date.now()}`;
    youtubeContainerRef.current.innerHTML = `<div id="${uniquePlayerId}"></div>`;

    // Reset player ready state
    setPlayerReady(false);

    // Small delay to ensure DOM is updated
    setTimeout(() => {
      try {
        playerRef.current = new window.YT.Player(uniquePlayerId, {
          height: '0',
          width: '0',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              console.log("YouTube player ready for:", videoId);
              setPlayerReady(true);
            },
            onError: (e) => {
              console.error("YouTube error:", e);
              setError("Could not load YouTube video.");
              setPlayerReady(false);
            },
            onStateChange: (event) => {
              console.log("Player state changed:", event.data);
            }
          }
        });
      } catch (err) {
        console.error("Error creating YouTube player:", err);
        setPlayerReady(false);
      }
    }, 100);
  };

  // Load YouTube video when songData changes and game is playing
  useEffect(() => {
    if (songData?.youtubeId && userId && gameStatus === 'playing') {
      console.log("Effect triggered - loading video:", songData.youtubeId);
      const timeoutId = setTimeout(() => {
        loadYouTubeVideo(songData.youtubeId);
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [songData?.youtubeId, userId, gameStatus]);

  const loadBackgroundVideo = (videoId, startTime = 0) => {
    const container = document.querySelector(".youtube-blur-player");

    if (!container) {
      console.warn("Background container not mounted yet.");
      return;
    }

    if (backgroundPlayerRef.current?.destroy) {
      backgroundPlayerRef.current.destroy();
      backgroundPlayerRef.current = null;
    }

    const id = `youtube-blur-player-${userId}-${Date.now()}`;
    container.innerHTML = `<div id="${id}"></div>`;

    backgroundPlayerRef.current = new window.YT.Player(id, {
      height: '360',
      width: '640',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        start: startTime,
        mute: 0,
        loop: 1,
        playlist: videoId
      }
    });
  };

  useEffect(() => {
    if ((gameStatus === 'won' || gameStatus === 'lost' || gameStatus === 'skipped') && songData?.youtubeId) {
      loadBackgroundVideo(songData.youtubeId, randStart);
    }
  }, [gameStatus]);

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
          .slice(0, 10);

        if (
          correctTitle.toLowerCase().includes(inputLower) &&
          input.length >= correctTitle.length/5 &&
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

  const handleDifficultySubmit = async (e) => {
    e.preventDefault();
    
    const randomYear = getRandomYear();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://songsensei-backend.onrender.com/api/get_random_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          year: randomYear, 
          difficulty: difficulty,
          genre: 'all',
          userId: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch song');
      }
      
      const data = await response.json();
      setSongData(data);
      setGuesses([]);
      setGameStatus('playing');
      setPlayTime(500);
      setRandStart(Math.floor(Math.random() * 31) + 10);

      try {
        const suggestionResponse = await fetch('https://songsensei-backend.onrender.com/api/get_song_suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            year: randomYear, 
            difficulty,
            genre: genre,
            userId: userId
          }),
        });

        const suggestionData = await suggestionResponse.json();
        setAllTitles(suggestionData.all || []);
      } catch (suggestionErr) {
        // If we can't get suggestions, use the fallback song titles
        setAllTitles(FALLBACK_SONGS.map(song => song.title));
      }

    } catch (err) {
      // Display error message but continue with fallback
      console.error("API Error:", err.message);
      setError(`API Error: ${err.message}. Using fallback song.`);
      
      // Use a fallback song instead
      const fallbackSong = getRandomFallbackSong();
      setSongData(fallbackSong);
      setGuesses([]);
      setGameStatus('playing');
      setPlayTime(500);
      setRandStart(Math.floor(Math.random() * 31) + 10);
      
      // Use fallback song titles for suggestions
      setAllTitles(FALLBACK_SONGS.map(song => song.title));
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const playFor5Seconds = () => {
    if (!playerRef.current || !playerReady) {
      console.log("Player not ready:", { player: !!playerRef.current, ready: playerReady });
      return;
    }

    try {
      console.log("Starting playback from:", randStart, "for duration:", playTime);
      playerRef.current.seekTo(randStart);
      playerRef.current.playVideo();
      
      const checkPlaying = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
          const state = playerRef.current.getPlayerState();
          console.log("Player state:", state);
          
          if (state === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            clearInterval(checkPlaying);

            // Now start the timer with the current playTime value
            youtubeTimerRef.current = setTimeout(() => {
              if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
                playerRef.current.pauseVideo();
              }
              setIsPlaying(false);
            }, playTime);
          }
        }
      }, 100);

      // Safety timeout to clear the interval if player doesn't start
      setTimeout(() => {
        clearInterval(checkPlaying);
        if (isPlaying) setIsPlaying(false);
      }, playTime > 5000 ? playTime + 1000 : 5000);
    } catch (err) {
      console.error("Error playing YouTube video:", err);
      setIsPlaying(false);
    }
  };

  // Add the skip song function
  const skipSong = () => {
    // Mark as lost round
    setGameStatus('skipped');
    setStreak(0); // Reset streak on skip
    setRoundsPlayed(roundsPlayed + 1);
  };

  // Clean up everything related to YouTube player and timers
  const cleanupYouTubePlayer = () => {
    console.log("Cleaning up YouTube players...");
    
    // Clean up background player
    if (backgroundPlayerRef.current) {
      try {
        if (typeof backgroundPlayerRef.current.destroy === 'function') {
          backgroundPlayerRef.current.destroy();
        }
      } catch (err) {
        console.error("Error destroying background player:", err);
      }
      backgroundPlayerRef.current = null;
    }
    
    // Clean up YouTube timer
    if (youtubeTimerRef.current) {
      clearTimeout(youtubeTimerRef.current);
      youtubeTimerRef.current = null;
    }
    
    // Clean up main player
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch (err) {
        console.error("Error destroying main player:", err);
      }
      playerRef.current = null;
    }

    // Reset states
    setIsPlaying(false);
    setPlayerReady(false);
  };

  useEffect(() => {
    return () => {
      cleanupYouTubePlayer();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Function to increase play time with each wrong guess
  const increasePlayTime = () => {
    // The sequence is 0.1 -> 0.5 -> 1 -> 5 -> 10 seconds
    switch (playTime) {
      case 500: // 0.5 seconds
        setPlayTime(1000); // 1 second
        break;
      case 1000: // 1 second
        setPlayTime(2000); // 5 seconds
        break;
      case 2000: // 0.1 seconds
        setPlayTime(5000); // 0.5 seconds
        break;
      case 5000: // 5 seconds
        setPlayTime(10000); // 10 seconds
        break;
      default:
        // Don't increase further
        setPlayTime(10000);
    }
  };

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
      // Add points to score based on number of remaining guesses
      const remainingGuesses = MAX_GUESSES - newGuesses.length + 1;
      const pointsEarned = remainingGuesses * 100;
      setScore(score + pointsEarned);
      setRoundsPlayed(roundsPlayed + 1);
    } else {
      // Incorrect guess - increase play time
      increasePlayTime();
      
      if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
        setStreak(0);
        setRoundsPlayed(roundsPlayed + 1);
      }
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

  const handleGenreChange = (newGenre) => {
    if (genre !== newGenre) {
      setGenre(newGenre);
      if (songData) {
        nextSong(); // reloads song without resetting score
      }
    }
  };

  const nextSong = () => {
    console.log("Next song clicked - cleaning up...");
    
    setSlideDirection('slide-left');
    
    // Immediately clean up players and reset states
    cleanupYouTubePlayer();
    
    // Wait for animation before resetting state
    setTimeout(() => {
      console.log("Animation complete - resetting for new song...");
      
      // Reset game state
      setGuesses([]);
      setGameStatus('playing');
      setSlideDirection('');
      setPlayTime(500); // Reset play time for new song
      
      // Fetch a new song with random year
      handleFetchNewSong();
    }, 500);
  };
  
  // Function to fetch a new song using random year and existing difficulty
  const handleFetchNewSong = async () => {
    const randomYear = getRandomYear();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://songsensei-backend.onrender.com/api/get_random_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          year: randomYear, 
          difficulty: difficulty,
          genre: genre, 
          userId: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch song');
      }
      
      const data = await response.json();
      console.log("New song loaded:", data.title);
      setSongData(data);
      setRandStart(Math.floor(Math.random() * 31) + 10);
    } catch (err) {
      // Display error message but don't stop the game
      console.error("API Error:", err.message);
      setError(`API Error: ${err.message}. Using fallback song.`);
      
      // Use a fallback song instead
      const fallbackSong = getRandomFallbackSong();
      console.log("Using fallback song:", fallbackSong.title);
      setSongData(fallbackSong);
      setRandStart(Math.floor(Math.random() * 31) + 10);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    // Make sure to clean up before navigation
    cleanupYouTubePlayer();
    navigate('/');
  };

  const goBackToDifficultySelection = () => {
    // Clean up YouTube player and reset game state
    cleanupYouTubePlayer();
    setSongData(null);
    setGuesses([]);
    setGameStatus('playing');
    setSlideDirection('');
    setPlayTime(500);
    setIsPlaying(false);
    setPlayerReady(false);
    setError(null);
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

  // Format play time for display
  const formatPlayTime = (ms) => {
    return (ms / 1000).toFixed(1) + 's';
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
            <div className="score">
              <span>Score:</span> {score}
            </div>
          </div>
        )}
      </div>

      {songData ? (
        <div className={`game-area ${slideDirection}`}>

          <div className="genre-selection">
            <h2>Select genre:</h2>
            <div className="genre-slider">
              {['all', 'bollywood', 'hiphop'].map((g) => (
                <div
                  key={g}
                  className={`genre-option ${genre === g ? 'selected' : ''}`}
                  onClick={() => handleGenreChange(g)}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </div>
              ))}
            </div>
          </div>
          
          
          <h2>Guess the Song!</h2>
            <h4>
              {genre === 'hiphop'
                ? ``
                : songData.year < 1970 
                  ? `1950-${new Date().getFullYear()}` 
                  : `${songData.year-songData.year%10-5}-${Math.min(songData.year-songData.year%10+15,new Date().getFullYear())}`
              }
            </h4>
          
          <div ref={youtubeContainerRef} className="youtube-container">
            {/* YouTube player will be created here */}
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
                disabled={!playerReady || isPlaying || gameStatus !== 'playing' || loading}
              >
                {loading ? 'Loading...' : isPlaying ? `Playing... (${formatPlayTime(playTime)})` : `Play Clip (${formatPlayTime(playTime)})`}
              </button>
              
              {/* Add the Skip Song button */}
              {gameStatus === 'playing' && (
                <button 
                  className="skip-button" 
                  onClick={skipSong}
                  disabled={isPlaying}
                >
                  Skip Song
                </button>
              )}
              
              {isPlaying && (
                <div className="progress-bar">
                  <div className="progress" style={{
                    animationDuration: `${playTime/1000 + 0.2}s` // Adjust animation duration to match play time
                  }}></div>
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
                  <h3>You got it right!</h3>
                ) : gameStatus === 'skipped' ? (
                  <h3>Song Skipped!</h3>
                ) : (
                  <h3>Better luck next time!</h3>
                )}
                <div className="song-details">
                  <p className="song-title">{songData.title}</p>
                  <p className="song-movie">From: {songData.movie}</p>
                  <p className="song-difficulty">Difficulty: <span className={`difficulty-badge ${songData.difficulty}`}>{songData.difficulty}</span></p>
                  {gameStatus === 'won' && (
                    <p className="points-earned">
                      Points earned: +{(MAX_GUESSES - guesses.length + 1) * 100}
                    </p>
                  )}
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

          {(gameStatus === 'won' || gameStatus === 'lost' || gameStatus === 'skipped') && (
            <div className="video-background">
              <div id="video-blur-layer"></div>
              <div className="youtube-blur-player"></div>
            </div>
          )}

        </div>
      ) : (
        <div className="year-selection">
          <form onSubmit={handleDifficultySubmit}>
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
