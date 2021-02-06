# add location metadata for each photo
# delete all the photos form s3 bucket
# iterate through all images in the takeout folder
# save the image to s3 with the json file info as metadata
# save each photo in separate folder with different size
#-----------------------------------------------------------

import json
import boto3
from botocore.exceptions import ClientError
from flask import logging
