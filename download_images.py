import os
import requests
import random
import time

# Directory where images will be saved
save_dir = "gallery_images"

# Ensure the directory exists
if not os.path.exists(save_dir):
    os.makedirs(save_dir)

# Function to download an image
def download_image(index):
    try:
        # Using picsum.photos for random images
        # Adding a random seed to ensure different images if cached
        url = f"https://picsum.photos/400/400?random={random.randint(1, 10000)}"
        
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            filename = f"img{index}.jpg"
            filepath = os.path.join(save_dir, filename)
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"Downloaded: {filename}")
        else:
            print(f"Failed to download image {index}. Status code: {response.status_code}")
            
    except Exception as e:
        print(f"Error downloading image {index}: {e}")

# Download 25 images
print("Starting download of 25 dummy images...")
for i in range(1, 26):
    download_image(i)
    time.sleep(0.5) # Be polite to the server

print("Download complete!")
