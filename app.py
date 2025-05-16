from flask import Flask, request, jsonify
import os
import random
import json
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
import time

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)  # Enable CORS for all routes

def extract_youtube_id(url):
    pattern = r"(?:youtube\.com/(?:.*v=|v/|embed/|shorts/)|youtu\.be/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern, url)
    return match.group(1) if match else None

@app.route('/api/get_random_song', methods=['POST'])
def get_random_song():
    # print(request.get_json())
    try:
        param = request.get_json()
        year = int(param['year'])
        difficulty = param['difficulty'].lower()
        
        year_max = year
        # Remove strict assertion - handle all valid years
        if year_max <= 1980:
            return jsonify({"error": "Please select a year after 1980"}), 400
            
        year_min = str(int(year_max)-20)

        level_map = {
            'easy' : ['rating_type_up', [1,2]],
            'medium': ['rating_type_up', [3,4]],
            'hard': ['rating_type_down', [7,8]],
            'extreme': ['rating_type_down', [3,4]]
        }
        
        if difficulty not in level_map:
            return jsonify({"error": f"Invalid difficulty: {difficulty}"}), 400

        # Add headers to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://myswar.co/',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
        
        page_id = random.choice(level_map[difficulty][1])
        url = f"https://myswar.co/advanced-search?pagid={page_id}&playlist=0&album_type=Film&from_year={year_min}&to_year={year_max}&album_language=Hindi&sort={level_map[difficulty][0]}&ut=3&result_type=songs"

        # Add retry mechanism
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = requests.get(url, headers=headers, timeout=10)
                response.raise_for_status()  # Raise exception for 4XX/5XX responses
                break
            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    return jsonify({"error": f"Failed to fetch songs after {max_retries} attempts: {str(e)}"}), 500
                time.sleep(1)  # Wait before retrying
        
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract song information with error handling
        song_labels = soup.find_all('a', class_='songs_like_this2')
        if not song_labels:
            return jsonify({"error": "No songs found for this year and difficulty"}), 404
            
        song_list = []
        for l in song_labels:
            try:
                parts = l.text.split("  ")
                if len(parts) >= 3:
                    song_list.append(parts[2][4:-2])
                else:
                    # Alternative parsing if the expected format isn't found
                    song_title = l.text.strip()
                    if song_title:
                        song_list.append(song_title)
            except Exception as e:
                print(f"Error parsing song title: {e}")
        
        if not song_list:
            return jsonify({"error": "Failed to parse song titles"}), 500
            
        movie_labels = soup.findAll('span', class_='attribute_lable', string='Album:')
        movie_list = []
        for s in movie_labels:
            try:
                sibling = s.find_next_sibling()
                if sibling:
                    parts = sibling.text.split("  ")
                    if len(parts) >= 3:
                        movie_list.append(parts[2][4:-3])
                    else:
                        movie_list.append(sibling.text.strip())
            except Exception as e:
                print(f"Error parsing movie title: {e}")
                movie_list.append("Unknown Movie")
        
        # If we couldn't find movie titles, use placeholders
        while len(movie_list) < len(song_list):
            movie_list.append("Unknown Movie")

        target_img_src = "//myswar.co/static/img/Youtube.png?v=794a0e9853abea7cd1e985551a646318f8ae8388"
        youtube_links = []
        for a_tag in soup.find_all('a'):
            img_tag = a_tag.find('img', src=target_img_src)
            if img_tag and 'href' in a_tag.attrs:
                youtube_id = extract_youtube_id(a_tag['href'])
                if youtube_id:
                    youtube_links.append(youtube_id)
        
        # If no YouTube links were found, return an error
        if not youtube_links:
            return jsonify({"error": "No YouTube links found for songs"}), 404
            
        # Make sure we have the same number of elements in each list
        min_length = min(len(song_list), len(movie_list), len(youtube_links))
        song_list = song_list[:min_length]
        movie_list = movie_list[:min_length]
        youtube_links = youtube_links[:min_length]
        
        Songs_list = list(zip(song_list, movie_list, youtube_links))
        
        if not Songs_list:
            return jsonify({"error": "No valid songs found"}), 404
            
        rsong = random.choice(Songs_list)
        random_song = {
            'title': rsong[0],
            'movie': rsong[1],
            'year': year,
            'difficulty': difficulty,
            'youtubeId': rsong[2]
        }
        
        return jsonify(random_song)
    
    except KeyError as e:
        return jsonify({"error": f"Missing required parameter: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter value: {str(e)}"}), 400
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/get_song_suggestions',methods=['POST'])
def get_song_list():
    try:
        param = request.get_json()
        year = int(param['year'])
        difficulty = param['difficulty'].lower()
        
        year_max = year
        # Remove strict assertion - handle all valid years
        if year_max <= 1980:
            return jsonify({"error": "Please select a year after 1980"}), 400
            
        year_min = str(int(year_max)-20)

        level_map = {
            'easy' : ['rating_type_up', [1,2,3,4]],
            'medium': ['rating_type_up', [5,6,7,8]],
            'hard': ['rating_type_down', [5,6,7,8]],
            'extreme': ['rating_type_down', [1,2,3,4]]
        }
        
        if difficulty not in level_map:
            return jsonify({"error": f"Invalid difficulty: {difficulty}"}), 400

        # Add headers to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://myswar.co/',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
        
        all_titles = []
        for page_id in level_map[difficulty][1]:
            url = f"https://myswar.co/advanced-search?pagid={page_id}&playlist=0&album_type=Film&from_year={year_min}&to_year={year_max}&album_language=Hindi&sort={level_map[difficulty][0]}&ut=3&result_type=songs"

            # Add retry mechanism
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = requests.get(url, headers=headers, timeout=10)
                    response.raise_for_status()  # Raise exception for 4XX/5XX responses
                    break
                except requests.exceptions.RequestException as e:
                    if attempt == max_retries - 1:
                        return jsonify({"error": f"Failed to fetch songs after {max_retries} attempts: {str(e)}"}), 500
                    time.sleep(1)  # Wait before retrying
        
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract song information with error handling
            song_labels = soup.find_all('a', class_='songs_like_this2')
            if not song_labels:
                return jsonify({"error": "No songs found for this year and difficulty"}), 404
                
            song_list = []
            for l in song_labels:
                try:
                    parts = l.text.split("  ")
                    if len(parts) >= 3:
                        song_list.append(parts[2][4:-2])
                    else:
                        # Alternative parsing if the expected format isn't found
                        song_title = l.text.strip()
                        if song_title:
                            song_list.append(song_title)
                except Exception as e:
                    print(f"Error parsing song title: {e}")
            
            if not song_list:
                return jsonify({"error": "Failed to parse song titles"}), 500
            
            all_titles.extend(song_list)
            
        all_songs = {
            'all':all_titles
        }
        
        return jsonify(all_songs)
    
    except KeyError as e:
        return jsonify({"error": f"Missing required parameter: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter value: {str(e)}"}), 400
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Serve React App
@app.route('/')
def serve():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)