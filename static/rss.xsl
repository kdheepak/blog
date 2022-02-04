<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" version="1.0">
    <xsl:output method="xml"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width"/>
                <title><xsl:value-of select="rss/channel/title"/> (RSS)</title>
                <link rel="stylesheet" href="/css/app.css"/>
                <link rel="stylesheet" href="/css/tufte.css"/>
                <link rel="stylesheet" href="/css/tufte-extra.css"/>
                <link rel="stylesheet" href="/css/latex.css"/>
                <link rel="stylesheet" href="/css/pandoc.css"/>
            </head>
            <body>
                <article>
                    <header>
                    <h1>
                        <abbr title="Really Simple Syndication">RSS</abbr> feed for
                        <a>
                            <xsl:attribute name="href">
                                <xsl:value-of select="rss/channel/link"/>
                            </xsl:attribute>
                            <xsl:value-of select="rss/channel/title"/>
                        </a>
                    </h1>
                    </header>
                    <section>
                        <p>You may use the <acronym title="Uniform Resource Locater">URL</acronym> of this document or copy the address below and paste it for any RSS purposes.
                        <br/>
                        <label for="address">RSS address: </label>
                        <input style="width:300px">
                            <xsl:attribute name="id">address</xsl:attribute>
                            <xsl:attribute name="spellcheck">false</xsl:attribute>
                            <xsl:attribute name="value">
                                <xsl:value-of select="rss/channel/atom:link[@rel='self']/@href"/>
                            </xsl:attribute>
                        </input>
                        </p>
                        <p>New to feeds? You can find out more about the RSS file format at <a href="http://en.wikipedia.org/wiki/RSS_(file_format)">Wikipedia's RSS entry</a> or by clicking <a target="_blank" href="https://duckduckgo.com/?q=how+to+get+started+with+rss+feeds">here</a> to search on the web to learn more.</p>
                        <h3>Recent blogs:</h3>
                        <xsl:for-each select="rss/channel/item">
                            <p>
                                <a>
                                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title"/>
                                </a>
                            </p>
                        </xsl:for-each>
                    </section>
                </article>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
