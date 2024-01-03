import requests

# Define the API endpoint
api_url = "http://127.0.0.1:8000/api/login/"

# Define the credentials (username and password)
credentials = {
    'username': 'akash',
    'password': '1',
}

# Make a POST request to obtain the token
response = requests.post(api_url, json=credentials)

# Check the response status
if response.status_code == 200:
    # Token obtained successfully
    token_data = response.json()
    access_token = token_data['access']
    refresh_token = token_data['refresh']
    print(f"Access Token: {access_token}")
    print(f"Refresh Token: {refresh_token}")
else:
    # Failed to obtain the token
    print(f"Failed to obtain token. Status Code: {response.status_code}")
    print(f"Response content: {response.content}")
