from pelican.readers import BaseReader
from pelican import signals

import os
import json
import logging

import pypandoc

from . import pandoc_notebook
from . import content_anchor

logger = logging.getLogger(__name__)


class PandocReader(BaseReader):
    enabled = True
    file_extensions = ['md']
    output_format = 'html5'

    METADATA_TEMPLATE = os.path.join(os.path.dirname(os.path.realpath(__file__)),
                             'metadata.template')

    def read(self, filename):
        # Get meta data
        metadata = self.read_metadata(filename)

        # Get content
        self.process_settings()
        content = pypandoc.convert_file(filename, to=self.output_format, extra_args=self.extra_args, filters=self.filters)

        content = self.process_plugins(content)

        return content, metadata

    def process_plugins(self, content):

        content = pandoc_notebook.notebook(content)
        content = content_anchor.process_content(content)

        return content

    def read_metadata(self, path, format=None):
        metadata_json = pypandoc.convert_file(path, to=self.output_format, format=format,
                                     extra_args=['--template', self.METADATA_TEMPLATE])

        _metadata = json.loads(metadata_json)
        metadata = dict()
        for key, value in _metadata.items():
            metadata[key] = self.process_metadata(key, value)

        return metadata

    def process_settings(self):
        self.extra_args = self.settings.get('PANDOC_ARGS', [])
        self.filters = self.settings.get('PANDOC_EXTENSIONS', [])


def add_reader(readers):
    for ext in PandocReader.file_extensions:
        readers.reader_classes[ext] = PandocReader

def register():
    logger.debug("Registering pandoc_reader plugin.")
    signals.readers_init.connect(add_reader)


