"""
Export bib from zotero

License : BSD
Author : Dheepak Krishnamurthy
"""

import os

import requests


def main():

    api_key = os.environ['ZOTERO_API_KEY']
    user_id = os.environ['ZOTERO_USER_ID']
    collection_key = os.environ['ZOTERO_COLLECTION_KEY']

    url = 'https://api.zotero.org/users/{}/collections/{}/items?key={}&format=bibtex&limit=1000'.format(user_id, collection_key, api_key)
    r = requests.get(url)

    with open('./content/blog.bib', 'w') as f:
        content = r.content.decode("utf-8").replace("_????", "")
        f.write(content)

if __name__ == '__main__':
    main()

