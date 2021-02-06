import os

from PIL import Image
from os import listdir
from os.path import isfile, join
import math

photo_path = r"C:\Users\Petra Kumi\IdeaProjects\portfolioSite\__no_sync\s3Photos"
scaled_photo_path = r"C:\Users\Petra Kumi\IdeaProjects\portfolioSite\__no_sync\s3ScaledPhotos"
all_photos = [f for f in listdir(photo_path) if isfile(join(photo_path, f))]
all_compression_sizes = [100, 300, 500, 750, 1000, 1500, 2500]


def compress_photo(a_photo, compression_size):
    print('photo: ' + a_photo)
    img = Image.open(a_photo)
    w, h = img.size

    if max(w, h) == w:
        new_width = compression_size
        ratio = w / compression_size
        new_height = math.ceil(h / ratio)
    else:
        new_height = compression_size
        ratio = h / compression_size
        new_width = math.ceil(w / ratio)

    print('new resolution ' + str(new_width) + "x" + str(new_height))

    img = img.resize((new_width, new_height), Image.ANTIALIAS)
    return img

def make_full_save_path(compression_size, photo_name):
    return os.path.join(scaled_photo_path + "_" + str(compression_size), photo_name)


def save_photo(a_photo, save_path):
    a_photo.save(save_path, optimize=True, quality=100)


for compression_size in all_compression_sizes:
    for photo_name in all_photos:
        photo = photo_path + "\\" + photo_name
        compressed_photo = compress_photo(photo, compression_size)
        save_path = make_full_save_path(compression_size, photo_name)
        save_photo(compressed_photo, save_path)
